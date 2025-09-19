<template>
  <SidePanel
    :title="`Зуб ${selectedTooth.id}`"
    :is-open="isOpen"
    @close="onClosePanel"
    @clear="onClearClick"
    @onOpen="onOpenSidePanel"
    @onSaveChanged="saveChanges"
  >
    <div class="work-type-body flex-grow-1">
      <!-- container-fluid нужен, чтобы компенсировать отрицательные margin у .row -->
      <div class="container-fluid px-0 h-100">
        <div class="work-type-grid">
          <div
            v-for="workType in availableWorkTypes"
            :key="workType.id"
            class="d-inline-flex"
            style="flex: 0 1 auto; min-width: 300px"
            @click="toggleWorkType(workType)"
          >
            <!-- Карточка растягивается на всю ширину и высоту колонки -->
            <WorkTypeCardItem :workType="workType" class="d-inline-flex" />
          </div>

          <span
            v-if="availableWorkTypes.length === 0"
            class="text-muted d-block mt-2"
          >
            Нет доступных типов работ
          </span>
        </div>
      </div>
    </div>
  </SidePanel>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  ORDER_SELECTED_TEETH,
  SELECTED_TOOTH,
  SET_ORDER_SELECTED_TEETH,
  SET_SELECTED_TOOTH,
} from "../store/types";
import SidePanel from "./SidePanel.vue";
import WorkTypeCardItem from "./WorkTypeCardItem.vue";
import ToothSelection from "./ToothSelection.vue";

export default {
  name: "WorkTypeSelector", // имя компонента Vue
  components: { SidePanel, WorkTypeCardItem }, // подключаемые компоненты
  props: {
    isOpen: { type: Boolean, required: true }, // флаг, открыта ли боковая панель
    availableWorkTypes: { type: Array, required: true }, // список всех доступных типов работ
  },
  data() {
    return {
      selectedWorkTypes: [], // массив выбранных типов работ для текущего зуба
    };
  },
  computed: {
    ...mapGetters({
      selectedTooth: SELECTED_TOOTH, // геттер для выбранного зуба из Vuex
      orderSelectedTeeth: ORDER_SELECTED_TEETH, // геттер для массива выбранных зубов с их типами работ
    }),
  },
  methods: {
    ...mapActions({
      setSelectedTooth: SET_SELECTED_TOOTH, 
      setOrderSelectedTeeth: SET_ORDER_SELECTED_TEETH,
    }),
    /** 
     * Метод вызывается при открытии боковой панели.
     * Очищает предыдущие выбранные типы работ и устанавливает текущие для выбранного зуба.
     */
    onOpenSidePanel() {
      this.onClearClick(); // снимаем все отметки с доступных типов работ
      this.selectedWorkTypes = this.selectedTooth.workTypes.slice(); // копируем текущие типы работ выбранного зуба
      this.availableWorkTypes.forEach(w => {
        if (this.selectedWorkTypes.find(t => t.id == w.id)){
          w.isSelected = true; // помечаем как выбранные
        }
      });
    },
    /** 
     * Проверяет, выбран ли конкретный тип работы.
     * @param {Object} workType - объект типа работы
     * @returns {Boolean} true, если выбран
     */
    isSelected(workType) {
      return this.selectedWorkTypes.some((w) => w.id === workType.id);
    },
    /** 
     * Снимает все выбранные типы работ на панели.
     * Используется при очистке или при открытии панели.
     */
    onClearClick() {
      this.availableWorkTypes.forEach((t) => (t.isSelected = false)); // снимаем отметку со всех
      this.selectedWorkTypes = []; // очищаем массив выбранных
    },

    /** 
     * Переключает выбор конкретного типа работы.
     * @param {Object} workType - объект типа работы
     */
    toggleWorkType(workType) {
      workType.isSelected = !workType.isSelected; // меняем флаг выбранности
      if (this.isSelected(workType)) {
        // если тип уже есть в выбранных, удаляем
        this.selectedWorkTypes = this.selectedWorkTypes.filter(
          (w) => w.id !== workType.id
        );
      } else {
        // если нет — добавляем
        this.selectedWorkTypes.push(workType);
      }
      this.$emit("select", this.selectedWorkTypes); // уведомляем родителя о выборе
    },
    /** 
     * Метод вызывается при закрытии боковой панели.
     * Снимает выделение с текущего зуба и обновляет его в Vuex.
     */
    async onClosePanel() {
      this.selectedTooth.isSelected = false; // убираем выделение с зуба
      await this.setSelectedTooth(this.selectedTooth); // сохраняем изменения в Vuex
      this.$emit("applyChangesToSelectedTooth"); // уведомляем родителя о применении изменений
    },
    /** 
     * Сохраняет выбранные типы работ и выбранный зуб.
     * Обновляет массив выбранных зубов в Vuex и выделяет цветом в компоненте выбора зубов.
     */
    async saveChanges() {
      let orderTooth = {
        toothId: this.selectedTooth.id, // ID зуба
        workTypes: this.selectedWorkTypes.slice(), // копия массива выбранных типов работ
      };

      let existedOrderTooth = this.orderSelectedTeeth.find(
        (o) => o.toothId == orderTooth.toothId
      ); // проверяем, есть ли зуб в массиве выбранных

      if (!existedOrderTooth) {
        // если зуб не найден, добавляем его в начало массива
        const a = [orderTooth, ...this.orderSelectedTeeth];
        this.setOrderSelectedTeeth(a); // сохраняем в Vuex
      } else {
        existedOrderTooth = orderTooth; // если есть — обновляем объект
        console.log("Обновляю типы работы для существующего зуба");
        let indexOfOrderTeeth = this.orderSelectedTeeth.findIndex(o => o.toothId == orderTooth.toothId);
        if (indexOfOrderTeeth >= 0) {
          this.orderSelectedTeeth[indexOfOrderTeeth] = orderTooth;
        }
      }

      console.log(this.orderSelectedTeeth); // вывод текущего состояния массива

      // визуально выделяем выбранный зуб
      this.selectedTooth.isSelected = false; // снимаем выделение
      this.selectedTooth.workTypes = orderTooth.workTypes;
      this.selectedTooth.background_color =
        this.selectedTooth.workTypes.length > 0
          ? this.selectedTooth.workTypes[0].background_color // цвет первого выбранного типа
          : null; // если нет выбранных типов — цвет не устанавливаем
      this.selectedTooth.removeColored = this.selectedTooth.workTypes.length == 0;
      console.log("Выбранные типы работ", this.selectedWorkTypes); // лог выбранных типов

      await this.setSelectedTooth(this.selectedTooth); // сохраняем выбранный зуб в Vuex
      await this.$emit("applyChangesToSelectedTooth"); // уведомляем родителя о применении изменений
      //this.$emit("close"); // ранее можно было закрывать панель
    },
  },
};

</script>

<style scoped>
.work-type-card {
  width: 100%; /* не шире колонки */
  height: 100%; /* растягивается по Y */
  box-sizing: border-box; /* учитываем padding/border */
  width: 100%;
  box-sizing: border-box;
  word-break: break-word; /* переносим длинные слова */
  overflow-wrap: break-word; /* резервный вариант */
  display: flex;
  flex-direction: row;
  justify-content: flex-start; /* содержимое сверху */
}
.work-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem; /* расстояние между карточками */
}
</style>

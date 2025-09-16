<template>
  <SidePanel
    :title="`Зуб ${selectedTooth.id}`"
    :is-open="isOpen"
    @close="onClosePanel"
    @clear="onClearClick"
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

export default {
  name: "WorkTypeSelector",
  components: { SidePanel, WorkTypeCardItem },
  props: {
    isOpen: { type: Boolean, required: true },
    availableWorkTypes: { type: Array, required: true },
  },
  data() {
    return {
      selectedWorkTypes: [], // выбранные типы работ
    };
  },
  computed: {
    ...mapGetters({
      selectedTooth: SELECTED_TOOTH,
      orderSelectedTeeth: ORDER_SELECTED_TEETH,
    }),
  },
  methods: {
    ...mapActions({
      setSelectedTooth: SET_SELECTED_TOOTH, // используется для выделения.снятия выделения с конкретного зуба в компоненте выбора зубов
      setOrderSelectedTeeth: SET_ORDER_SELECTED_TEETH,
    }),
    isSelected(workType) {
      return this.selectedWorkTypes.some((w) => w.id === workType.id);
    },
    onClearClick() {
      this.availableWorkTypes.forEach(t => t.isSelected = false);
      this.selectedWorkTypes = [];
    },
    toggleWorkType(workType) {
      workType.isSelected = !workType.isSelected;
      if (this.isSelected(workType)) {
        this.selectedWorkTypes = this.selectedWorkTypes.filter(
          (w) => w.id !== workType.id
        );
      } else {
        this.selectedWorkTypes.push(workType);
      }
      this.$emit("select", this.selectedWorkTypes);
    },
    async onClosePanel() {
      this.selectedWorkTypes = [];
      this.availableWorkTypes.forEach(t => t.isSelected = false);
      this.selectedTooth.isSelected = false; // при закрытии убираем выделенный зуб
      await this.setSelectedTooth(this.selectedTooth);
      this.$emit("applyChangesToSelectedTooth");
    },
    /**
     * Сохраняем выбранные типы работ и выбранный зуб
     */
    async saveChanges() {
      let orderTooth = {
        toothId: this.selectedTooth.id,
        workTypes: this.selectedWorkTypes,
      };

      let existedOrderTooth = this.orderSelectedTeeth.find(
        (o) => o.toothId == orderTooth
      );
      if (!existedOrderTooth) {
        existedOrderTooth = orderTooth;
      } else {
        await this.setOrderSelectedTeeth([
          ...orderTooth,
          ...this.orderSelectedTeeth,
        ]);
      }
      console.log([
          orderTooth,
          ...this.orderSelectedTeeth,
        ]);
      console.log('this.orderSelectedTeeth');

      return;
      this.$emit("close");
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

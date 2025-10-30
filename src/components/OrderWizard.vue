<template>
  <div
    class="container-fluid"
    style="padding-left: 0"
    v-if="isEditMode ? orderSelectedTeeth : true"
  >
    <div class="row">
      <!-- Левая часть -->
      <div class="col-md-4">
        <h5 class="mb-3">Пациент и заказ</h5>
        <form>
          <div class="form-floating mb-4">
            <input
              type="text"
              v-model="customer"
              class="form-control"
              id="floatingInput"
            />
            <label for="floatingInput">Заказчик</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="text"
              v-model="patient"
              class="form-control"
              id="floatingInput"
            />
            <label for="floatingInput">Пациент</label>
          </div>

          <div class="form-floating mb-4" title="До какого числа необходимо выполнить заказ">
            <input
              type="date"
              v-model="expectedDate"
              class="form-control"
              id="floatingInput"
              :min="new Date().toISOString().split('T')[0]"
            />
            <label for="floatingInput">Срок</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="number"
              v-model="price"
              min="0"
              max="10000"
              class="form-control"
              id="floatingInput"
            />
            <label for="floatingInput">Стоимость</label>
          </div>

          <div class="form-floating mb-4">
            <textarea
              type="text"
              v-model="description"
              class="form-control"
              id="floatingInput"
              rows="5"
              style="height: 120px"
            ></textarea>
            <label for="floatingInput">Комментарий</label>
          </div>
        </form>
      </div>

      <div class="col-md-4">
        <h5 class="mb-3">Типы работ</h5>
        <WorkTypeCardItem
          v-for="workType in filtredOrderSelectedTeethasWorktype"
          :workType="workType"
          :key="workType.id"
          style="margin-bottom: 10px"
        />

        <span
          v-if="filtredOrderSelectedTeethasWorktype.length === 0"
          class="text-muted d-block mt-2"
        >
          Нет выбранных типов работ
        </span>
      </div>
      <!-- Правая часть -->
      <div class="col-md-4 d-flex justify-content-center">
        <ToothSelection
          ref="toothSelection"
          @onToothSelectedChanged="selectedToothChnged"
          @onCopyToothData="copyToothData"
        />
      </div>
      <div class="col-md-8 saveOrderButton">
        <ButtonWithLoader
          :isLoading="isSaving"
          title="Сохранить"
          :customClasses="['btn-primary', 'w-100', 'brand-style']"
          :loadingText="'Сохранение...'"
          @click="createOrder"
          :isValid="isValid === true"
        />
      </div>
    </div>
    <SelectWorkTypeWizard
      :isOpen="isVisibleSelectWorkType"
      :availableWorkTypes="filteredWorkTypes"
      @select="
        (workType) => {
          if (!selectedWorkTypes.find((wt) => wt.id === workType.id)) {
            selectedWorkTypes.push(workType);
          }
        }
      "
      @close="
        () => {
          isVisibleSelectWorkType = false;
        }
      "
      @applyChangesToSelectedTooth="applyChangesToSelectedTooth"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import WorkTypeCardItem from "./WorkTypeCardItem.vue";
import ToothSelection from "./ToothSelection.vue";
import {
  CREATE_ORDER,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LOAD_WORK_TYPES,
  ORDER_SELECTED_TEETH,
  SELECTED_TOOTH,
  SET_ORDER_SELECTED_TEETH,
  SET_SELECTED_TOOTH,
  UPDATE_ORDER,
  WORK_TYPES,
} from "../store/types";
import SelectWorkTypeWizard from "./SelectWorkTypeWizard.vue";
import { convertOrderTeethToWorkTypes } from "../helpers/order-helpers";
import ButtonWithLoader from "./ButtonWithLoader.vue";

export default {
  name: "OrderWizard",
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    },
    orderToEdit: {
      type: Object,
      default: null,
    },
  },
  components: {
    ToothSelection,
    WorkTypeCardItem,
    SelectWorkTypeWizard,
    ButtonWithLoader,
  },
  data() {
    return {
      selectedWorkTypes: [],
      isVisibleSelectWorkType: false,
      customer: null,
      expectedDate: null,
      description: null,
      patient: null,
      selectedWorkType: null,
      selectedToothId: null,
      isSaving: false,
      price: null,
      isChanged: false,
      oldOrderData: null,
    };
  },
  async beforeMount() {
    // если режим редактирования, заполняем поля
    if (this.isEditMode) {
      this.oldOrderData = JSON.parse(JSON.stringify(this.orderToEdit));
      this.orderToEdit.teeth.forEach((t) => {
        t.toothId = t.tooth_id;
        t.workTypes = t.work_types;
      });
      this.setOrderSelectedTeeth(this.orderToEdit.teeth);
      this.price = this.orderToEdit.price;
      this.customer = this.orderToEdit.customer_name;
      this.patient = this.orderToEdit.patient_name;
      this.expectedDate = this.orderToEdit.expired_at
        ? this.orderToEdit.expired_at.split("T")[0]
        : null;
      this.description = this.orderToEdit.description;
    } else {
      // если режим создания нового заказа, очищаем выбранные зубы
      this.setOrderSelectedTeeth([]);
    }

    this.loadWorkTypes();
  },
  async mounted() {
    if (this.isEditMode) {
      console.log("Order to edit:", this.orderToEdit);
      // в режиме редактирования выделяем первый зуб из заказа
      this.orderToEdit.teeth.forEach(async (t) => {
        let selectedTooth = {};
        selectedTooth.id = t.tooth_id;
        selectedTooth.isSelected = false;
        selectedTooth.workTypes = t.work_types;
        selectedTooth.background_color = t.work_types.length
          ? t.work_types[0].background_color
          : null;

        await new Promise((resolve) => setTimeout(resolve, 100)); // небольшая задержка для корректного рендера
        await this.setSelectedTooth(selectedTooth).then(async () => {
          await this.$refs.toothSelection.applySelection();
        });
      });
    }
    // console.log("OrderWizard mounted");
  },
  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES,
      selectedTooth: SELECTED_TOOTH,
      orderSelectedTeeth: ORDER_SELECTED_TEETH,
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
    }),
    isValid() {
      let isValidData = (
        this.customer &&
        this.customer.trim().length > 0 &&
        this.patient &&
        this.patient.trim().length > 0 &&
        this.expectedDate &&
        this.orderSelectedTeeth.length > 0 &&
        this.filtredOrderSelectedTeethasWorktype.length > 0
      );
 
      if (this.isEditMode) {
        if (isValidData) {
          return this.customer.trim() !== this.oldOrderData.customer_name ||
            this.patient.trim() !== this.oldOrderData.patient_name ||
            this.price !== this.oldOrderData.price ||
            this.expectedDate !== (this.oldOrderData.expired_at ? this.oldOrderData.expired_at.split("T")[0] : null) ||
            (this.description ? this.description.trim() : null) !== this.oldOrderData.description ||
            this.hasTeethChanged(this.orderSelectedTeeth, this.oldOrderData.teeth);
        }

        return false;
      }

      return isValidData;
    },
    filteredWorkTypes() {
      return this.workTypes;
    },
    filtredOrderSelectedTeethasWorktype() {
      return convertOrderTeethToWorkTypes(this.orderSelectedTeeth.slice());
    },
    calcPrice() {
      let total = 0;
      if (this.isChanged) {
      }
      let steps = [];
      this.orderSelectedTeeth.forEach((t) => {
        t.workTypes.forEach((workType) => {
          workType.steps.forEach((step) => {
            if (!steps.some((s) => s.work_step_id == step.work_step_id)) {
              total += step.price;
              steps.push(step);
            }
          });
        });
      });

      return total;
    },
  },
  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES,
      createOrderAction: CREATE_ORDER,
      updateOrderAction: UPDATE_ORDER,
      setOrderSelectedTeeth: SET_ORDER_SELECTED_TEETH,
      setSelectedTooth: SET_SELECTED_TOOTH,
    }),
    /**
     * Событие выбора зуба
     * @param selectedTeeth
     */
    selectedToothChnged(toothId) {
      this.selectedToothId = toothId;
      let selectedWorkTypes = this.orderSelectedTeeth.find(
        (o) => o.toothId == this.selectedToothId
      );

      // находим данные выбранного зуба
      this.selectedTooth.workTypes = selectedWorkTypes ? selectedWorkTypes.workTypes : [];

      // запоминаем цвет выделения зуба
      this.setSelectedTooth({
        ...this.selectedTooth,
        background_color: this.selectedTooth.workTypes.length
          ? this.selectedTooth.workTypes[0].background_color
          : null,
      });
      this.isVisibleSelectWorkType = true;
    },
    openSidePanelSelectWorkType() {},
    isSelectedWorkType(workType) {
      return this.selectedWorkType && workType && this.selectedWorkType.id == workType.id;
    },
    async createOrder() {
      this.isSaving = true;
      let newOrder = {
        customer_name: this.customer.trim(),
        price: this.price,
        patient_name: this.patient.trim(),
        expired_at: this.expectedDate,
        description: this.description ? this.description.trim() : null,
        teeth: this.orderSelectedTeeth.map((t) => ({
          tooth_id: t.toothId,
          work_type_ids: t.workTypes.map((wt) => wt.id),
        })),
        callback: (createdOrder) => {
          this.$toast(`Заказ №${createdOrder.number} создан`, 7000);
          this.$router.push("/orders");
        },
      };

      // если режим редактирования, обновляем заказ
      if (this.isEditMode) {
        newOrder.id = this.orderToEdit.id;
        newOrder.callback = (createdOrder) => {
          if (this.isLabDirector || this.isSystemAdmin) {
            this.$toast(`Заказ №${createdOrder.number} обновлен`, 7000);
          } else {
            this.$toast(`Запрос на удаление заказа ${createdOrder.number} отправлен на рассмотрение директору.`, 7000);
          }
          this.$router.push("/orders");
        };
        await this.updateOrderAction(newOrder);
        this.isSaving = false;
        return;
      }

      await this.createOrderAction(newOrder);
      this.isSaving = false;
    },
    async applyChangesToSelectedTooth() {
      // пересчитываем цену
      this.price = this.calcPrice;
      await this.$refs.toothSelection.applySelection();
      this.isVisibleSelectWorkType = false;
      this.isChanged = !this.isChanged;
    },
    async copyToothData(fromToothId, toToothId) {
      console.log("Клонирование зуба");
      let copyFromThoothId = this.orderSelectedTeeth.findIndex(
        (o) => o.toothId == fromToothId
      );

      if (copyFromThoothId >= 0) {
        let isExistsTargetTooth = this.orderSelectedTeeth.findIndex(
          (o) => o.toothId == toToothId
        );

        let newTooth = this.orderSelectedTeeth[copyFromThoothId];
        newTooth = JSON.parse(JSON.stringify(newTooth));
        newTooth.toothId = toToothId;
        if (isExistsTargetTooth >= 0) {
          this.orderSelectedTeeth[isExistsTargetTooth] = newTooth;
        } else {
          this.orderSelectedTeeth.push(newTooth);
        }
      }
      else {
        // так как клонируется зуб, которого не выбирали, удаляем выбранный зуб (то есть перетаскивает пустой зуб к выбранному зубу) 
        await this.setOrderSelectedTeeth(this.orderSelectedTeeth.filter(t => t.toothId !== toToothId));
      }

      this.isChanged = !this.isChanged;
      this.price = this.calcPrice;
    },
    /**
     * Проверяет, изменились ли выбранные зубы и их типы работ
     * @param {Array} newTeeth - текущие выбранные зубы
     * @param {Array} oldTeeth - исходные выбранные зубы
     * @returns {Boolean} - true, если есть изменения, false - если нет
     */
    hasTeethChanged(newTeeth, oldTeeth) {
      console.log("oldTeeth:", oldTeeth);
      // Приводим массив к единой структуре и сортируем
      const normalizedNew = newTeeth.map(t => ({
        tooth_id: t.toothId,
        work_type_ids: t.workTypes?.map(wt => wt.id).sort((a, b) => a - b)
      }))
        .sort((a, b) => a.tooth_id - b.tooth_id);

      const normalizedOld = oldTeeth.map(t => ({
        tooth_id: t.tooth_id,
        work_type_ids: t.work_types?.map(wt => wt.id).sort((a, b) => a - b)
      }))
      .sort((a, b) => a.tooth_id - b.tooth_id);

      // Сравниваем через JSON
      return JSON.stringify(normalizedNew) !== JSON.stringify(normalizedOld);
  },
  },
};
</script>
<style>
.selected {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
  border-color: #999 !important;
}
/* если ширина больше 1400px */
@media (min-width: 1400px) {
  .saveOrderButton {
    margin-top: -50px;
  }
}
</style>

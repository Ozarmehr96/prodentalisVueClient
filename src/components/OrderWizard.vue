<template>
  <div class="container-fluid" style="padding-left: 0">
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

          <div class="form-floating mb-4">
            <input
              type="date"
              v-model="expectedDate"
              class="form-control"
              id="floatingInput"
              :min="new Date().toISOString().split('T')[0]"
            />
            <label for="floatingInput">Ожидаемая дата</label>
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
      <div class="col-md-8" style="margin-top: -50px">
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
  LOAD_WORK_TYPES,
  ORDER_SELECTED_TEETH,
  SELECTED_TOOTH,
  SET_ORDER_SELECTED_TEETH,
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
    };
  },
  async beforeMount() {
    this.loadWorkTypes();

    // если режим редактирования, заполняем поля
    if (this.isEditMode) {

    }
    else { // если режим создания нового заказа, очищаем выбранные зубы
      this.setOrderSelectedTeeth([]);
    }
  },
  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES,
      selectedTooth: SELECTED_TOOTH,
      orderSelectedTeeth: ORDER_SELECTED_TEETH,
    }),
    isValid() {
      return (
        this.customer &&
        this.customer.trim().length > 0 &&
        this.patient &&
        this.patient.trim().length > 0 &&
        this.expectedDate &&
        this.orderSelectedTeeth.length > 0
      );
    },
    filteredWorkTypes() {
      return this.workTypes;
    },
    filtredOrderSelectedTeethasWorktype() {
      return convertOrderTeethToWorkTypes(this.orderSelectedTeeth.slice());
    },
  },
  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES,
      createOrderAction: CREATE_ORDER,
      setOrderSelectedTeeth: SET_ORDER_SELECTED_TEETH,
    }),
    /**
     * Событие выбора зуба
     * @param selectedTeeth
     */
    selectedToothChnged(selectedTeeth) {
      console.log("Выбранные зубы:", selectedTeeth);
      this.selectedToothId = selectedTeeth;
      let selectedWorkTypes = this.orderSelectedTeeth.find(
        (o) => o.toothId == this.selectedToothId
      );
      this.selectedTooth.workTypes = selectedWorkTypes
        ? selectedWorkTypes.workTypes
        : [];

      this.isVisibleSelectWorkType = true;
    },
    openSidePanelSelectWorkType() {},
    isSelectedWorkType(workType) {
      return (
        this.selectedWorkType &&
        workType &&
        this.selectedWorkType.id == workType.id
      );
    },
    async createOrder() {
      this.isSaving = true;
      let order = {
        customer_name: this.customer.trim(),
        patient_name: this.patient.trim(),
        expired_at: this.expectedDate,
        description: this.description ? this.description.trim() : null,
        teeth: this.orderSelectedTeeth.map((t) => ({
          tooth_id: t.toothId,
          work_type_ids: t.workTypes.map((wt) => wt.id),
        })),
        callback: (createdOrder) => {
          this.$toast(`Заказ №${createdOrder.id} создан`, 7000);
          this.$router.push("/orders");
        },
      };
      await this.createOrderAction(order);
      this.isSaving = false;
    },
    async applyChangesToSelectedTooth() {
      console.log("Сохранение изменений в компонент выбора зубов");
      console.log("Свойства выбранного зуба", this.selectedTooth);
      console.log("типы работ для зубов", this.orderSelectedTeeth);
      await this.$refs.toothSelection.applySelection();
      this.isVisibleSelectWorkType = false;
    },
    copyToothData(fromToothId, toToothId) {
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
    },
  },
};
</script>
<style>
.selected {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
  border-color: #999 !important;
}
</style>

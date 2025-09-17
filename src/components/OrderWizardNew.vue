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
              placeholder="342"
            />
            <label for="floatingInput">Заказчик</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="text"
              v-model="patient"
              class="form-control"
              id="floatingInput"
              placeholder="342"
            />
            <label for="floatingInput">Пациент</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="date"
              v-model="expectedDate"
              class="form-control"
              id="floatingInput"
              placeholder="342"
            />
            <label for="floatingInput">Ожидаемая дата</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="text"
              v-model="comment"
              class="form-control"
              id="floatingInput"
              placeholder="342"
            />
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
        <!-- Todo Необходимо отображать выбранные зубы! -->
        <!-- <OrderWorkTypeCard
          v-for="work in filtredOrderSelectedTeethasWorktype"
          :key="work.id"
          :name="work.name"
          colorName="1M1"
          :teeth="work.teeth"
          @onUpdateSelected="
            (isSelected) => {
              work.selected = isSelected;
              updateSelectedTeethOnToothSelection(work);
            }
          "
          @delete="deleteWorkTypeFromSelected(work)"
          @click="selectWorkType(work)"
        /> -->
      </div>
      <!-- Правая часть -->
      <div class="col-md-4 d-flex align-items-center justify-content-center">
        <ToothSelection
          ref="toothSelection"
          @onToothSelectedChanged="selectedToothChnged"
        />
      </div>
      <div class="col-md-8" style="margin-top: -50px">
        <button class="btn btn-primary w-100 brand-style" @click="createOrder">
          Сохранить
        </button>
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
import OrderWorkTypeCard from "./OrderWorkTypeCard.vue";
import ToothSelection from "./ToothSelection.vue";
import {
  CREATE_ORDER,
  LOAD_WORK_TYPES,
  ORDER_SELECTED_TEETH,
  SELECTED_TOOTH,
  SET_SELECTED_TOOTH,
  WORK_TYPES,
} from "../store/types";
import SelectWorkTypeWizard from "./SelectWorkTypeWizard.vue";

export default {
  name: "OrderWizard",
  components: {
    ToothSelection,
    // OrderWorkTypeCard,
    WorkTypeCardItem,
    SelectWorkTypeWizard,
  },
  data() {
    return {
      selectedWorkTypes: [],
      isVisibleSelectWorkType: false,
      customer: null,
      expectedDate: null,
      comment: null,
      patient: null,
      selectedWorkType: null,
      selectedToothId: null,
    };
  },
  async beforeMount() {
    this.loadWorkTypes();
  },
  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES,
      selectedTooth: SELECTED_TOOTH,
      orderSelectedTeeth: ORDER_SELECTED_TEETH,
    }),
    filteredWorkTypes() {
      return this.workTypes;
    },
    filtredOrderSelectedTeethasWorktype() {
      let orderSelectedTeeth = this.orderSelectedTeeth.slice();
      let workTypes = [];

      orderSelectedTeeth.forEach((tooth) => {
        console.log("tooth", tooth);
        // перебираем все типы работ у зуба
        tooth.workTypes.forEach((workType) => {
          console.log("workTypes", workType);
          // ищем, есть ли уже такой тип работы в result
          let existing = workTypes.find((x) => x.id === workType.id);

          if (!existing) {
            // если такого типа работы ещё нет — добавляем новый объект
            existing = {
              ...workType,
              teeth: [],
            };
            existing.isSelected = false;
            workTypes.push(existing);
          }

          // добавляем зуб в список
          existing.teeth.push(tooth.toothId);
        });
      });

      return workTypes;
    },
  },
  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES,
      createOrderAction: CREATE_ORDER,
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
      let order = {
        customer_name: this.customer,
        patient_name: this.patient,
        expired_at: this.expectedDate,
        work_types: this.selectedWorkTypes.map((wt) => ({
          work_type_id: wt.id,
          teeth: JSON.stringify(wt.teeth),
        })),
        description: this.description,
        callback: (createdOrder) => {
          this.$toast(`Заказ ${createdOrder.id} создан`, 7000);
          this.$router.go(-1);
        },
      };
      await this.createOrderAction(order);
    },
    async applyChangesToSelectedTooth() {
      console.log("Сохранение изменений в компонент выбора зубов");
      console.log("Свойства выбранного зуба", this.selectedTooth);
      console.log("типы работ для зубов", this.orderSelectedTeeth);
      await this.$refs.toothSelection.applySelection();
      this.isVisibleSelectWorkType = false;
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

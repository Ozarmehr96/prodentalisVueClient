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
        <OrderWorkTypeCard
          v-for="work in selectedWorkTypes"
          :key="work.id"
          :name="work.name"
          :class="{
            selected: selectedWorkType && selectedWorkType.id == work.id,
          }"
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
        />

        <!-- Кнопка добавить -->
        <button
          class="btn btn-primary fa-lg gradient-custom-2 mb-3 w-100"
          @click="() => (isVisibleSelectWorkType = true)"
        >
          Добавить
        </button>
      </div>
      <!-- Правая часть -->
      <div class="col-md-4 d-flex align-items-center justify-content-center">
        <ToothSelection
          @update:selected="updateSelected"
          :newSelectedTeeth="selectedTeeth"
          :selected="selectedTeeth"
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
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import OrderWorkTypeCard from "./OrderWorkTypeCard.vue";
import ToothSelection from "./ToothSelection.vue";
import { CREATE_ORDER, LOAD_WORK_TYPES, WORK_TYPES } from "../store/types";
import SelectWorkTypeWizard from "./SelectWorkTypeWizard.vue";

export default {
  name: "OrderWizard",
  components: { ToothSelection, OrderWorkTypeCard, SelectWorkTypeWizard },
  data() {
    return {
      selectedTeeth: [],
      selectedWorkTypes: [],
      isVisibleSelectWorkType: false,
      customer: null,
      expectedDate: null,
      comment: null,
      patient: null,
      selectedWorkType: null,
    };
  },
  async beforeMount() {
    this.loadWorkTypes();
  },
  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES,
    }),
    filteredTeeth() {
      return this.selectedTeeth;
    },
    filteredWorkTypes() {
      return this.workTypes.filter(
        (t) => !this.selectedWorkTypes.find((st) => st.id === t.id)
      );
    },
  },
  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES,
      createOrderAction: CREATE_ORDER,
    }),
    updateSelected(selectedTeeth) {
      console.log("Выбранные зубы:", selectedTeeth);
      // Обновляем выбранные зубы для каждого типа работы
      this.selectedWorkTypes.forEach((workType) => {
        // Если тип работы выбран, обновляем его зубы
        if (this.isSelectedWorkType(workType)) {
          workType.teeth = [...selectedTeeth];
        }
      });
    },
    openSidePanelSelectWorkType() {},
    updateSelectedTeethOnToothSelection(workType) {
      if (!workType.hasOwnProperty("teeth")) {
        workType.teeth = [];
      }

      // Удаляем зубы из выбранных, если тип работы не выбран
      if (!this.isSelectedWorkType(workType)) {
        this.selectedTeeth = this.selectedTeeth.filter(
          (toothId) => !workType.teeth.includes(toothId)
        );
      } else {
        // Если тип работы выбран, добавляем его зубы в выбранные
        workType.teeth.forEach((toothId) => {
          if (!this.selectedTeeth.includes(toothId)) {
            this.selectedTeeth.push(toothId);
          }
        });
      }
    },
    deleteWorkTypeFromSelected(workType) {
      workType.teeth = [];
      if (this.isSelectedWorkType(workType)) {
        this.selectedWorkType = null;
        this.selectedTeeth = [];
      }

      this.selectedWorkTypes = this.selectedWorkTypes.filter(
        (wt) => wt.id !== workType.id
      );
    },
    selectWorkType(workType) {
      this.selectedWorkType = workType;
      this.selectedTeeth = this.selectedWorkType.teeth;
    },
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
  },
};
</script>
<style>
.selected {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
  border-color: #999 !important;
}
</style>

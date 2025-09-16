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
import OrderWorkTypeCard from "./OrderWorkTypeCard.vue";
import ToothSelection from "./ToothSelection.vue";
import { CREATE_ORDER, LOAD_WORK_TYPES, SELECTED_TOOTH, WORK_TYPES } from "../store/types";
import SelectWorkTypeWizard from "./SelectWorkTypeWizard.vue";

export default {
  name: "OrderWizard",
  components: {
    ToothSelection,
    OrderWorkTypeCard,
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
      selectedTooth: SELECTED_TOOTH
    }),

    filteredWorkTypes() {
      return this.workTypes;
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
      console.log(this.$refs.toothSelection);
      this.$refs.toothSelection.applySelection();
    }
  },
};
</script>
<style>
.selected {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
  border-color: #999 !important;
}
</style>

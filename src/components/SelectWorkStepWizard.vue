<template>
  <div>
    <label class="form-label">Этапы типа работы</label>
    <div class="form-text mb-2">
      Выберите последовательность этапов для этого типа работы
    </div>

    <!-- Таблица выбранных этапов -->
    <div class="card shadow-sm mb-3">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <span>Выбранные этапы</span>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="openOffcanvas"
        >
          Добавить этап
        </button>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 40px">#</th>
              <th>Название этапа</th>
              <th style="width: 150px">Стоимость</th>
              <th style="width: 120px">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(step, index) in selectedWorkTypeSteps" :key="step.id">
              <td>{{ step.order_in_step }}</td>
              <td>{{ step.name }}</td>
              
              <td>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  class="form-control form-control-sm"
                  v-model.number="step.price"
                  @input="emitUpdate"
                  required
                />
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-sm btn-secondary me-1"
                  @click="moveUp(index)"
                  :disabled="index === 0"
                >
                  ↑
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-secondary me-1"
                  @click="moveDown(index)"
                  :disabled="index === selectedWorkTypeSteps.length - 1"
                >
                  ↓
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-danger"
                  @click="removeStep(index)"
                >
                  ✕
                </button>
              </td>
            </tr>
            <tr v-if="selectedWorkTypeSteps.length === 0">
              <td colspan="4" class="text-center text-muted">
                Этапы не выбраны
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Offcanvas -->
    <div class="offcanvas offcanvas-end" tabindex="-1" ref="offcanvasRef">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Добавить этап</h5>
        <button
          type="button"
          class="btn-close text-reset"
          @click="closeOffcanvas"
        ></button>
      </div>
      <div class="offcanvas-body">
        <input
          type="text"
          class="form-control mb-2"
          placeholder="Поиск этапа..."
          v-model="searchQuery"
        />
        <div class="list-group">
          <button
            v-for="step in filteredSteps"
            :key="step.id"
            type="button"
            class="list-group-item list-group-item-action"
            @click="addStep(step)"
          >
            {{ step.name }}
          </button>
          <div v-if="filteredSteps.length === 0" class="text-muted mt-2">
            Этапов не найдено
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";
import { mapActions , mapGetters} from "vuex";
import { LOAD_WORK_STEPS, SELECTED_WORK_TYPE_STEPS, SET_SELECTED_WORK_TYPE_STEPS } from "../store/types";

export default {
  data() {
    return {
      //selectedWorkTypeSteps: [],
      searchQuery: "",
      bsOffcanvas: null,
      workSteps: [],
    };
  },
  async beforeMount() {
    await this.loadWorkSteps().then(async (steps) => {
      this.workSteps = steps;
    });
  },
  computed: {
    ...mapGetters({
      selectedWorkTypeSteps: SELECTED_WORK_TYPE_STEPS,
    }),
    filteredSteps() {
      return this.workSteps.filter(
        (step) =>
          step.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    ...mapActions({
      loadWorkSteps: LOAD_WORK_STEPS,
      setSelectedWorkTypeStep: SET_SELECTED_WORK_TYPE_STEPS
    }),
    openOffcanvas() {
      this.bsOffcanvas.show();
    },
    closeOffcanvas() {
      this.bsOffcanvas.hide();
    },
    addStep(step) {
      this.selectedWorkTypeSteps.push({ ...step, work_step_id: step.id }); // добавляем work_step_id
      this.updateOrder();
      this.emitUpdate();
    },
    removeStep(index) {
      this.selectedWorkTypeSteps.splice(index, 1);
      this.updateOrder();
      this.emitUpdate();
    },
    moveUp(index) {
      if (index === 0) return;
      [this.selectedWorkTypeSteps[index - 1], this.selectedWorkTypeSteps[index]] = [
        this.selectedWorkTypeSteps[index],
        this.selectedWorkTypeSteps[index - 1],
      ];
      this.updateOrder();
      this.emitUpdate();
    },
    moveDown(index) {
      if (index === this.selectedWorkTypeSteps.length - 1) return;
      [this.selectedWorkTypeSteps[index], this.selectedWorkTypeSteps[index + 1]] = [
        this.selectedWorkTypeSteps[index + 1],
        this.selectedWorkTypeSteps[index],
      ];
      this.updateOrder();
      this.emitUpdate();
    },
    async updateOrder() {
      this.selectedWorkTypeSteps.forEach((step, index) => {
        step.order_in_step = index + 1;
      });

      await this.setSelectedWorkTypeStep(this.selectedWorkTypeSteps);
    },
    async emitUpdate() {
      this.$emit("onUpdateSelectedSteps", this.selectedWorkTypeSteps);
    },
  },
  mounted() {
    this.bsOffcanvas = new bootstrap.Offcanvas(this.$refs.offcanvasRef);
  },
};
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>

<template>
  <app-page title="Приоритеты этапов">
    <div>
      <div class="form-text mb-2">
        Укажите приоритеты этапов, чтобы система знала, в каком порядке
        формировать задачи. При разных типах работ приоритеты помогут
        автоматически объединить этапы в правильной последовательности.
      </div>
      <!-- Таблица выбранных этапов -->
      <div class="card shadow-sm mb-3">
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
                <td>{{ step.hasOwnProperty("order_in_step") ? step.order_in_step : step.priority }}</td>
                <td>{{ step.name }}</td>
                <td>{{ step.price }}</td>
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
        <div
          class="card-header d-flex justify-content-between align-items-center"
          v-if="isLabDirector"
        >
          <button
            type="button"
            class="btn btn-primary btn-sm brand-style"
            @click="saveWorkStepPriority"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </app-page>
</template>
<script>
import AppPage from "../../components/AppPage.vue";
import { mapActions, mapGetters } from "vuex";
import {
  IS_LAB_DIRECTOR,
  LOAD_WORK_STEPS,
  SAVE_WORK_STEP_PRIORITY,
  SELECTED_WORK_TYPE_STEPS,
  SET_SELECTED_WORK_TYPE_STEPS,
} from "../../store/types";

export default {
  components: {
    AppPage,
  },
  data() {
    return {
      workSteps: [],
    };
  },
  async beforeMount() {
    await this.loadWorkSteps().then(async (steps) => {
      this.workSteps = steps;
      this.setSelectedWorkTypeStep(this.workSteps);
    });
  },
  computed: {
    ...mapGetters({
      selectedWorkTypeSteps: SELECTED_WORK_TYPE_STEPS,
      isLabDirector: IS_LAB_DIRECTOR
    }),
    filteredSteps() {
      return this.workSteps.filter((step) =>
        step.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    ...mapActions({
      loadWorkSteps: LOAD_WORK_STEPS,
      saveWorkStepPriorityAction: SAVE_WORK_STEP_PRIORITY,
      setSelectedWorkTypeStep: SET_SELECTED_WORK_TYPE_STEPS,
    }),
    moveUp(index) {
      if (index === 0) return;
      [
        this.selectedWorkTypeSteps[index - 1],
        this.selectedWorkTypeSteps[index],
      ] = [
        this.selectedWorkTypeSteps[index],
        this.selectedWorkTypeSteps[index - 1],
      ];
      this.updateOrder();
      this.emitUpdate();
    },
    moveDown(index) {
      if (index === this.selectedWorkTypeSteps.length - 1) return;
      [
        this.selectedWorkTypeSteps[index],
        this.selectedWorkTypeSteps[index + 1],
      ] = [
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

    async saveWorkStepPriority() {
      await this.saveWorkStepPriorityAction({
        properties: this.selectedWorkTypeSteps.map((step) => ({
          work_step_id: step.id,
          priority: step.hasOwnProperty("order_in_step")
            ? step.order_in_step
            : step.priority,
        })),
        callback: (data) => {
          this.$toast(`Приоритеты этапов успешно сохранены`, 5000);
        },
      });
    },
  },
};
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>

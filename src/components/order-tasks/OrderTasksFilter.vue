<template>
  <div class="mt-2 shadow-lg bg-white rounded p-3 mb-2">
    <form @submit.prevent class="d-flex flex-wrap align-items-end gap-2">
      <!-- ID заказа -->
      <div class="col-12 col-sm-auto">
        <label for="order_number" class="form-label small">Номер заказа</label>
        <input
          type="number"
          id="order_number"
          class="form-control bg-white"
          v-model="filters.order_number"
          placeholder="№"
          @input="applyFilter"
        />
      </div>

      <!-- Статус -->
      <div class="col-12 col-sm-auto">
        <label for="status" class="form-label small">Статус задачи</label>
        <select
          id="status"
          class="form-select"
          v-model="filters.status"
          @change="onStatusChanged"
        >
          <option value="">Все</option>
          <option value="Pending">В ожидании</option>
          <option value="NotStarted">Не начат</option>
          <option value="Started">В работе</option>
          <option value="Paused">Приостановлен</option>
          <option value="Finished">Выполнен</option>
        </select>
      </div>

      <div class="col-12 col-sm-auto" v-if="filters.date_type === 'period'">
        <label for="created_from" class="form-label small">От</label>
        <input
          type="date"
          id="created_from"
          class="form-control"
          v-model="filters.created_from"
          @change="applyFilter"
        />
      </div>

      <!-- Дата до -->
      <div class="col-12 col-sm-auto" v-if="filters && filters.finished_at">
        <label for="finished_at" class="form-label small">До</label>
        <input
          type="date"
          id="finished_at"
          class="form-control"
          v-model="filters.finished_at"
          @change="applyFilter"
        />
      </div>

      <div class="col-12 col-sm-auto" v-if="filters && filters.finished_to">
        <label for="finished_to" class="form-label small">До</label>
        <input
          type="date"
          id="finished_to"
          class="form-control"
          v-model="filters.finished_to"
          @change="applyFilter"
        />
      </div>

      <!-- Сброс -->
      <div class="col-auto d-flex gap-2 reset-button">
        <button
          type="button "
          class="btn btn-outline-secondary reset-button"
          @click="resetFilter"
        >
          Сбросить
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  ORDER_TASK_FILTERS,
  RESET_ORDER_TASK_FILTERS,
  SET_ORDER_TASK_FILTERS,
} from "../../store/types";
import { mapActions } from "vuex";

export default {
  name: "OrderFilter",
  computed: {
    ...mapGetters({
      filters: ORDER_TASK_FILTERS,
    }),
  },
  methods: {
    ...mapActions({
      setOrderFilters: SET_ORDER_TASK_FILTERS,
      resetOrderTaskFilters: RESET_ORDER_TASK_FILTERS,
    }),
    onStatusChanged() {
      console.log("[FILTER] Статус изменен");
      console.log(this.filters);
      this.applyFilter();
    },
    async applyFilter() {
      console.log("[FILTER] Применение фильтра");
      await this.setOrderFilters(this.filters);
      this.$emit("search", { ...this.filters });
    },
    async resetFilter() {
      await this.resetOrderTaskFilters();
      await this.setOrderFilters({ ...this.filters });
      this.applyFilter();
    },
  },
};
</script>

<style scoped>
.form-label {
  margin-bottom: 0.2rem;
}
.statusButton {
  border: 1px solid #ced4da; /* как у form-control */
}
.statusButton:hover {
  background-color: black;
  color: white;
}

@media (max-width: 575.98px) {
  #order_number {
    max-width: 100% !important; /* на мобилках растянуть input */
  }
  .reset-button {
    width: 100% !important; /* на мобилках растянуть кнопку */
  }
}
</style>

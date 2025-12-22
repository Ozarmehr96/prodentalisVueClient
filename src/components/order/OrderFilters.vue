<template>
  <div style="margin-bottom: 16px">
    <form @submit.prevent class="d-flex flex-wrap align-items-end gap-2">
      <!-- ID заказа -->
      <div class="col-12 col-sm-auto">
        <label for="number" class="form-label small">Номер заказа</label>
        <input
          type="number"
          id="number"
          class="form-control"
          v-model="filters.number"
          placeholder="№"
          @input="applyFilter"
        />
      </div>

      <!-- Имя заказчика -->
      <div class="col-12 col-sm-auto">
        <label for="customer_name" class="form-label small">Заказчик</label>
        <input
          type="text"
          id="customer_name"
          class="form-control"
          v-model="filters.customer_name"
          placeholder="Введите имя"
          @input="applyFilter"
        />
      </div>

      <!-- Тип даты -->
      <div class="col-12 col-sm-auto">
        <label for="date_type" class="form-label small">Период</label>
        <select
          id="date_type"
          class="form-select"
          v-model="filters.date_type"
          @change="onDateTypeChange"
        >
          <option value="">Все</option>
          <option value="today">Сегодня</option>
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="period">Выбрать период</option>
        </select>
      </div>

      <!-- Дата от -->
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
      <div class="col-12 col-sm-auto" v-if="filters.date_type === 'period'">
        <label for="created_to" class="form-label small">До</label>
        <input
          type="date"
          id="created_to"
          class="form-control"
          v-model="filters.created_to"
          @change="applyFilter"
        />
      </div>

      <!-- Статус -->
      <div class="col-12 col-sm-auto btn-group" role="group">
        <button
          type="col-12 col-sm-auto button"
          class="btn statusButton"
          :class="{ 'brand-style': filters.status === 'Created' }"
          @click="toggleStatus('Created')"
        >
          Новые
        </button>

        <button
          type="button"
          class="col-12 col-sm-auto btn statusButton"
          :class="{ 'brand-style': filters.status === 'Started' }"
          @click="toggleStatus('Started')"
        >
          В работе
        </button>

        <button
          type="button"
          class="col-12 col-sm-auto btn statusButton"
          :class="{ 'brand-style': filters.status === 'Finished' }"
          @click="toggleStatus('Finished')"
        >
          Завершенные
        </button>
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
import { ORDER_FILTERS, SET_ORDER_FILTERS } from "../../store/types";
import { mapActions } from "vuex";
import { getDataFromType } from "../../helpers/order-helpers";
export default {
  name: "OrderFilter",
  computed: {
    ...mapGetters({
      filters: ORDER_FILTERS,
    }),
  },
  methods: {
    ...mapActions({
      setOrderFilters: SET_ORDER_FILTERS,
    }),
    toggleStatus(status) {
      if (this.filters.status === status) {
        // если кликнули по уже выбранному — снимаем выделение
        this.filters.status = "";
      } else {
        this.filters.status = status;
      }
      this.applyFilter();
    },
    async applyFilter() {
      await this.setOrderFilters(this.filters);
      this.$emit("search", { ...this.filters });
    },
    async resetFilter() {
      this.filters.number = null;
      this.filters.customer_name = null;
      this.filters.created_from = null;
      this.filters.created_to = null;
      this.filters.status = "";
      this.filters.date_type = "";
      await this.setOrderFilters({ ...this.filters });
      this.applyFilter();
    },
    /* Обработка изменения типа даты */
    onDateTypeChange() {
      const data = getDataFromType(this.filters.date_type);
      this.filters.created_from = data.from;
      this.filters.created_to = data.to;

      // применяем изменения
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
  #number {
    max-width: 100% !important; /* на мобилках растянуть input */
  }
  .reset-button {
    width: 100% !important; /* на мобилках растянуть кнопку */
  }
}
</style>

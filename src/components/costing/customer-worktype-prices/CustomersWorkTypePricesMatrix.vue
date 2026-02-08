<template>
  <div class="matrix-container">
    <!-- Спиннер -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center h-100">
      <div class="text-center">
        <div class="spinner-border spinner-border-lg text-primary" role="status"></div>
        <p class="mt-3">Загрузка матрицы цен...</p>
      </div>
    </div>

    <div v-else class="table-outer-wrapper" style="max-width: 1230px">
      <div class="table-scroll-container">
        <table class="table table-bordered table-sm price-matrix mb-0">
          <thead>
            <tr>
              <th
                class="sticky-col sticky-header corner-cell"
                style="width: 180px; min-width: 180px"
              >
                Тип работы
              </th>
              <th
                v-for="customer in filtredcustomers"
                :key="customer.id"
                class="sticky-header text-center px-2 text-nowrap"
                style="min-width: 140px; width: 140px"
              >
                {{ customer.full_name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="workType in workTypes" :key="workType.id">
              <td
                class="sticky-col fw-semibold text-nowrap px-2"
                :style="{ background: workType.background_color, color: '#fff' }"
              >
                {{ workType.name }}
              </td>
              <td v-for="customer in filtredcustomers" :key="customer.id" class="p-0">
                <input
                  type="number"
                  :title="`Введите цену`"
                  step="0.01"
                  placeholder="—"
                  min="0"
                  class="form-control form-control-sm border-0 text-end rounded-0 shadow-none w-100 h-100"
                  v-model.number="pricesMatrix[workType.id][customer.id]"
                  :class="{
                    'changed-cell': isCellChanged(workType.id, customer.id),
                    'invalid-cell': isCellInvalid(workType.id, customer.id),
                  }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3 gap-2">
      <button
        class="btn btn-outline-secondary"
        @click="resetChanges"
        :disabled="!hasChanges || isLoading"
      >
        Отменить изменения
      </button>

      <ButtonWithLoader
        :disabled="!hasChanges || isLoading"
        @click="saveOnlyChanges"
        :isLoading="isLoading"
        title="Сохранить"
        loadingText="Сохранение..."
        :isValid="hasChanges"
        :customClasses="['btn', hasChanges ? 'brand-style' : 'btn-outline-secondary']"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  LOAD_CUSTOMERS,
  LOAD_WORK_TYPES,
  CUSTOMERS,
  WORK_TYPES,
  SAVE_CUSTOMERS_WORK_TYPE_PRICES,
  LOAD_CUSTOMERS_WORK_TYPE_PRICES,
  CUSTOMERS_WORK_TYPE_PRICES,
  IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES,
} from "../../../store/types";
import ButtonWithLoader from "../../ButtonWithLoader.vue";

export default {
  name: "WorkTypeCustomerPriceMatrix",
  components: {
    ButtonWithLoader,
  },
  data() {
    return {
      loading: true,
      pricesMatrix: {},
      originalMatrix: {},
    };
  },

  computed: {
    ...mapGetters({
      customers: CUSTOMERS,
      workTypes: WORK_TYPES,
      customersWorkTypePrices: CUSTOMERS_WORK_TYPE_PRICES,
      isCustomersWorkTypePricesLoading: IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES,
    }),

    isLoading() {
      return this.isCustomersWorkTypePricesLoading || this.loading;
    },

    filtredcustomers() {
      return this.customers.sort((a, b) => a.full_name.localeCompare(b.full_name));
    },

    hasChanges() {
      return (
        JSON.stringify(this.pricesMatrix) !== JSON.stringify(this.originalMatrix) &&
        this.changedData.length > 0 &&
        this.changedData.every(
          (item) =>
            item.price !== null &&
            item.price !== "" &&
            !isNaN(Number(item.price)) &&
            item.price >= 0
        )
      );
    },

    changedData() {
      const changes = [];
      this.workTypes.forEach((wt) => {
        this.filtredcustomers.forEach((cust) => {
          const current = this.pricesMatrix[wt.id]?.[cust.id];
          const original = this.originalMatrix[wt.id]?.[cust.id];
          if (current !== original && current !== "") {
            changes.push({
              work_type_id: wt.id,
              customer_id: cust.id,
              price: current === null || isNaN(current) ? null : Number(current),
            });
          }
        });
      });

      return changes;
    },
  },

  async beforeMount() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadWorkTypes(),
        this.loadCustomers(),
        this.loadCustomersWorkTypePrices(),
      ]);
      this.initializeMatrix();
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES,
      loadCustomers: LOAD_CUSTOMERS,
      saveCustomersWorkTypePrices: SAVE_CUSTOMERS_WORK_TYPE_PRICES,
      loadCustomersWorkTypePrices: LOAD_CUSTOMERS_WORK_TYPE_PRICES,
    }),

    initializeMatrix() {
      if (!this.workTypes.length || !this.filtredcustomers.length) return;

      const matrix = {};
      this.workTypes.forEach((wt) => {
        matrix[wt.id] = {};
        this.filtredcustomers.forEach((cust) => {
          matrix[wt.id][cust.id] = null;
        });
      });

      this.pricesMatrix = matrix;
      this.applyExistingPrices();
      this.cloneOriginalMatrix();
    },

    applyExistingPrices() {
      this.customersWorkTypePrices.forEach(({ work_type_id, customer_id, price }) => {
        if (
          this.pricesMatrix[work_type_id] &&
          customer_id in this.pricesMatrix[work_type_id]
        ) {
          this.pricesMatrix[work_type_id][customer_id] = Number(price) || null;
        }
      });
    },

    cloneOriginalMatrix() {
      this.originalMatrix = JSON.parse(JSON.stringify(this.pricesMatrix));
    },

    // Проверка корректности значения цены
    isCellInvalid(workTypeId, customerId) {
      const value = this.pricesMatrix?.[workTypeId]?.[customerId];

      // Пусто — НЕ ошибка (можно менять под свои правила)
      if (value === null || value === "") return false;

      // Не число
      if (isNaN(value)) return true;

      const num = Number(value);

      // Отрицательное значение
      if (num < 0) return true;

      return false;
    },

    isCellChanged(work_type_id, customer_id) {
      try {
        const current = this.pricesMatrix[work_type_id][customer_id];
        const original = this.originalMatrix[work_type_id][customer_id];

        // Приводим пустые значения к null
        const currVal =
          current === null || current === "" || isNaN(current) ? null : Number(current);
        const origVal =
          original === null || original === "" || isNaN(original)
            ? null
            : Number(original);

        // Если текущее значение отличается от исходного, считаем изменённой
        return currVal !== origVal;
      } catch {
        return false;
      }
    },

    resetChanges() {
      this.pricesMatrix = JSON.parse(JSON.stringify(this.originalMatrix));
    },

    async saveOnlyChanges() {
      if (!this.changedData.length) return;

      await this.saveCustomersWorkTypePrices({
        prices: this.changedData,
        callback: async () => {
          await this.loadCustomersWorkTypePrices();
          this.initializeMatrix();
          this.$toast("Цены сохранены!", 3000);
        },
      });
    },
  },
};
</script>

<style scoped>
/* Главный контейнер занимает всю доступную высоту страницы */
.matrix-container {
  height: calc(
    100vh - 80px
  ); /* или calc(100vh - 60px) если есть фиксированная шапка приложения */
  display: flex;
  width: calc(100vw - 60px);
  min-width: calc(100vw - 10vw);
  flex-direction: column;
}

/* Обёртка таблицы, занимает всё оставшееся место */
.table-outer-wrapper {
  flex: 1 1 auto;
  overflow: hidden;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: white;
}

/* Единственный контейнер со скроллом */
.table-scroll-container {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
}

/* Таблица */
.price-matrix {
  border-collapse: collapse;
  width: max-content;
  min-width: 100%;
  margin: 0;
}

/* Фиксированная шапка */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6 !important;
}

/* Фиксированный первый столбец */
.sticky-col {
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 5;
  border-right: 2px solid #dee2e6 !important;
}

/* Угол таблицы */
.corner-cell {
  z-index: 11 !important;
  background-color: #f8f9fa;
}

/* Изменённые ячейки */
.changed-cell {
  background-color: #fff3cd !important;
  font-weight: 500;
}

/* Input занимает всю ячейку и выглядит интерактивно */
td input {
  height: 100% !important;
  width: 100% !important;
  border-radius: 0.25rem !important;
  border: 1px solid #ced4da;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  text-align: right;
  transition: all 0.2s ease-in-out;
  background-color: #fdfdfd;
  cursor: text;
}

/* Подсветка при фокусе */
td input:focus {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Эффект при наведении на интерактивные ячейки */
td input:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Подсветка изменённых ячеек с лёгкой анимацией */
.changed-cell {
  animation: pulse 1s ease-in-out infinite alternate;
  border-color: #ffc107 !important;
}

@keyframes pulse {
  0% {
    background-color: #fff3cd;
  }
  100% {
    background-color: #ffe8a1;
  }
}

/* Placeholder */
td input::placeholder {
  color: #6c757d;
  opacity: 1;
}

/* Подсветка изменённых ячеек */
.changed-cell {
  background-color: #fff3cd !important;
  font-weight: 500;
  border-color: #ffc107 !important;
}

/* Подсказка пользователю, что сюда можно кликнуть */
td input::placeholder {
  color: #6c757d;
  opacity: 1;
}

/* Адаптивность для мобильных */
@media (min-width: 1190px) {
  .matrix-container {
    width: fit-content !important;
    min-width: calc(100vw - 300px) !important;
  }
}

@media (max-width: 768px) {
  .sticky-col {
    min-width: 140px;
  }
  th.sticky-header:not(.sticky-col),
  td:not(.sticky-col) {
    min-width: 110px;
  }
}

/* Ошибка ввода */
.invalid-cell {
  background-color: #f8d7da !important;
  border-color: #dc3545 !important;
  font-weight: 600;
}

/* Фокус на ошибке */
.invalid-cell:focus {
  background-color: #f1aeb5 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>

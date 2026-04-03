<template>
  <div class="matrix-container d-flex">
    <!-- Список заказчиков слева -->

    <div class="customers-list border-end">
      <h5 class="p-2 sticky-header" style="font-size: 16px">Заказчик</h5>
      <ul class="list-group list-group-flush">
        <li
          v-for="customer in customers"
          :key="customer.id"
          class="list-group-item sticky-col"
          :class="{ active: selectedCustomer?.id === customer.id }"
          @click="selectCustomer(customer)"
        >
          {{ customer.full_name }}
        </li>
      </ul>
    </div>

    <!-- Список работ справа -->
    <div class="work-types-container flex-grow-1">
      <div v-if="loading" class="d-flex justify-content-center align-items-center h-100">
        <div class="text-center">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Загрузка типов работ...</p>
        </div>
      </div>

      <div v-else class="table-scroll-container" style="max-width: 1000px">
        <table
          class="table table-bordered table-sm price-matrix mb-0"
          v-if="selectedCustomer"
        >
          <thead>
            <tr class="sticky-header">
              <th class="sticky-header work-name-col type-col">Тип работы</th>
              <th class="sticky-header price-col cell-input">Цена</th>
              <th class="sticky-header mode-col price-mode-col">Тип цены</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="work in workTypes" :key="work.id">
              <td
                class="sticky-col type-col"
                :style="{ background: work.background_color, color: '#fff' }"
              >
                {{ work.name }}
              </td>

              <!-- Input для цены -->
              <td class="cell-input">
                <input
                  type="number"
                  step="0.01"
                  placeholder="—"
                  min="0"
                  class="form-control form-control-sm сell-input"
                  v-model.number="pricesMatrix[work.id][selectedCustomer.id].price"
                  :class="{
                    'changed-cell': isCellChanged(work.id),
                    'invalid-cell': isCellInvalid(work.id),
                  }"
                  :title="'Введите цену'"
                />
              </td>

              <!-- Кнопки выбора типа цены -->
              <td class="d-flex gap-2 price-mode-col">
                <button
                  class="btn btn-sm"
                  :class="{
                    'btn-primary text-white':
                      pricesMatrix[work.id][selectedCustomer.id].price_mode ===
                      'PerTooth',
                  }"
                  @click="setPriceType(work.id, 'PerTooth')"
                  title="За зуб"
                >
                  За один зуб
                </button>
                <button
                  class="btn btn-sm"
                  :class="{
                    'btn-primary text-white':
                      pricesMatrix[work.id][selectedCustomer.id].price_mode === 'PerStep',
                  }"
                  @click="setPriceType(work.id, 'PerStep')"
                  title="За работу"
                >
                  За работу
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Фиксированные кнопки -->
      <div class="matrix-actions">
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ButtonWithLoader from "../../ButtonWithLoader.vue";
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

export default {
  name: "VerticalMatrix",
  components: { ButtonWithLoader },
  data() {
    return {
      loading: true,
      selectedCustomer: null,
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
      return this.loading || this.isCustomersWorkTypePricesLoading;
    },

    changes() {
      const changesList = [];

      this.workTypes.forEach((wt) => {
        if (!this.pricesMatrix[wt.id]) return; // пропускаем, если workId ещё нет

        this.customers.forEach((cust) => {
          if (!cust?.id) return; // пропускаем, если нет id заказчика
          const data = this.pricesMatrix[wt.id][cust.id];
          const original = this.originalMatrix[wt.id]?.[cust.id];

          if (!data) return; // пропускаем, если данных нет

          const changed = JSON.stringify(data) !== JSON.stringify(original);
          const valid = data.price !== null && data.price !== "" && data.price_mode;

          if (changed && valid) {
            changesList.push({
              work_type_id: wt.id,
              customer_id: cust.id,
              price: data.price,
              price_mode: data.price_mode,
            });
          }
        });
      });

      return changesList;
    },

    // Есть ли изменения для активации кнопки
    hasChanges() {
      return this.changes.length > 0;
    },
  },
  async beforeMount() {
    try {
      this.loading = true;
      await Promise.all([
        this.loadWorkTypes(),
        this.loadCustomers(),
        this.loadCustomersWorkTypePrices(),
      ]);
      this.initializeMatrix();
      this.selectedCustomer = this.customers[0] || null;
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

    selectCustomer(customer) {
      this.selectedCustomer = customer;
    },

    initializeMatrix() {
      const matrix = {};
      this.workTypes.forEach((work) => {
        matrix[work.id] = {};
        this.customers.forEach((cust) => {
          matrix[work.id][cust.id] = { price: null, price_mode: null };
        });
      });
      this.pricesMatrix = matrix;

      this.customersWorkTypePrices.forEach(
        ({ work_type_id, customer_id, price, price_mode }) => {
          if (
            this.pricesMatrix[work_type_id] &&
            customer_id in this.pricesMatrix[work_type_id]
          ) {
            this.pricesMatrix[work_type_id][customer_id] = {
              price: Number(price) || null,
              price_mode: price_mode || null,
            };
          }
        }
      );

      this.originalMatrix = JSON.parse(JSON.stringify(this.pricesMatrix));
    },

    setPriceType(workId, mode) {
      if (!this.selectedCustomer) return;
      this.pricesMatrix[workId][this.selectedCustomer.id].price_mode = mode;
    },

    isCellChanged(workId) {
      if (!this.selectedCustomer) return false;
      const current = this.pricesMatrix[workId][this.selectedCustomer.id];
      const original = this.originalMatrix[workId][this.selectedCustomer.id];
      return JSON.stringify(current) !== JSON.stringify(original);
    },

    isCellInvalid(workId) {
      if (!this.selectedCustomer) return false;
      const value = this.pricesMatrix[workId][this.selectedCustomer.id].price;
      return value !== null && value !== "" && (isNaN(value) || value < 0);
    },

    resetChanges() {
      this.pricesMatrix = JSON.parse(JSON.stringify(this.originalMatrix));
    },

    async saveOnlyChanges() {
      if (!this.changes.length) return;

      await this.saveCustomersWorkTypePrices({
        prices: this.changes,
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
.matrix-container {
  height: calc(100vh - 80px);
  display: flex;
  width: 100%;
  position: relative;
}

/* Список заказчиков слева */
.customers-list {
  width: 300px !important;
  overflow-y: auto;
  border-right: 1px solid #dee2e6;
  position: relative;
}
.customers-list .sticky-header {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 10;
  border-bottom: 2px solid #dee2e6;
}
.customers-list .sticky-col {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 5;
  border-right: 1px solid #dee2e6;
}

.customers-list .list-group-item.active.sticky-col {
  background-color: #0d6efd; /* твой основной брендовый цвет */
  color: #fff;
  font-weight: 500;
}

/* Список работ справа */
.work-types-container {
  flex-grow: 1;
  overflow: auto;
  position: relative;
}
.table-scroll-container {
  overflow-x: auto;
}

/* Таблица */
.price-matrix {
  width: 100%;
  border-collapse: collapse;
}
.price-matrix th,
.price-matrix td {
  border: 1px solid #dee2e6;
  vertical-align: middle;
}
.price-matrix th.sticky-header {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 10;
  border-bottom: 2px solid #dee2e6;
}
.price-matrix td.sticky-col {
  position: sticky;
  left: 0;
  background: #f8f9fa;
  z-index: 5;
  border-right: 2px solid #dee2e6;
}

/* Input */
td input {
  width: 100%;
}

/* Кнопки выбора типа цены */
td .btn {
  flex: 1;
  font-size: 0.875rem;
  white-space: nowrap;
}

/* Изменённая ячейка */
.changed-cell {
  background-color: #fff3cd;
  border-color: #ffc107;
}

/* Ошибочная ячейка */
.invalid-cell {
  background-color: #f8d7da;
  border-color: #dc3545;
}

/* Фиксированные кнопки */
.matrix-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #dee2e6;
  position: sticky;
  bottom: 0;
  z-index: 20;
}
</style>

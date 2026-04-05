<template>
  <app-page title="Финансовый отчет" v-if="canControl" :showBackButton="true">
    <template v-slot:headerline>
      <button
        class="btn position-absolute top-3 end-3 d-flex align-items-center me-3 brand-style"
        @click="showFinanceExportModal = true"
        style="gap: 5px; right: 0px !important; color: white"
      >
        Экспорт
      </button>
    </template>

    <FilterWizard
      :initialDateType="'month'"
      @onFilterChanged="onDateChanged"
      ref="filterWizard"
      dateTitle="Период завершения заказа"
      :showStatus="false"
    />
    <div class="alert alert-info alert-dismissible fade show mt-3" role="alert">
      В расчётах учитываются только завершённые заказы и выполненные задачи техников.<br />
      Оплаты, внесённые без привязки к заказу, в финансовом отчёте не учитываются.
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Закрыть"
      ></button>
    </div>
    <!-- Карточки с показателями -->
    <div class="row g-3" v-if="!isLoading">
      <!-- Сумма заказов -->
      <div class="col-6 col-md-3">
        <div class="card h-100 border-light shadow d-flex flex-row align-items-center">
          <div class="line-left bg-primary"></div>
          <div
            class="card-body d-flex flex-column justify-content-center align-items-center flex-grow-1"
          >
            <h5 class="card-title text-center">Сумма заказов</h5>
            <p class="card-text fs-4 fw-bold">{{ totalOrdersAmount }} {{ currency }}</p>
            <small class="text-muted text-center">по завершённым заказам</small>
          </div>
        </div>
      </div>

      <!-- Оплачено -->
      <div class="col-6 col-md-3">
        <div class="card h-100 border-light shadow d-flex flex-row align-items-center">
          <div class="line-left bg-success"></div>
          <div
            class="card-body d-flex flex-column justify-content-center align-items-center flex-grow-1"
          >
            <h5 class="card-title text-center">Оплачено</h5>
            <p class="card-text fs-4 fw-bold">{{ totalPaid }} {{ currency }}</p>
            <small class="text-muted text-center">получено от заказчиков</small>
          </div>
        </div>
      </div>

      <!-- Долг -->
      <div class="col-6 col-md-3">
        <div class="card h-100 border-light shadow d-flex flex-row align-items-center">
          <div class="line-left bg-warning"></div>
          <div
            class="card-body d-flex flex-column justify-content-center align-items-center flex-grow-1"
          >
            <h5 class="card-title text-center">Долг</h5>
            <p class="card-text fs-4 fw-bold">{{ totalCustomersDebt }} {{ currency }}</p>
            <small class="text-muted text-center">неоплаченные заказы</small>
          </div>
        </div>
      </div>

      <!-- Расход -->
      <div class="col-6 col-md-3">
        <div class="card h-100 border-light shadow d-flex flex-row align-items-center">
          <div class="line-left bg-danger"></div>
          <div
            class="card-body d-flex flex-column justify-content-center align-items-center flex-grow-1"
          >
            <h5 class="card-title text-center">Расход</h5>
            <p class="card-text fs-4 fw-bold">{{ totalExpenses }} {{ currency }}</p>
            <small class="text-muted text-center">зарплата + материалы</small>
          </div>
        </div>
      </div>

      <!-- Прибыль -->
      <div class="col-12">
        <div class="card h-100 border-light shadow d-flex flex-row align-items-center">
          <div class="line-left bg-info"></div>
          <div
            class="card-body d-flex flex-column justify-content-center align-items-center flex-grow-1"
          >
            <h5 class="card-title text-center">Прибыль</h5>
            <p class="card-text fs-4 fw-bold">{{ profit }} {{ currency }}</p>
            <small class="text-muted text-center">оплачено − расход</small>
          </div>
        </div>
      </div>
    </div>

    <Spinner v-if="isLoading" style="position: initial; margin-left: 50%" />

    <div v-if="!isLoading" style="max-width: 800px">
      <div class="table mt-4">
        <table class="table table-bordered text-center align-middle">
          <thead class="table-light">
            <tr>
              <th colspan="2">Расходы</th>
            </tr>
            <tr>
              <th>Зарплата сотрудников</th>
              <th>Расходные материалы/Закупки</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="tooltip-container" style="width: 100%">
                {{ totalUsersSalary }} {{ currency }}
                <span class="tooltip-text">
                  Фиксированная: {{ totalSalaryFixed }} {{ currency }}<br />
                  Сдельная: {{ totalSalaryPiecework }} {{ currency }}
                </span>
              </td>
              <td>{{ totalMaterialPurchasesAmount }} {{ currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-responsive mt-3 mb-5">
        <h5>Сводка по заказчикам</h5>
        <small class="text-muted">
          Показываются только заказчики с закрытыми заказами за выбранный период.
        </small>
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light text-center">
            <tr>
              <th>Заказчик</th>
              <th class="text-center">Сумма заказов</th>
              <th class="text-center">Оплачено</th>
              <th class="text-center">Долг</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in financeReport?.customers_report" :key="item.customer_id">
              <td>
                {{ item.customer_name }}
              </td>

              <td class="text-center">
                {{ getFormattedMoney(item.total_price) }}
              </td>

              <td class="text-center">
                {{ getFormattedMoney(item.total_paid) }}
              </td>

              <td
                class="text-center fw-bold"
                :class="{
                  'text-danger': item.debt > 0,
                  'text-success': item.debt === 0,
                }"
              >
                {{ getFormattedMoney(item.debt) }} {{ currency }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <FinanceExportModal v-model:show="showFinanceExportModal" />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import Spinner from "../../../components/Spinner.vue";
import FilterWizard from "../../../components/costing/FilterWizard.vue";
import FinanceExportModal from "../../../components/costing/FinanceExportModal.vue";

import {
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  IS_LAB_ADMIN,
  CURRENCY,
  FINANCE_REPORT,
  LOAD_FINANCE_REPORT,
  IS_LOADING_FINANCE_REPORT,
} from "../../../store/types";
import { formatMoney } from "../../../helpers/order-helpers";

export default {
  components: {
    AppPage,
    Spinner,
    FilterWizard,
    FinanceExportModal,
  },
  data() {
    return {
      filters: {
        date_from: "",
        date_to: "",
        status: "Finished",
      },
      showFinanceExportModal: false,
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isAdmin: IS_LAB_ADMIN,
      isLoading: IS_LOADING_FINANCE_REPORT,
      currency: CURRENCY,
      financeReport: FINANCE_REPORT,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin || this.isAdmin;
    },
    totalOrdersAmount() {
      return this.financeReport?.total_orders_amount
        ? formatMoney(this.financeReport.total_orders_amount)
        : 0;
    },
    totalPaid() {
      return this.financeReport?.total_paid
        ? formatMoney(this.financeReport.total_paid)
        : 0;
    },
    totalCustomersDebt() {
      return this.financeReport?.total_customer_debt
        ? formatMoney(this.financeReport.total_customer_debt)
        : 0;
    },
    totalExpenses() {
      return this.financeReport?.total_expenses
        ? formatMoney(this.financeReport.total_expenses)
        : 0;
    },
    totalMaterialPurchasesAmount() {
      return this.financeReport?.total_material_purchases_amount
        ? formatMoney(this.financeReport.total_material_purchases_amount)
        : 0;
    },
    totalUsersSalary() {
      return this.financeReport?.total_users_salary
        ? formatMoney(this.financeReport.total_users_salary)
        : 0;
    },
    profit() {
      return this.financeReport?.profit ? formatMoney(this.financeReport.profit) : 0;
    },
    totalSalaryFixed() {
      return this.financeReport?.total_salary_fixed
        ? formatMoney(this.financeReport.total_salary_fixed)
        : 0;
    },
    totalSalaryPiecework() {
      return this.financeReport?.total_salary_piecework
        ? formatMoney(this.financeReport.total_salary_piecework)
        : 0;
    },
  },
  async beforeMount() {
    // await this.loadItems(); // 🔥 убрал, чтобы не дергать API без необходимости. Данные загрузятся при выборе периода в фильтре
  },
  methods: {
    ...mapActions({
      loadFinanceReport: LOAD_FINANCE_REPORT,
    }),
    async loadItems() {
      this.financeReport = null; // Сбрасываем предыдущий отчет перед загрузкой нового
      await this.loadFinanceReport(this.filters);
    },
    applyFilters() {
      this.loadItems();
    },

    formatAmount(amount) {
      return formatMoney(amount);
    },
    getFormattedMoney(amount) {
      return formatMoney(amount);
    },
    onDateChanged(period) {
      this.filters.date_from = period.date_from;
      this.filters.date_to = period.date_to;
      this.applyFilters();
    },
  },
};
</script>

<style scoped>
.line-left {
  width: 6px; /* толщина цветной линии */
  height: 100%;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.card-body {
  text-align: center;
}

.tooltip-container {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  width: 300px;
  background-color: #333;
  color: #fff;
  text-align: left;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  position: absolute;
  z-index: 100;
  bottom: 125%; /* над элементом */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Маленькая стрелочка снизу тултипа */
.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%; /* внизу тултипа */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}
</style>

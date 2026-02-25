<template>
  <app-page
    title="Журнал платежей заказчиков"
    :isShowAddButton="canControl"
    @onAddButtonClickEvent="openPaymentModal"
    :showBackButton="true"
  >
    <!-- Фильтры -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label for="customerFilter" class="form-label">Заказчик</label>
            <select
              class="form-select"
              id="customerFilter"
              v-model="filters.customerId"
              @change="applyFilters"
            >
              <option value="">Все заказчики</option>
              <option
                v-for="customer in customers"
                :key="customer.id"
                :value="customer.id"
              >
                {{ customer.full_name }}
              </option>
            </select>
          </div>
          <div class="col-12 col-md-3">
            <label for="dateFrom" class="form-label">Дата от</label>
            <input
              type="date"
              class="form-control"
              id="dateFrom"
              v-model="filters.dateFrom"
              @change="applyFilters"
            />
          </div>
          <div class="col-12 col-md-3">
            <label for="dateTo" class="form-label">Дата до</label>
            <input
              type="date"
              class="form-control"
              id="dateTo"
              v-model="filters.dateTo"
              @change="applyFilters"
            />
          </div>
          <div class="col-12 col-md-2 d-flex align-items-end">
            <button class="btn btn-secondary w-100" @click="clearFilters">
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица -->
    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>Заказчик</th>
            <th>Сумма</th>
            <th>Дата платежа</th>
            <th>Комментарий</th>
            <th>Создал</th>
            <th>Дата создания</th>
            <th v-if="canControl">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="payment in paymentJournals"
            :key="payment.id"
            @click="() => goToView(payment.id)"
            style="cursor: pointer"
          >
            <td>{{ payment.customer_name }}</td>
            <td>{{ formatAmount(payment.amount) }}</td>
            <td>{{ $toDateTimeFormat(payment.payment_date) }}</td>
            <td>{{ payment.comment || "—" }}</td>
            <td>{{ payment.created_by_name || "—" }}</td>
            <td>{{ $toDateTimeFormat(payment.created_at) }}</td>
            <td v-if="canControl" @click.stop>
              <div class="d-flex justify-content-center gap-2">
                <button
                  class="btn btn-sm btn-warning"
                  @click="() => openPaymentModal(payment)"
                >
                  Редактировать
                </button>
                <button class="btn btn-sm btn-danger" @click="deletePayment(payment.id)">
                  Удалить
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!paymentJournals || paymentJournals.length === 0">
            <td :colspan="canControl ? 7 : 6" class="text-muted py-3">Нет данных</td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaymentJournalModa
      v-model:show="showPaymentModal"
      :payment="selectedPayment"
      :isEdit="selectedPayment ? true : false"
      @saved="handlePaymentSaved"
    />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import {
  PAYMENT_JOURNALS,
  DELETE_PAYMENT_JOURNAL,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LOAD_PAYMENT_JOURNALS,
  CUSTOMERS,
  LOAD_CUSTOMERS,
} from "../../store/types";
import PaymentJournalModal from "../../components/costing/payment-journal/PaymentJournalModal.vue";

export default {
  components: {
    AppPage,
    PaymentJournalModal,
  },
  data() {
    return {
      showPaymentModal: false,
      selectedPayment: null,
      filters: {
        customerId: "",
        dateFrom: "",
        dateTo: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      paymentJournals: PAYMENT_JOURNALS,
      customers: CUSTOMERS,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },
  async beforeMount() {
    await this.loadCustomers();
    await this.loadPayments();
  },
  methods: {
    ...mapActions({
      loadPaymentsAction: LOAD_PAYMENT_JOURNALS,
      deletePaymentAction: DELETE_PAYMENT_JOURNAL,
      loadCustomers: LOAD_CUSTOMERS,
    }),
    async loadPayments() {
      await this.loadPaymentsAction(this.filters);
    },
    applyFilters() {
      this.loadPayments();
    },
    clearFilters() {
      this.filters = {
        customerId: "",
        dateFrom: "",
        dateTo: "",
      };
      this.loadPayments();
    },
    formatAmount(amount) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "TJS",
        minimumFractionDigits: 0,
      }).format(amount);
    },
    goToView(id) {
      this.$router.push(`/payment-journal/view/${id}`);
    },
    openPaymentModal(payment) {
      this.showPaymentModal = true;
      this.selectedPayment = payment;
    },
    async handlePaymentSaved() {
      await this.loadPayments();
    },
    deletePayment(paymentId) {
      if (!confirm("Вы уверены, что хотите удалить этот платеж?")) {
        return;
      }

      this.deletePaymentAction({
        id: paymentId,
        callback: () => {
          this.$toast("Платеж успешно удален");
          this.loadPayments();
        },
      });
    },
  },
};
</script>

<style scoped>
.table tbody tr:hover {
  background-color: #f8f9fa;
}
</style>

<template>
  <app-page
    title="Журнал платежей заказчиков"
    @onAddButtonClickEvent="openPaymentModal"
    :showBackButton="true"
    v-if="canControl || isAdmin"
  >
    <template v-slot:headerline
      ><button
        v-if="canControl || isAdmin"
        class="btn position-absolute top-3 end-3 d-flex align-items-center me-3 brand-style"
        @click="openPaymentModal(null)"
        style="gap: 5px; right: 0px !important; color: white"
      >
        Добавить платёж
      </button></template
    >
    <!-- Фильтры -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-3">
            <label for="floatingInput" class="form-label">Заказчик</label>
            <input
              type="text"
              :readonly="true"
              class="form-control"
              id="floatingInput"
              :value="filters.customer?.full_name"
              @click="showCustomerCanvas = true"
            />
            <SelectCustomersWizard
              v-model:visible="showCustomerCanvas"
              @select-customer="onCustomerSelected"
              :isAddAllButton="true"
            />
          </div>

          <div class="col-12 col-md-3">
            <label for="date_from" class="form-label">Дата платежа от</label>
            <input
              type="date"
              class="form-control"
              id="date_from"
              v-model="filters.date_from"
              @change="applyFilters"
            />
          </div>

          <div class="col-12 col-md-3">
            <label for="date_to" class="form-label">Дата платежа до</label>
            <input
              type="date"
              class="form-control"
              id="date_to"
              v-model="filters.date_to"
              @change="applyFilters"
            />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>

    <Spinner v-if="isJournalLoading" style="position: initial; margin-left: 50%" />

    <!-- Таблица -->
    <div class="table-responsive" v-if="!isJournalLoading">
      <table
        class="table table-bordered border-primary align-middle text-center table-hover"
      >
        <thead class="">
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
            @click="() => openPaymentModal(payment)"
            style="cursor: pointer"
          >
            <td>{{ payment.customer_name }}</td>
            <td>{{ formatAmount(payment.amount) }}</td>
            <td>{{ $toDateFormat(payment.payment_date) }}</td>
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
                <button
                  class="btn btn-sm btn-danger"
                  @click="deletePayment(payment.id)"
                  v-if="canControl"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!paymentJournals || paymentJournals.length === 0">
            <td :colspan="canControl ? 7 : 6" class="text-muted py-3">
              Нет данных. Попробуйте изменить фильтр.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaymentJournalModal
      v-model:show="showPaymentModal"
      :payment="selectedPayment"
      :isEdit="selectedPayment !== null ? true : false"
      @reloadJournal="applyFilters"
    />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import {
  PAYMENT_JOURNALS,
  DELETE_PAYMENT_JOURNAL,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LOAD_PAYMENT_JOURNALS,
  CUSTOMERS,
  LOAD_CUSTOMERS,
  IS_PAYMENT_JOURNALS_LOADING,
  IS_LAB_ADMIN,
} from "../../../store/types";
import PaymentJournalModal from "../../../components/costing/payment-journal/PaymentJournalModal.vue";
import Spinner from "../../../components/Spinner.vue";
import SelectCustomersWizard from "../../../components/customers/SelectCustomersWizard.vue";

export default {
  components: {
    AppPage,
    PaymentJournalModal,
    Spinner,
    SelectCustomersWizard,
  },
  data() {
    return {
      showPaymentModal: false,
      selectedPayment: null,
      showCustomerCanvas: false,
      filters: {
        customer: {
          id: null,
          full_name: "Все заказчики",
        },
        customer_id: null,
        date_from: "",
        date_to: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isAdmin: IS_LAB_ADMIN,
      paymentJournals: PAYMENT_JOURNALS,
      customers: CUSTOMERS,
      isJournalLoading: IS_PAYMENT_JOURNALS_LOADING,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },
  async beforeMount() {
    this.paymentJournals.length = 0;
    await this.loadCustomers();

    this.setDefaultPeriod();
    await this.loadPayments();
  },
  methods: {
    ...mapActions({
      loadPaymentsAction: LOAD_PAYMENT_JOURNALS,
      deletePaymentAction: DELETE_PAYMENT_JOURNAL,
      loadCustomers: LOAD_CUSTOMERS,
    }),

    setDefaultPeriod() {
      // this.filters.date_from = dayjs().startOf("month").format("YYYY-MM-DD");
      // this.filters.date_to = dayjs().endOf("month").format("YYYY-MM-DD");
      this.filters.date_from = null;
      this.filters.date_to = null;
    },

    async loadPayments() {
      // if (!this.filters.date_from || !this.filters.date_to) {
      //   this.$toast("Укажите период для поиска");
      //   return;
      // }

      await this.loadPaymentsAction(this.filters);
    },

    applyFilters() {
      this.paymentJournals.length = 0;
      this.loadPayments();
    },

    clearFilters() {
      this.filters.customer = {
        id: null,
        full_name: "Все заказчики",
      };
      this.filters.customer_id = null;

      this.setDefaultPeriod();
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
      this.$router.push(`/management/payment-journal/view/${id}`);
    },

    openPaymentModal(payment) {
      this.showPaymentModal = true;
      this.selectedPayment = payment;
    },

    async handlePaymentSaved() {
      await this.loadPayments();
    },

    onCustomerSelected(customer) {
      this.filters.customer = customer;
      this.filters.customer_id = customer.id;
      this.applyFilters();
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

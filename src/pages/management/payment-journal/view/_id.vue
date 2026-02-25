<template>
  <app-page title="Просмотр платежа" :showBackButton="true">
    <div v-if="isLoadingStore" class="spinner-wrapper">
      <div class="spinner-border text-primary spinner" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <PaymentJournalView
      v-if="!isLoadingStore && payment"
      :payment="payment"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <PaymentJournalModal
      v-model:show="showPaymentModal"
      :payment="selectedPayment"
      :isEdit="true"
      @saved="handlePaymentSaved"
    />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../../components/AppPage.vue";
import PaymentJournalView from "../../../../components/costing/payment-journal/PaymentJournalView.vue";
import PaymentJournalModal from "../../../../components/costing/payment-journal/PaymentJournalModal.vue";
import {
  LOAD_PAYMENT_JOURNAL,
  PAYMENT_JOURNAL,
  DELETE_PAYMENT_JOURNAL,
  IS_PAYMENT_JOURNALS_LOADING,
} from "../../../../store/types";

export default {
  name: "PaymentJournalViewPage",
  components: {
    AppPage,
    PaymentJournalView,
    PaymentJournalModal,
  },
  data() {
    return {
      payment: null,
      isLoading: false,
      showPaymentModal: false,
      selectedPayment: null,
    };
  },
  computed: {
    ...mapGetters({
      paymentJournal: PAYMENT_JOURNAL,
      isLoadingStore: IS_PAYMENT_JOURNALS_LOADING,
    }),
  },
  async beforeRouteUpdate(to, from, next) {
    await this.loadPayment(to.params.id);
    next();
  },
  async beforeMount() {
    await this.loadPayment(this.$route.params.id);
  },
  methods: {
    ...mapActions({
      loadPaymentAction: LOAD_PAYMENT_JOURNAL,
      deletePaymentAction: DELETE_PAYMENT_JOURNAL,
    }),
    async loadPayment(id) {
      this.isLoading = true;
      try {
        const payment = await this.loadPaymentAction(id);
        this.payment = payment;
      } catch (error) {
        console.error("Ошибка загрузки платежа:", error);
        this.$toast("Ошибка загрузки платежа", "error");
      } finally {
        this.isLoading = false;
      }
    },
    handleEdit(payment) {
      this.selectedPayment = payment;
      this.showPaymentModal = true;
    },
    async handlePaymentSaved() {
      await this.loadPayment(this.$route.params.id);
      this.showPaymentModal = false;
    },
    handleDelete(paymentId) {
      if (!confirm("Вы уверены, что хотите удалить этот платеж?")) {
        return;
      }

      this.deletePaymentAction({
        id: paymentId,
        callback: () => {
          this.$toast("Платеж успешно удален");
          this.$router.push("/payment-journal");
        },
      });
    },
  },
};
</script>

<style scoped>
.spinner-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<template>
  <div v-if="payment" class="payment-view">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Информация о платеже</h5>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Заказчик:</strong>
            <p class="mb-0">{{ payment.customer_name }}</p>
          </div>
          <div class="col-md-6">
            <strong>Сумма:</strong>
            <p class="mb-0">{{ formatAmount(payment.amount) }}</p>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Дата платежа:</strong>
            <p class="mb-0">{{ $toDateTimeFormat(payment.payment_date) }}</p>
          </div>
          <div class="col-md-6">
            <strong>Дата создания:</strong>
            <p class="mb-0">{{ $toDateTimeFormat(payment.created_at) }}</p>
          </div>
        </div>

        <div class="row mb-3" v-if="payment.comment">
          <div class="col-12">
            <strong>Комментарий:</strong>
            <p class="mb-0">{{ payment.comment }}</p>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Создал:</strong>
            <p class="mb-0">{{ payment.created_by_name || "—" }}</p>
          </div>
        </div>

        <div class="d-flex gap-2 mt-4" v-if="canControl">
          <button
            class="btn btn-warning"
            @click="$emit('edit', payment)"
          >
            Редактировать
          </button>
          <button
            class="btn btn-danger"
            @click="deletePayment"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
} from "../../../store/types";

export default {
  name: "PaymentJournalView",
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },
  methods: {
    formatAmount(amount) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "TJS",
        minimumFractionDigits: 0,
      }).format(amount);
    },
    deletePayment() {
      this.$emit("delete", this.payment.id);
    },
  },
};
</script>

<style scoped>
.payment-view {
  max-width: 800px;
}
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
}
.card-body {
  padding: 1.5rem;
}
</style>

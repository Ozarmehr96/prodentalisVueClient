<template>
  <div class="container my-4">
    <div class="row">
      <!-- Колонка "Ожидание" -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-light fw-bold text-center">
            Ожидание
          </div>
          <div class="card-body">
            <div
              v-for="order in waitingOrders"
              :key="order.id"
              class="border rounded p-2 mb-2 bg-white"
            >
              <div class="fw-bold">{{ order.customer_name }}</div>
              <div class="text-muted small">Пациент: {{ order.patient_name }}</div>
              <div class="text-muted small">Создан: {{ formatDate(order.created_at) }}</div>
              <div class="text-muted small">Цена: {{ order.price }} ₽</div>
            </div>
            <div v-if="waitingOrders.length === 0" class="text-center text-muted">
              Нет заказов
            </div>
          </div>
        </div>
      </div>

      <!-- Колонка "В работе" -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-light fw-bold text-center">
            В работе
          </div>
          <div class="card-body">
            <div
              v-for="order in inProgressOrders"
              :key="order.id"
              class="border rounded p-2 mb-2 bg-white"
            >
              <div class="fw-bold">{{ order.customer_name }}</div>
              <div class="text-muted small">Пациент: {{ order.patient_name }}</div>
              <div class="text-muted small">Создан: {{ formatDate(order.created_at) }}</div>
              <div class="text-muted small">Цена: {{ order.price }} ₽</div>
            </div>
            <div v-if="inProgressOrders.length === 0" class="text-center text-muted">
              Нет заказов
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LOAD_ORDERS, ORDERS } from '../../store/types';

export default {
  name: "OrdersBoard",
  props: {
  },
  computed: {
    ...mapGetters({
        orders: ORDERS
    }),
    // Фильтрация по статусу
    waitingOrders() {
      return this.orders.filter(o => o.status.code === "Created");
    },
    inProgressOrders() {
      return this.orders.filter(o => o.status.code === "Started");
    }
  },
  beforeMount() {
    this.loadORders();
  },
  methods: {
    ...mapActions({
        loadORders: LOAD_ORDERS
    }),
    // Формат даты
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
@media (max-width: 768px) {
  .card-body {
    padding: 0.75rem;
  }
}
</style>

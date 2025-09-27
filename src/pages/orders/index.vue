<template>
  <app-page title="Заказы" @onAddButtonClickEvent="() => $router.push('/orders/add')" isShowAddButton>
    <div v-if="isLoading" class="my-5 spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12 mb-3" v-for="order in orders" :key="order.id" :id="`order-${order.id}`">
        <OrderCardItem :order="order" @statusChanged="() => loadOrders()" />
      </div>
      <div v-if="orders.length === 0" class="col-12">
        <p class="text-muted">Нет заказов</p>
      </div>
    </div>
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import orders from "../../store/modules/orders";
import { LOAD_ORDERS, ORDERS } from "../../store/types";
import OrderCardItem from "../../components/OrderCardItem.vue";
/**
 * Страница "Запросы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderCardItem
  },
  data() {
    return {
      isLoading: false,
    };
  },
  async beforeMount() {
    await this.loadOrders();
  },
  computed: {
    ...mapGetters({
      orders: ORDERS,
    }),
  },
  methods: {
    ...mapActions({
      loadOrdersAction: LOAD_ORDERS,
    }),
    async loadOrders() {
      this.isLoading = true;
      await this.loadOrdersAction().then(() => {
        this.isLoading = false;
      });
    }
  },
};
</script>
<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 45% !important;
}
</style>

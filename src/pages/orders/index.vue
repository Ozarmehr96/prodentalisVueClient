<template>
  <app-page
    title="Заказы"
    @onAddButtonClickEvent="() => $router.push('/orders/add')"
    isShowAddButton
  >
    <div class="row">
      <div class="col-12 mb-3" v-for="order in orders" :key="order.id" :id="`order-${order.id}`">
        <OrderCardItem :order="order" />
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
    return {};
  },
  beforeMount() {
    this.loadOrders();
  },
  computed: {
    ...mapGetters({
      orders: ORDERS,
    }),
  },
  methods: {
    ...mapActions({
      loadOrders: LOAD_ORDERS,
    }),
  },
};
</script>

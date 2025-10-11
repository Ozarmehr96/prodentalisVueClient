<template>
  <app-page title="Заказы" @onAddButtonClickEvent="() => $router.push('/orders/add')" isShowAddButton>

    <div class="row parent-container">
      <OrderFilters @search="searchByFilter"/>
      <template v-if="orders.length > 0">
        <div class="col-12 mb-3 clickable" v-for="order in orders" :key="order.id" :id="`order-${order.id}`">
          <OrderCardItem :order="order" @statusChanged="searchByFilter" />
        </div>
      </template>
      
      <div v-if="!isLoading && orders.length === 0" class="col-12 p-2">
        <p class="text-muted fs-8 mb-0">Нет данных, попробуйте изменить фильтр</p>
      </div>
      <div v-if="isLoading" class="spinner-wrapper">
        <div class="spinner-border text-primary spinner" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>
    </div>
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import orders from "../../store/modules/orders";
import { IS_ORDER_LOADING, LOAD_ORDERS, ORDER_FILTERS, ORDERS } from "../../store/types";
import OrderCardItem from "../../components/OrderCardItem";
import OrderFilters from "../../components/order/OrderFilters";
/**
 * Страница "Запросы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderCardItem,
    OrderFilters
  },
  async beforeMount() {
    await this.searchByFilter();
  },
  computed: {
    ...mapGetters({
      orders: ORDERS,
      isLoading: IS_ORDER_LOADING,
      orderFilters: ORDER_FILTERS
    }),
  },
  methods: {
    ...mapActions({
      loadOrdersAction: LOAD_ORDERS,
    }),
    async searchByFilter() {
      this.orders.length = 0;
      await this.loadOrdersAction(this.orderFilters);
    }
  },
};
</script>
<style scoped>
  .card:hover {
    border: 1px solid #007bff !important;
    /* синий цвет выделения */
    border-radius: 1rem;
  }

  .spinner {
    left: 50%;
    position: relative;
  }

  .spinner-wrapper {
    position: relative;
    /* привязка к родителю */
    top: 10px;
    /* отступ от низа родителя */
    left: 50%;
    /* по центру */
    transform: translateX(-50%);
    z-index: 99910;
    /* чтобы был поверх контента */
  }

  .parent-container {
    position: relative;
    /* чтобы спиннер позиционировался относительно родителя */
    min-height: 70px;
    /* или высота контента */
  }
</style>

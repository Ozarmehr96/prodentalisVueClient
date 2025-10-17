<template>
  <app-page title="Доска" >
    <OrderBoard />
  </app-page>
</template>

<script>
import AppPage from "../../components/AppPage.vue";
import OrderBoard from "../../components/order/OrderBoard.vue";
/**
 * Страница "Заказы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderBoard
  },
};
</script>

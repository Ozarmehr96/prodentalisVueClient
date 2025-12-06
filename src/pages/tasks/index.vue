<template>
  <app-page title="Задачи">
    <OrderTasksList />
  </app-page>
</template>
<script>
import AppPage from "../../components/AppPage.vue";
import OrderTasksList from "../../components/order-tasks/OrderTasksList.vue";
import "../../assets/global.css";
/**
 * Страница "Добавление тип работы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderTasksList,
  },
};
</script>

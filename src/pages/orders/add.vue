<template>
  <app-page title="Добавление заказа">
    <OrderWizard />
  </app-page>
</template>

<script>
import AppPage from "../../components/AppPage.vue";
import OrderWizard from "../../components/OrderWizard.vue";

/**
 * Страница "Добавление заказа"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderWizard,
  },
};
</script>

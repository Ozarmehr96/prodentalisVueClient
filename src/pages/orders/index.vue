<template>
  <app-page title="Заказы" @onAddButtonClickEvent="() => $router.push('/orders/add')" 
    :isShowAddButton="isSystemAdmin || isLabAdmin || isLabDirector">
    <OrderList />
  </app-page>
</template>

<script>
import { mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import OrderList from "../../components/order/OrderList.vue";
import { IS_LAB_ADMIN, IS_LAB_DIRECTOR, IS_SYSTEM_ADMIN } from "../../store/types";
/**
 * Страница "Заказы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderList
  },
  computed: {
    ...mapGetters({
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isLabAdmin: IS_LAB_ADMIN,
      isLabDirector: IS_LAB_DIRECTOR
    })
  }
};
</script>

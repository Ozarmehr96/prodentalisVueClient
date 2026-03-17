<template>
  <app-page
    title="Заказы"
    @onAddButtonClickEvent="() => $router.push('/orders/add')"
    :isShowAddButton="isSystemAdmin || isLabAdmin || isLabDirector"
  >
    <template v-if="isSystemAdmin || isLabAdmin || isLabDirector" v-slot:headerline>
      <!-- Кнопка обновить в правом верхнем углу -->
      <button
        class="btn btn-outline-primary position-absolute top-3 end-3 d-flex align-items-center me-3"
        @click="() => (showExportModal = true)"
        style="gap: 5px; right: 35px !important"
      >
        Экспорт
      </button>
    </template>
    <OrderList />
    <OrderExportModal v-model:show="showExportModal" />
  </app-page>
</template>

<script>
import { mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import OrderList from "../../components/order/OrderList.vue";
import {
  CURRENCY,
  CURRENT_USER,
  IS_LAB_ADMIN,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
} from "../../store/types";
import OrderExportModal from "../../components/costing/OrderExportModal.vue";
/**
 * Страница "Заказы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderList,
    OrderExportModal,
  },
  data() {
    return {
      showExportModal: false,
    };
  },
  computed: {
    ...mapGetters({
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isLabAdmin: IS_LAB_ADMIN,
      isLabDirector: IS_LAB_DIRECTOR,
      currentUser: CURRENT_USER,
      currency: CURRENCY,
    }),
  },
};
</script>

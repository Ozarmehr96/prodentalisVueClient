<template>
  <app-page title="Информация о заказе" :showBackButton="true">
    <div v-if="isLoading" class="spinner-wrapper">
      <div class="spinner-border text-primary spinner" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <OrderView :order="order" v-if="!isLoading && order" @reloadOrder="reloadOrder" />
  </app-page>
</template>
<script>
import { mapActions } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import OrderView from "../../../components/OrderView.vue";
import { LOAD_ORDER } from "../../../store/types";
/**
 * Страница "Редактирование заказа"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  name: "OrderEditPage",
  components: {
    AppPage,
    OrderView,
  },
  data() {
    return {
      order: null,
      isLoading: false,
    };
  },
  async beforeMount() {
    await this.loadOrder();
  },
  methods: {
    ...mapActions({
      loadOrderAction: LOAD_ORDER,
    }),
    async reloadOrder() {
      await this.loadOrderAction(this.$route.params.id).then((order) => {
        this.order = order;
      });
    },
    async loadOrder() {
      this.isLoading = true;
      await this.loadOrderAction(this.$route.params.id).then((order) => {
        this.isLoading = false;
        this.order = order;
      });
    },
  },
};
</script>
<style scoped>
.spinner-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

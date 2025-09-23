<template>
  <app-page title="Редактирование заказа" :showBackButton="true">
    <OrderWizard v-if="order" :isEditMode="true" :orderToEdit="order" />
  </app-page>
</template>

<script>
import { mapActions } from "vuex";
import AppPage from "../../components/AppPage.vue";
import OrderWizard from "../../components/OrderWizard.vue";
import { LOAD_ORDER } from "../../store/types";

/**
 * Страница "Редактирование заказа"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  name: "OrderEditPage",
  components: {
    AppPage,
    OrderWizard,
  },
  data() {
    return {
      order: null,
    };
  },
  async beforeMount() {
    await this.loadOrder(this.$route.params.id).then((order) => {
      this.order = order;
    });
  },
  methods: {
    ...mapActions({
      loadOrder: LOAD_ORDER,
    }),
  },
};
</script>

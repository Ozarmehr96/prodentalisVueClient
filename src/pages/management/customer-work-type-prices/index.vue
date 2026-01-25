<template>
  <app-page title="Стоимость работ по заказчикам" :showBackButton="true">
    <CustomersWorkTypePricesMatrix />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import CustomersWorkTypePricesMatrix from "../../../components/costing/customer-worktype-prices/CustomersWorkTypePricesMatrix.vue";

/**
 * Страница управления расходными материалами
 */
export default {
  components: {
    AppPage,
    CustomersWorkTypePricesMatrix,
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters({}),
  },

  async beforeMount() {},

  methods: {
    ...mapActions({}),
  },
};
</script>

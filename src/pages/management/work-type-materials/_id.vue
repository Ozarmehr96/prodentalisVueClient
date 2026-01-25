<template>
  <app-page title="Управление расходным материалом работы" :showBackButton="true">
    <WorkTypeMaterialCRUD :work-type="workTypeMaterials" v-if="workTypeMaterials" />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import WorkTypeMaterialCRUD from "../../../components/costing/work-type-materials/WorkTypeMaterialCRUD.vue";
import { LOAD_WORK_TYPE_MATERIAL, WORK_TYPE_MATERIAL } from "../../../store/types";

/**
 * Страница управления расходными материалами
 */
export default {
  components: {
    AppPage,
    WorkTypeMaterialCRUD,
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      workTypeMaterials: WORK_TYPE_MATERIAL,
    }),
  },

  async beforeMount() {
    await this.loadWorkTypeMaterials(this.$route.params.id);
  },

  methods: {
    ...mapActions({
      loadWorkTypeMaterials: LOAD_WORK_TYPE_MATERIAL,
    }),
  },
};
</script>

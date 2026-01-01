<template>
  <app-page title="Редактирование типа работы" :showBackButton="true">
    <WorkTypeWizard v-if="workType" :workTypeData="workType" :isEditMode="true" />
  </app-page>
</template>

<script>
import { mapActions } from "vuex";
import AppPage from "../../components/AppPage.vue";
import WorkTypeWizard from "../../components/WorkTypeWizard.vue";
import { LOAD_WORK_TYPE } from "../../store/types";

/**
 * Страница "Редактирование типа работы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    WorkTypeWizard,
  },
  data() {
    return {
      workTypeData: null,
    };
  },
  computed: {
    workType() {
      return this.workTypeData;
    },
  },
  async beforeMount() {
    this.workTypeData = await this.loadWorkType(this.$route.params.id);
  },
  methods: {
    ...mapActions({
      loadWorkType: LOAD_WORK_TYPE,
    }),
  },
};
</script>

<template>
  <app-page title="Редактирование этапа работы">
    <WorkStepWizard v-if="workStep" :workStepData="workStep" :isEditMode="true" />
  </app-page>
</template>

<script>
import { mapActions } from "vuex";
import AppPage from "../../components/AppPage.vue";
import WorkStepWizard from "../../components/WorkStepWizard.vue";
import { LOAD_WORK_STEP } from "../../store/types";

/**
 * Страница "Добавление этапа работы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    WorkStepWizard,
  },
  data() {
    return {
      workStepData: null,
    };
  },
  computed: {
    workStep() {
      return this.workStepData;
    },
  },
  async beforeMount() {
    this.workStepData = await this.loadWorkStep(this.$route.params.id);
  },
  methods: {
    ...mapActions({
      loadWorkStep: LOAD_WORK_STEP,
    }),
  },
};
</script>

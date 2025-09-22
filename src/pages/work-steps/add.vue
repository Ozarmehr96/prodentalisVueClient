<template>
  <app-page title="Добавление этапа работы" :showBackButton="true">
    <WorkStepWizard />
  </app-page>
</template>

<script>
import AppPage from "../../components/AppPage.vue";
import WorkStepWizard from "../../components/WorkStepWizard.vue";

/**
 * Страница "Добавление этапа работы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    WorkStepWizard
  },
};
</script>

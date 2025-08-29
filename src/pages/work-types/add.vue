<template>
  <app-page title="Добавление типа работы">
    <WorkTypeWizard />
  </app-page>
</template>

<script>
import AppPage from "../../components/AppPage.vue";
import WorkTypeWizard from "../../components/WorkTypeWizard.vue";

/**
 * Страница "Добавление тип работы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    WorkTypeWizard
  },
};
</script>

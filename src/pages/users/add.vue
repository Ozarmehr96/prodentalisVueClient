<template>
  <app-page title="Добавление сотрудника" :showBackButton="true">
    <UserFromCRUD />
  </app-page>
</template>

<script>
import AppPage from "../../components/AppPage.vue";
import UserFromCRUD from "../../components/UserFromCRUD.vue";

/**
 * Страница "Добавление нового сотрудника"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    UserFromCRUD,
  },
};
</script>

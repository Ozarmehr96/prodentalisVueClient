<template>
  <app-page title="Мой профиль">
    <Profile version="1.0" />
  </app-page>
</template>

<script>
import AppPage from "../../components/AppPage.vue";
import Profile from "../../components/Profile.vue";

/**
 * Страница "Добавление этапа работы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    Profile,
  },
};
</script>

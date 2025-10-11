<template>
  <app-page title="Добавление лаборатории" :showBackButton="true">
    <LabCRUD />
  </app-page>
</template>

<script>
import AppPage from "../../components/AppPage.vue";
import LabCRUD from "../../components/lab/LabCRUD.vue";

/**
 * Страница "Редактирование заказа"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  name: "LabAdd",
  components: {
    AppPage,
    LabCRUD,
  },
};
</script>

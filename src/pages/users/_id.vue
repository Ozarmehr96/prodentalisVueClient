<template>
  <app-page title="Редактирование данных сотрудника" :showBackButton="true">
    <UserFromCRUD v-if="user" :existingUser="user" />
  </app-page>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import AppPage from "../../components/AppPage.vue";
  import UserFromCRUD from "../../components/UserFromCRUD.vue";
  import { LOAD_USER, LOADED_USER } from "../../store/types";

  /**
   * Страница "Редактирование сотрудника"
   */
  export default {
    components: {
      AppPage,
      UserFromCRUD,
    },
    async beforeMount() {
      await this.loadUser(this.$route.params.id);
    },
    computed: {
      ...mapGetters({
        user: LOADED_USER
      })
    },
    methods: {
      ...mapActions({
        loadUser: LOAD_USER
      })
    }
  };
</script>

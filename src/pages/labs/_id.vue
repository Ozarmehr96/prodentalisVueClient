<template>
  <app-page title="Редактирование лаборатории" :showBackButton="true">
    <LabCRUD :existingLab="lab" editMode/>
  </app-page>
</template>

<script>
import { mapActions } from "vuex";
import AppPage from "../../components/AppPage.vue";
import LabCRUD from "../../components/lab/LabCRUD.vue";
import { LOAD_LAB } from "../../store/types";

/**
 * Страница "Редактирование заказа"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  name: "LabEdit",
  components: {
    AppPage,
    LabCRUD,
  },
  data() {
    return {
      lab: null,
    };
  },
  async beforeMount() {
    await this.loadLab(this.$route.params.id).then((lab) => {
      this.lab = lab;
    });
  },
  methods: {
    ...mapActions({
      loadLab: LOAD_LAB,
    }),
  },
};
</script>

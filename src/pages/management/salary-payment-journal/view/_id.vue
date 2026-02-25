<template>
  <app-page title="Просмотр начисления" :showBackButton="true">
    <div v-if="isLoading" class="spinner-wrapper">
      <div class="spinner-border text-primary spinner" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <SalaryJournalView
      v-if="!isLoading && item"
      :item="item"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <SalaryJournalModal
      v-model:show="showModal"
      :item="selectedItem"
      :isEdit="true"
      @saved="handleSaved"
    />
  </app-page>
</template>

<script>
import { mapActions } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import SalaryJournalView from "../../../components/costing/salary-journal/SalaryJournalView.vue";
import SalaryJournalModal from "../../../components/costing/salary-journal/SalaryJournalModal.vue";
import {
  LOAD_SALARY_JOURNAL,
  DELETE_SALARY_JOURNAL,
} from "../../../store/types";

export default {
  name: "SalaryJournalViewPage",
  components: {
    AppPage,
    SalaryJournalView,
    SalaryJournalModal,
  },
  data() {
    return {
      item: null,
      isLoading: false,
      showModal: false,
      selectedItem: null,
    };
  },
  async beforeRouteUpdate(to, from, next) {
    await this.loadItem(to.params.id);
    next();
  },
  async beforeMount() {
    await this.loadItem(this.$route.params.id);
  },
  methods: {
    ...mapActions({
      loadItemAction: LOAD_SALARY_JOURNAL,
      deleteItemAction: DELETE_SALARY_JOURNAL,
    }),
    async loadItem(id) {
      this.isLoading = true;
      try {
        const res = await this.loadItemAction(id);
        this.item = res;
      } catch (e) {
        console.error("Ошибка загрузки начисления:", e);
        this.$toast("Ошибка загрузки начисления", "error");
      } finally {
        this.isLoading = false;
      }
    },
    handleEdit(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    async handleSaved() {
      await this.loadItem(this.$route.params.id);
      this.showModal = false;
    },
    handleDelete(id) {
      if (!confirm("Вы уверены, что хотите удалить это начисление?")) {
        return;
      }
      this.deleteItemAction({
        id,
        callback: () => {
          this.$toast("Начисление успешно удалено");
          this.$router.push("/salary-journal");
        },
      });
    },
  },
};
</script>

<style scoped>
.spinner-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>


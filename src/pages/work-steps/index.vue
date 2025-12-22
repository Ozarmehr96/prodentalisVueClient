<template>
  <app-page
    title="Этапы работ"
    @onAddButtonClickEvent="() => $router.push('/work-steps/add')"
    isShowAddButton
  >
    <SearchByTitle @search="onSearch" class="mb-4" />

    <!-- Main content -->
    <div class="content-body">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Название</th>
            <th scope="col" class="d-none d-sm-table-cell">Приоритет</th>
            <th scope="col" class="d-none d-sm-table-cell">Цена по умолчанию</th>
            <th scope="col" class="d-none d-sm-table-cell">Комментарии</th>
            <th scope="col" v-if="isLabDirector">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="step in filtredWorkSteps"
            @click="() => $router.push(`/work-steps/${step.id}`)"
          >
            <td>
              {{ step.name }}
            </td>
            <td class="d-none d-sm-table-cell">{{ step.priority }}</td>
            <td class="d-none d-sm-table-cell">
              {{ step.price }}
            </td>
            <td class="d-none d-sm-table-cell">{{ step.description }}</td>
            <td v-if="isLabDirector">
              <button class="btn btn-danger btn-sm" @click.stop="deleteWorkStep(step.id)">
                <i class="bi bi-trash"></i>
                <!-- иконка из Bootstrap Icons -->
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import { DELETE_WORK_STEP, IS_LAB_DIRECTOR, LOAD_WORK_STEPS } from "../../store/types";
import SearchByTitle from "../../components/SearchByTitle.vue";

/**
 * Страница "Добавление этапа работ"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    SearchByTitle,
  },
  data() {
    return {
      workSteps: [],
      searchName: "",
    };
  },
  async beforeMount() {
    this.workSteps = await this.loadWorkSteps();
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
    }),
    filtredWorkSteps() {
      if (this.searchName) {
        return this.workSteps
          .filter((step) =>
            step.name.toLowerCase().includes(this.searchName.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name));
      }

      return this.workSteps.sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  methods: {
    ...mapActions({
      loadWorkSteps: LOAD_WORK_STEPS,
      deleteWorkStepAction: DELETE_WORK_STEP,
    }),
    deleteWorkStep(id) {
      if (confirm("Вы уверены, что хотите удалить этот этап работы?")) {
        this.deleteWorkStepAction(id).then(() => {
          this.workSteps = this.workSteps.filter((step) => step.id !== id);
          this.$toast("Этап работы удален.", 5000);
        });
      }
    },
    onSearch(searchTerm) {
      this.searchName = searchTerm;
    },
  },
};
</script>

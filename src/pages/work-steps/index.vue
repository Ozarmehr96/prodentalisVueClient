<template>
  <app-page
    title="Этапы работ"
    @onAddButtonClickEvent="() => $router.push('/work-steps/add')"
    isShowAddButton
  >
    <!-- Main content -->
    <div class="content-body">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Название</th>
            <th scope="col" class="d-none d-sm-table-cell">Приоритет</th>
            <th scope="col" class="d-none d-sm-table-cell">
              Цена по умолчанию
            </th>
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
              <button
                class="btn btn-danger btn-sm"
                @click.stop="deleteWorkStep(step.id)"
              >
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

/**
 * Страница "Добавление этапа работ"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
  },
  data() {
    return {
      workSteps: [],
    };
  },
  async beforeMount() {
    this.workSteps = await this.loadWorkSteps();
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR
    }),
    filtredWorkSteps() {
      return this.workSteps;
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
  },
};
</script>

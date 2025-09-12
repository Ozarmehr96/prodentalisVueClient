<template>
  <app-page
    title="Типы работ"
    @onAddButtonClickEvent="() => $router.push('/work-types/add')"
    isShowAddButton
  >
    <!-- Main content -->
    <div class="content-body">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Комментарии</th>
            <th scope="col">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="workType in filtredWorkTypes"
            @click="() => $router.push(`/work-types/${workType.id}`)"
          >
            <td>
              {{ workType.name }}
            </td>
            <td>{{ workType.description }}</td>
            <td>
              <button
                class="btn btn-danger btn-sm"
                @click.stop="deleteWorkType(workType.id)"
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
import { mapActions } from "vuex";
import AppPage from "../../components/AppPage.vue";
import { DELETE_WORK_TYPE, LOAD_WORK_TYPES, WORK_TYPES } from "../../store/types";
import { mapGetters } from "vuex/dist/vuex.cjs.js";

/**
 * Страница "Типы работ"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
  },
  async beforeMount() {
    await this.loadWorkSteps();
  },
  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES,
    }),
    filtredWorkTypes() {
      return this.workTypes;
    },
  },
  methods: {
    ...mapActions({
      loadWorkSteps: LOAD_WORK_TYPES,
      deleteWorkTypeAction: DELETE_WORK_TYPE,
    }),
    async deleteWorkType(id) {
      await this.deleteWorkTypeAction(id).then(() => {
        this.$toast(`Тип работы успешно удален`);
        this.workTypes = this.workTypes.filter((type) => type.id !== id);
      });
    },
  },
};
</script>

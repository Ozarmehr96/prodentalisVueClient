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
                @click.stop="deleteWorkStep(workType.id)"
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
import { LOAD_WORK_TYPES } from "../../store/types";

/**
 * Страница "Типы работ"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
  },
  data() {
    return {
      workTypes: [],
    };
  },
  async beforeMount() {
    this.workTypes = await this.loadWorkSteps();
  },
  computed: {
    filtredWorkTypes() {
      return this.workTypes;
    },
  },
  methods: {
    ...mapActions({
      loadWorkSteps: LOAD_WORK_TYPES,
    }),
    deleteWorkStep(id) {},
  },
};
</script>

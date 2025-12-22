<template>
  <app-page
    title="Типы работ"
    @onAddButtonClickEvent="() => $router.push('/work-types/add')"
    isShowAddButton
  >
    <SearchByTitle @search="(n) => (searchName = n)" class="mb-3" />

    <!-- Main content -->
    <div class="content-body">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Комментарии</th>
            <th scope="col" v-if="isLabDirector">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="workType in filtredWorkTypes"
            @click="() => $router.push(`/work-types/${workType.id}`)"
          >
            <td>
              <WorkTypeCardItem :workType="workType" />
            </td>
            <td>{{ workType.description }}</td>
            <td v-if="isLabDirector">
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
import {
  DELETE_WORK_TYPE,
  IS_LAB_DIRECTOR,
  LOAD_WORK_TYPES,
  WORK_TYPES,
} from "../../store/types";
import { mapGetters } from "vuex/dist/vuex.cjs.js";
import WorkTypeCardItem from "../../components/WorkTypeCardItem.vue";
import SearchByTitle from "../../components/SearchByTitle.vue";

/**
 * Страница "Типы работ"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    WorkTypeCardItem,
    SearchByTitle,
  },
  async beforeMount() {
    await this.loadWorkTypes();
    await this.loadWorkTypes();
  },
  data() {
    return {
      searchName: "",
    };
  },
  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES,
      isLabDirector: IS_LAB_DIRECTOR,
    }),
    filtredWorkTypes() {
      if (this.searchName) {
        return this.workTypes
          .filter((type) =>
            type.name.toLowerCase().includes(this.searchName.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name));
      }

      return this.workTypes.sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES,
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

<template>
  <app-page
    title="Лаборатории"
    @onAddButtonClickEvent="() => $router.push('/labs/add')"
    isShowAddButton
  >
    <!-- Main content -->
    <div class="content-body" v-if="isSystemAdmin">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">ИД</th>
            <th scope="col">Название</th>
            <th scope="col">Дата создания</th>
            <th scope="col">Директор</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lab in labs" @click="() => $router.push(`/labs/${lab.id}`)" style="cursor: pointer;">
            <td>{{ lab.id }}</td>
            <td>{{ lab.name }}</td>
            <td>{{ $toDateTimeFormat(lab.created_at) }}</td>
            <td>{{ lab.director_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </app-page>
</template>
<script>
import AppPage from "../../components/AppPage.vue";
import { mapGetters, mapActions } from "vuex";
import { CURRENT_USER, IS_SYSTEM_ADMIN, LOAD_LABS } from "../../store/types";
export default {
  components: {
    AppPage,
  },
  data() {
    return {
      labs: [],
    };
  },
  async beforeMount() {
    this.labs = await this.loadLabs();
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER,
      isSystemAdmin: IS_SYSTEM_ADMIN
    }),
  },
  methods: {
    ...mapActions({
      loadLabs: LOAD_LABS,
    }),
  },
};
</script>
<style>
.employee-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* расстояние между аватаром и именем */
}
</style>

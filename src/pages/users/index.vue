<template>
  <app-page
    title="Сотрудники"
    @onAddButtonClickEvent="() => $router.push('/users/add')"
    :isShowAddButton="canControl"
    :showBackButton="true"
  >
    <!-- Main content -->
    <div class="content-body">
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>№</th>
            <th>Сотрудник</th>
            <th>Роль</th>
            <th>Специализация</th>
            <th>Логин</th>
            <th>Телефон</th>
            <th>Дата рождения</th>
            <th>Дата регистрации</th>
            <th v-if="isLabDirector">Действия</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(user, index) in filtresUsers"
            :key="user.id"
            @click="() => $router.push(`/users/${user.id}`)"
            style="cursor: pointer"
          >
            <!-- № -->
            <td>{{ index + 1 }}</td>

            <!-- Сотрудник -->
            <td class="text-start">
              <div class="d-flex align-items-center gap-2">
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  class="rounded-circle"
                  style="width: 32px; height: 32px"
                />
                <svg v-else class="avatar bi">
                  <use xlink:href="#people-circle"></use>
                </svg>
                <span>{{ user.full_name }}</span>
              </div>
            </td>

            <!-- Роль -->
            <td>
              <span class="badge bg-primary">
                {{ user.role_title }}
              </span>
            </td>

            <!-- Специализация -->
            <td>
              {{ user.specialization || "—" }}
            </td>

            <!-- Логин -->
            <td>{{ user.login }}</td>

            <!-- Телефон -->
            <td>{{ user.phone_number }}</td>

            <!-- Дата рождения -->
            <td>{{ $toDateFormat(user.date_birth) }}</td>

            <!-- Дата регистрации -->
            <td>{{ $toDateTimeFormat(user.registration_datetime) }}</td>

            <!-- Действия -->
            <td v-if="isLabDirector">
              <div class="d-flex justify-content-center gap-2">
                <button
                  v-if="user.role !== 'LabDirector'"
                  class="btn btn-sm btn-danger"
                  @click.stop="deleteUser(user)"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>

          <!-- Пустой список -->
          <tr v-if="!filtresUsers || filtresUsers.length === 0">
            <td colspan="9" class="text-muted py-3">Нет сотрудников для отображения</td>
          </tr>
        </tbody>
      </table>
    </div>
  </app-page>
</template>
<script>
import AppPage from "../../components/AppPage.vue";
import { mapGetters, mapActions } from "vuex";
import {
  CURRENT_USER,
  DELETE_USER,
  IS_LAB_ADMIN,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LOAD_MAIN_ROLES,
  LOAD_USERS,
} from "./../../store/types";
export default {
  components: {
    AppPage,
  },
  data() {
    return {
      users: [],
    };
  },
  async beforeMount() {
    this.users = await this.loadUsers();
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isLabAdmin: IS_LAB_ADMIN,
      isLabDirector: IS_LAB_DIRECTOR,
    }),
    canControl() {
      return this.isLabAdmin || this.isLabDirector || this.isSystemAdmin;
    },
    filtresUsers() {
      return this.users;
    },
  },
  methods: {
    ...mapActions({
      loadMainRoles: LOAD_MAIN_ROLES,
      loadUsers: LOAD_USERS,
      deleteUserAction: DELETE_USER,
    }),
    goToEditPage(e) {
      console.log(e);
    },
    async deleteUser(user) {
      console.log(user);
      if (confirm(`Вы действительно хотите  удалить сотрудника '${user.short_name}'`)) {
        await this.deleteUserAction(user.id).then(async () => {
          this.$toast(`Сотрудник удален из системы`);
          this.users = await this.loadUsers();
          return;
        });
      }
    },
  },
};
</script>
<style>
.employee-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* расстояние между аватаром и именем */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* круглый аватар */
  object-fit: cover; /* чтобы картинка не деформировалась */
  border: 1px solid #ccc; /* опционально, рамка */
}
</style>

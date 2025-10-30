<template>
  <app-page
    title="Сотрудники"
    @onAddButtonClickEvent="() => $router.push('/users/add')"
    :isShowAddButton="canControl"
  >
    <!-- Main content -->
    <div class="content-body">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col" class="d-none d-sm-table-cell">ФИО</th>
            <th scope="col" class="d-none d-sm-table-cell">Роль</th>
            <th scope="col" class="d-none d-sm-table-cell">Специализация</th>
            <th scope="col" class="d-none d-sm-table-cell">Логин</th>
            <th scope="col" class="d-none d-sm-table-cell">Телефон</th>
            <th scope="col" class="d-none d-sm-table-cell">Дата рождения</th>
            <th scope="col" class="d-none d-sm-table-cell">Дата регистрации</th>
            <th scope="col" v-if="isLabDirector">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filtresUsers" @click="() => $router.push(`/users/${user.id}`)" style="cursor:pointer">
            <td class="employee-cell">
              <img
                v-if="user.avatar_url"
                :src="user.avatar_url"
                alt=""
                class="rounded-circle me-2 d-none d-sm-table-cell"
                style="width: 32px; height: 32px"
              />
              <svg v-else class="avatar bi me-2 d-none d-sm-table-cell">
                <use xlink:href="#people-circle"></use>
              </svg>
              <span>{{ user.full_name }}</span>
            </td>
            <td class="d-none d-sm-table-cell">{{ user.role_title }}</td>
            <td class="d-none d-sm-table-cell">
              {{ user.specialization ? user.specialization : "Не указано" }}
            </td>
            <td class="d-none d-sm-table-cell">{{ user.login }}</td>
            <td class="d-none d-sm-table-cell">{{ user.phone_number }}</td>
            <td class="d-none d-sm-table-cell">
              {{ $toDateFormat(user.date_birth) }}
            </td>
            <td class="d-none d-sm-table-cell">
              {{ $toDateTimeFormat(user.registration_datetime) }}
            </td>

            <td class="d-sm-table-cell">
             <button v-if="user.role !== 'LabDirector' && isLabDirector"
                class="btn btn-danger btn-sm removeButton"
                @click.stop="deleteUser(user)"
              >
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
import AppPage from "../../components/AppPage.vue";
import { mapGetters, mapActions } from "vuex";
import { CURRENT_USER, DELETE_USER, IS_LAB_ADMIN, IS_LAB_DIRECTOR, IS_SYSTEM_ADMIN, LOAD_MAIN_ROLES, LOAD_USERS } from "./../../store/types";
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
      isLabDirector: IS_LAB_DIRECTOR
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
      deleteUserAction: DELETE_USER
    }),
    goToEditPage(e) {
      console.log(e);
    },
    async deleteUser(user) {
      console.log(user);
      if (confirm(`Вы действительно хотите  удалить сотрудника '${user.short_name}'`)) {
        await this.deleteUserAction(user.id).then(async() => {
          this.$toast(`Сотрудник удален из системы`);
          this.users = await this.loadUsers();
          return;
        });
      }
    }
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

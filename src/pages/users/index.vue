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
            <th scope="col">ФИО</th>
            <th scope="col" class="d-none d-sm-table-cell">Роль</th>
            <th scope="col" class="d-none d-sm-table-cell">Специализация</th>
            <th scope="col" class="d-none d-sm-table-cell">Логин</th>
            <th scope="col" class="d-none d-sm-table-cell">Телефон</th>
            <th scope="col" class="d-none d-sm-table-cell">Дата рождения</th>
            <th scope="col" class="d-none d-sm-table-cell">Дата регистрации</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filtresUsers">
            <td class="employee-cell">
              <img
                v-if="user.avatar_url"
                :src="user.avatar_url"
                alt=""
                class="rounded-circle me-2"
                style="width: 32px; height: 32px"
              />
              <svg v-else class="avatar bi me-2">
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
          </tr>
        </tbody>
      </table>
    </div>
  </app-page>
</template>
<script>
import AppPage from "../../components/AppPage.vue";
import { mapGetters, mapActions } from "vuex";
import { CURRENT_USER, IS_LAB_ADMIN, IS_LAB_DIRECTOR, IS_SYSTEM_ADMIN, LOAD_ROLES, LOAD_USERS } from "./../../store/types";
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
      this.isLabAdmin || this.isLabDirector || this.isSystemAdmin;
    },
    filtresUsers() {
      return this.users;
    },
  },
  methods: {
    ...mapActions({
      loadRoles: LOAD_ROLES,
      loadUsers: LOAD_USERS,
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* круглый аватар */
  object-fit: cover; /* чтобы картинка не деформировалась */
  border: 1px solid #ccc; /* опционально, рамка */
}
</style>

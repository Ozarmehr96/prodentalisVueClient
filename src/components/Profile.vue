<template>
  <div class="employee-profile">
    <div class="d-flex align-items-center flex-column flex-md-row">
      <!-- Аватар сотрудника -->
      <div class="avatar-wrapper me-md-3 mb-3 mb-md-0">
        <img
          v-if="employee.avatar_url"
          :src="employee.avatar_url || defaultAvatar"
          alt="avatar"
          class="rounded-circle avatar-img"
        />

        <svg
          width="70"
          height="70"
          v-if="!employee.avatar_url"
          class="rounded-circle avatar-img"
        >
          <use xlink:href="#people-circle"></use>
        </svg>
      </div>

      <!-- Основная информация -->
      <div class="flex-grow-1">
        <h5 class="mb-2 fw-bold">{{ employee.full_name }}</h5>

        <!-- Основная роль -->
        <div class="mb-2">
          <span class="badge bg-success">{{ employee.role_title }}</span>
        </div>

        <!-- Дополнительные роли -->
        <div v-if="userRoles && userRoles.length > 0" class="mb-2">
          <span class="badge bg-secondary me-1">Доп. роли:</span>
          <span
            v-for="(r, index) in userRoles"
            :key="index"
            class="badge bg-info text-dark me-1 mb-1"
          >
            {{ r }}
          </span>
        </div>
        <!-- Версия программы -->
        <p class="mt-2 text-primary fw-semibold">Версия программы: {{ version }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { CURRENT_USER, LOAD_ROLES, ROLES } from "../store/types";

export default {
  name: "EmployeeProfile",
  props: {
    version: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      defaultAvatar: null, // Замени на свой путь
    };
  },
  async beforeMount() {
    await this.loadRoles();
  },
  computed: {
    ...mapGetters({
      employee: CURRENT_USER,
      roles: ROLES,
    }),
    userRoles() {
      console.log("Employee roles:", this.employee.roles);
      console.log("All roles:", this.roles);
      console.log(
        "dddd",
        this.roles.filter((role) => this.employee.roles.includes(role.id))
      );
      return this.roles
        .filter((role) => this.employee.roles.includes(role.id))
        .map((role) => role.name);
    },
  },
  methods: {
    ...mapActions({
      loadRoles: LOAD_ROLES,
    }),
  },
};
</script>

<style scoped>
.avatar-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .avatar-img {
    width: 70px;
    height: 70px;
  }
}
</style>

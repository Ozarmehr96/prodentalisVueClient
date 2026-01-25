<template>
  <app-page
    title="Роли"
    :isShowAddButton="canControl"
    @onAddButtonClickEvent="openRoleModal"
    :showBackButton="true"
  >
    <!-- Здесь будет таблица ролей -->
    <div class="table-responsive">
      <!-- Таблица Bootstrap -->
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>№</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Создал</th>
            <th>Дата создания</th>
            <th v-if="canControl">Действия</th>
          </tr>
        </thead>
        <tbody>
          <!-- Перебор списка ролей -->
          <tr v-for="(role, index) in roles" :key="role.id">
            <td>{{ index + 1 }}</td>
            <td>{{ role.name }}</td>
            <td>
              <span
                class="badge"
                :class="role.status === 'Active' ? 'bg-success' : 'bg-secondary'"
              >
                {{ role.status === "Active" ? "Активна" : "Неактивна" }}
              </span>
            </td>
            <td>{{ role.created_by_full_name }}</td>
            <td>{{ $toDateTimeFormat(role.created_at) }}</td>
            <td v-if="canControl">
              <!-- Кнопки действий -->
              <div class="d-flex justify-content-center gap-2">
                <!-- Кнопка редактирования -->
                <button
                  class="btn btn-sm btn-warning me-2"
                  @click="() => openRoleModal(role.name, true, role.id)"
                >
                  Редактировать
                </button>

                <!-- Кнопка удаления -->
                <button class="btn btn-sm btn-danger me-2" @click="deleteRole(role.id)">
                  Удалить
                </button>
              </div>
            </td>
          </tr>
          <!-- Если список пуст -->
          <tr v-if="!roles || roles.length === 0">
            <td colspan="6" class="text-muted py-3">Нет ролей для отображения</td>
          </tr>
        </tbody>
      </table>
    </div>
    <RoleModal ref="roleModal" />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import {
  DELETE_ROLE,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LOAD_ROLE,
  LOAD_ROLES,
  ROLES,
} from "../../store/types";
import RoleModal from "../../components/roles/RoleModal.vue";

/**
 * Страница "Роли"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    RoleModal,
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      roles: ROLES,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },
  async beforeMount() {
    await this.loadRoles();
  },
  methods: {
    ...mapActions({
      loadRoles: LOAD_ROLES,
      loadRole: LOAD_ROLE,
      deleteRoleAction: DELETE_ROLE,
    }),
    deleteRole(roleId) {
      console.log("Удаление роли с ID:", roleId);
      if (!confirm("Вы уверены, что хотите удалить эту роль?")) {
        return;
      }

      this.deleteRoleAction({
        id: roleId,
        callback: () => this.$toast("Роль успешно удалена"),
      });
    },
    openRoleModal(roleName = "", isEdit = false, roleId = null) {
      this.$refs.roleModal.open({ roleName, isEdit, roleId });
    },
  },
};
</script>

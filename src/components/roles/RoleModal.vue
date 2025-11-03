<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3 position-relative">
        <!-- Кнопка закрытия сверху справа -->
        <button
          type="button"
          class="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          @click="close"
        ></button>

        <h5 class="mb-3">{{ isEdit ? "Редактирование роли" : "Создание роли" }}</h5>

        <form @submit.prevent="saveRole">
          <div class="d-flex align-items-center gap-2">
            <input
              type="text"
              class="form-control"
              v-model.trim="roleName"
              placeholder="Введите название роли"
            />
            <ButtonWithLoader
              type="submit"
              :isLoading="isLoading"
              title="Сохранить"
              :customClasses="['btn', roleName ? 'brand-style' : 'btn-outline-secondary']"
              loadingText=""
              :isValid="isValid"
            />
          </div>
        </form>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { IS_ROLES_LOADING, SAVE_ROLE, UPDATE_ROLE } from "../../store/types";
import ButtonWithLoader from "../ButtonWithLoader.vue";

export default {
  name: "RoleModal",
  components: {
    ButtonWithLoader,
  },
  data() {
    return {
      show: false,
      roleName: "",
      roleId: null,
      isEdit: false,
      originalRoleName: null,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: IS_ROLES_LOADING,
    }),
    isValid() {
      if (this.isEdit) {
        return (
          this.roleName.trim().length > 0 &&
          this.roleName.trim() !== this.originalRoleName
        );
      }

      return this.roleName.trim().length > 0;
    },
  },
  methods: {
    ...mapActions({
      saveRoleAction: SAVE_ROLE,
      updateRoleAction: UPDATE_ROLE,
    }),
    // Открыть модалку, можно передать имя роли и флаг редактирования
    open({ roleName = "", isEdit = false, roleId = null } = {}) {
      this.roleName = roleName;
      this.roleId = roleId;
      this.isEdit = isEdit;
      this.show = true;
      this.originalRoleName = roleName;
    },

    // Закрыть модалку
    close() {
      this.show = false;
    },

    // Сохранить роль
    async saveRole() {
      if (!this.roleName) return;

      if (this.isEdit) {
        await this.updateRoleAction({
          name: this.roleName,
          id: this.roleId,
          callback: () => {
            this.close();
            this.$toast("Роль успешно обновлена");
          },
        });
      } else {
        await this.saveRoleAction({
          name: this.roleName,
          callback: () => {
            this.close();
            this.$toast(`Роль "${this.roleName}" успешно создана`);
          },
        });
      }
    },
  },
};
</script>

<style scoped>
.modal {
  display: block;
  background: transparent;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
.modal-dialog {
  z-index: 1050;
}
</style>

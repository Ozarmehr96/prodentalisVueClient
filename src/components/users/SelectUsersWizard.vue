<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" ref="offcanvasRef">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Выбор сотрудника</h5>
      <button type="button" class="btn-close" @click="closeOffcanvas"></button>
    </div>

    <button
      type="button"
      class="btn btn-primary me-3 ms-3 brand-style"
      @click="showUserModal = true"
    >
      Добавить нового сотрудника
    </button>

    <div class="offcanvas-body">
      <input
        type="text"
        class="form-control mb-3"
        placeholder="Поиск сотрудника..."
        v-model="searchQuery"
      />

      <div class="list-group">
        <button
          v-for="user in filteredUsers"
          :key="user.id"
          type="button"
          class="list-group-item list-group-item-action"
          @click="selectUser(user)"
        >
          <div class="fw-bold" style="color: black">
            {{ user.full_name }}
          </div>
          <small class="text-muted">
            {{ user.phone }}
          </small>
        </button>

        <div v-if="filteredUsers.length === 0" class="text-muted mt-2">
          Сотрудники не найдены
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";
import { mapActions } from "vuex";
import { LOAD_USERS } from "../../store/types";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAddAllButton: false,
  },
  data() {
    return {
      searchQuery: "",
      bsOffcanvas: null,
      showUserModal: false,
      users: [],
    };
  },
  computed: {
    filteredUsers() {
      let users = [];

      if (this.isAddAllButton) {
        users.push({
          id: null,
          full_name: "Все сотрудники",
        });
      }

      const filtered = this.users
        .filter(
          (u) =>
            (u.full_name &&
              u.full_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
            (u.phone && u.phone.includes(this.searchQuery))
        )
        .sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));

      return [...users, ...filtered];
    },
  },
  watch: {
    visible(val) {
      if (!this.bsOffcanvas) return;
      if (val) this.bsOffcanvas.show();
    },
  },
  async mounted() {
    if (this.users.length === 0) {
      this.users = await this.loadUsers();
    }

    this.bsOffcanvas = new bootstrap.Offcanvas(this.$refs.offcanvasRef);

    this.$refs.offcanvasRef.addEventListener("hide.bs.offcanvas", () => {
      this.$emit("update:visible", false);
    });

    this.$refs.offcanvasRef.addEventListener("show.bs.offcanvas", () => {
      this.$emit("update:visible", true);
    });

    if (this.visible) this.bsOffcanvas.show();
  },
  methods: {
    ...mapActions({
      loadUsers: LOAD_USERS,
    }),

    closeOffcanvas() {
      this.bsOffcanvas.hide();
    },

    selectUser(user) {
      this.$emit("select-user", user);
      this.closeOffcanvas();
    },
  },
};
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>

<template>
  <div class="d-flex">
    <!-- Боковое меню -->
    <div v-if="isLogged">
      <Sidebar />
    </div>

    <!-- Рабочая область -->
    <div class="flex-grow-1">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import Toast from "./components/Toast.vue";
import { CURRENT_USER, INITIALIZE_AUTH_STATE } from "./store/types";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Sidebar, Toast },
  name: "AppHeader",
  async beforeMount() {
    await this.initAuthState();
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER,
    }),
    isLogged() {
      return this.currentUser && this.currentUser.id;
    },
  },
  methods: {
    ...mapActions({
      initAuthState: INITIALIZE_AUTH_STATE,
    }),
  },
};
</script>
<style>
.logo {
  background-image: url("./logo.svg");
  width: 50px;
  height: 40px;
  display: inline-block;
}
.brand-style {
  background-color: #3dd2cc !important;
  border-color: #3dd2cc !important;
}
.brand-style:hover {
  background-color: #36bfba !important;
}
.teeth {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tooth {
  font-size: 14px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>

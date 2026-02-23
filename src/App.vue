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
body {
  min-width: 320px !important;
}
.logo {
  background-image: url("./logo.svg");
  width: 50px;
  height: 40px;
  display: inline-block;
}
.brand-style {
  background-color: #08c2ba !important;
  border-color: #08c2ba !important;
}
.brand-style:hover {
  background-color: #0ca8a3 !important;
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

.v3-infinite-loading {
  height: 0px !important;
}
.v3-infinite-loading > div {
  display: none !important;
}
.v3-infinite-loading > span {
  display: none !important;
}
.infinite-loading-no-more {
  display: none !important;
}

/* Стили для OrderCardItem.vue */
.order-item-footer {
  min-width: 250px;
  max-height: 38px;
  padding: 0.25rem 0.5rem;
  overflow: hidden;
}
</style>

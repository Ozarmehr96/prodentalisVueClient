<template>
  <nav class="mobile-bottom-nav d-md-none bg-light border-top fixed-bottom">
    <div class="d-flex justify-content-around align-items-center py-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="text-center text-dark text-decoration-none"
        :class="{ active: $route.path === item.path }"
      >
        <svg class="bi mb-1" width="24" height="24">
          <use :xlink:href="item.icon" />
        </svg>
        <div style="font-size: 12px;">{{ item.label }}</div>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
const navItems = [
  { label: 'Заказы', path: '/orders', icon: '#table' },
  { label: 'Сотрудники', path: '/users', icon: '#people-circle' },
  { label: 'Запросы', path: '/requests', icon: '#requests' }
];
</script>

<style scoped>
.mobile-bottom-nav {
  height: 56px;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  z-index: 1030;
}

.mobile-bottom-nav .active {
  color: #0d6efd !important;
}
</style>

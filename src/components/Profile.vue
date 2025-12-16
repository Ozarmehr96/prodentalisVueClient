<template>
  <div class="min-vh-100">
    <!-- Header -->

    <!-- Content -->
    <main class="">
      <div class="card mb-3 shadow-lg border-0">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <img
                v-if="employee.avatar_url"
                :src="employee.avatar_url"
                class="rounded-circle object-fit-cover"
                style="width: 64px; height: 64px"
                alt="Avatar"
              />
              <svg
                v-else
                class="rounded-circle"
                style="width: 64px; height: 64px"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="50" fill="#0d6efd" />
                <circle cx="50" cy="40" r="15" fill="white" />
                <path d="M25 75 Q50 55 75 75 V100 H25 Z" fill="white" />
              </svg>
            </div>

            <!-- Info -->
            <div>
              <h5 class="mb-1">{{ employee.full_name }}</h5>
              <span class="badge bg-success">{{ employee.role_title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Earnings -->
      <div class="card mb-3 shadow-lg border-0">
        <div class="card-body">
          <h5 class="mb-3">Заработок</h5>

          <!-- Period selector -->
          <div class="btn-group w-100 mb-4">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="selectedPeriod = period.value"
              class="btn btn-outline-secondary"
              :class="{ active: selectedPeriod === period.value }"
            >
              {{ period.label }}
            </button>
          </div>

          <!-- Amount -->
          <div class="bg-success bg-opacity-10 rounded p-4 text-center">
            <div class="text-success small mb-1">
              {{ currentPeriodLabel }}
            </div>
            <div class="fs-2 fw-bold text-success">
              {{ formatCurrency(currentEarnings) }}
            </div>
          </div>

          <!-- Custom period -->
          <button
            v-if="selectedPeriod === 'custom'"
            class="btn btn-outline-secondary w-100 mt-3"
          >
            Выбрать даты
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="card shadow-lg border-0 mb-3">
        <div class="card-body">
          <h5 class="mb-3">Статистика</h5>

          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Выполнено задач</span>
            <strong>{{ statistics.completedOrders }}</strong>
          </div>

          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Средний чек</span>
            <strong>{{ formatCurrency(statistics.averageCheck) }}</strong>
          </div>

          <div class="d-flex justify-content-between">
            <span class="text-muted">Рейтинг качества</span>
            <strong>{{ statistics.rating }} ⭐</strong>
          </div>
        </div>
      </div>

      <!-- Profile info -->
      <div class="card mb-3 shadow-lg border-0">
        <div class="card-body">
          <!-- Additional roles -->
          <div v-if="userRoles.length" class="mb-3">
            <small class="text-muted d-block mb-1">Дополнительные роли</small>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="role in userRoles" :key="role" class="badge bg-secondary">
                {{ role }}
              </span>
            </div>
          </div>

          <!-- Phone -->
          <div class="mb-2">
            <small class="text-muted d-block">Телефон</small>
            <div>+992 {{ formatPhoneNumber(employee.phone_number) }}</div>
          </div>

          <!-- Login -->
          <div class="mb-2">
            <small class="text-muted d-block">Логин</small>
            <div>{{ employee.login }}</div>
          </div>

          <!-- Birth date -->
          <div class="mb-3">
            <small class="text-muted d-block">Дата рождения</small>
            <div>{{ formatDate(employee.date_birth) }}</div>
          </div>

          <hr />

          <!-- App version -->
          <div class="d-flex justify-content-between text-muted small">
            <span>Версия приложения</span>
            <span>v{{ version }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { CURRENT_USER, LOAD_ROLES, ROLES } from "../store/types";

export default {
  name: "EmployeeProfile",
  data() {
    return {
      version: "1.0.0", // версия приложения
      selectedPeriod: "today", // выбранный период дохода
      defaultAvatar: null, // если понадобится заглушка
      periods: [
        { value: "today", label: "Сегодня" },
        { value: "week", label: "Неделя" },
        { value: "month", label: "Месяц" },
        { value: "custom", label: "Период" },
      ],

      // временно, позже подтянешь с API
      earnings: {
        today: 450,
        week: 2100,
        month: 8300,
        custom: 10000,
      },

      statistics: {
        completedOrders: 24,
        averageCheck: 11875,
        rating: 4.8,
      },
    };
  },

  async beforeMount() {
    // Загружаем справочник ролей
    await this.loadRoles();
  },

  computed: {
    ...mapGetters({
      employee: CURRENT_USER, // текущий пользователь
      roles: ROLES, // все роли системы
    }),

    /**
     * Основная роль (если понадобится отдельно)
     */
    mainRole() {
      if (!this.employee || !this.roles.length) return null;

      return this.roles.find((r) => this.employee.roles.includes(r.id));
    },

    /**
     * Все роли пользователя (человеческие названия)
     */
    userRoles() {
      if (!this.employee || !this.roles.length) return [];

      return this.roles
        .filter((role) => this.employee.roles.includes(role.id))
        .map((role) => role.name);
    },

    /**
     * Текущий период (label)
     */
    currentPeriodLabel() {
      const period = this.periods.find((p) => p.value === this.selectedPeriod);
      return period ? period.label : "Сегодня";
    },

    /**
     * Доход за выбранный период
     */
    currentEarnings() {
      return this.earnings[this.selectedPeriod] || 0;
    },
  },

  methods: {
    ...mapActions({
      loadRoles: LOAD_ROLES,
    }),

    // Формат денег
    formatCurrency(amount) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "TJS",
        minimumFractionDigits: 0,
      }).format(amount);
    },

    // Формат телефона
    formatPhoneNumber(phone) {
      if (!phone) return "";
      const cleaned = phone.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
      return match ? `${match[1]} ${match[2]} ${match[3]} ${match[4]}` : phone;
    },

    // Формат даты
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

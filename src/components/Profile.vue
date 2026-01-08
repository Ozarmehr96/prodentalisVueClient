<template>
  <div class="min-vh-100">
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

      <!-- Заработок -->
      <div class="card mb-3 shadow-lg border-0">
        <div class="card-body">
          <h5 class="mb-3">Заработок</h5>

          <Spinner v-show="isStatsLoading" />
          <div v-show="!isStatsLoading">
            <!-- Period selector -->
            <div class="btn-group w-100 mb-4">
              <button
                v-for="period in periods"
                :key="period.value"
                @click="loadUserStat(period.value)"
                class="btn btn-outline-secondary"
                :class="{ active: selectedPeriod === period.value }"
              >
                {{ period.label }}
              </button>
            </div>

            <!-- Сумма заработка -->
            <div class="bg-success bg-opacity-10 rounded p-4 text-center">
              <div class="text-success small mb-1">
                {{ currentPeriodLabel }}
              </div>
              <div class="fs-2 fw-bold text-success">
                {{ formatCurrency(userStat.money) }}
              </div>
            </div>

            <!-- Custom period -->
            <div
              v-if="selectedPeriod === 'period'"
              class="d-flex align-items-end gap-3 flex-wrap mt-2"
            >
              <!-- Дата от -->
              <div class="flex-grow-1 flex-md-grow-0">
                <!-- flex-grow-1 заставит поле растянуться на мобильных -->
                <input
                  type="date"
                  id="created_from"
                  placeholder="дд.мм.гггг"
                  class="form-control form-control-sm w-100"
                  v-model="created_from"
                  @change="applyFilter"
                />
              </div>

              <!-- Разделитель всегда по центру по вертикали -->
              <span class="align-self-center text-nowrap pb-1">—</span>
              <!-- Я заменил обычный "-" на более красивый "—" (em dash) -->

              <!-- Дата до -->
              <div class="flex-grow-1 flex-md-grow-0">
                <input
                  type="date"
                  id="created_to"
                  placeholder="дд.мм.гггг"
                  class="form-control form-control-sm w-100"
                  v-model="created_to"
                  @change="applyFilter"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- UserStat -->
      <div class="card shadow-lg border-0 mb-3">
        <div class="card-body">
          <h5 class="mb-3">Статистика</h5>
          <Spinner v-show="isStatsLoading" />
          <div v-show="!isStatsLoading">
            <div
              class="d-flex justify-content-between mb-2 clickable-link"
              @click="viewUserTasks"
            >
              <span class="clickable-link">Выполнено задач</span>
              <strong>{{ totalTasksCompleted }}</strong>
            </div>

            <div class="d-flex justify-content-between">
              <span class="text-muted">Затраченное время</span>
              <strong>{{ totalElapsedTime }}</strong>
            </div>
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
            <div>{{ formatPhoneNumber(employee.phone_number) }}</div>
          </div>

          <!-- Login -->
          <div class="mb-2">
            <small class="text-muted d-block">Логин</small>
            <div>{{ employee.login }}</div>
          </div>

          <!-- Birth date -->
          <div class="mb-3">
            <small class="text-muted d-block">Дата рождения</small>
            <div>{{ $toDateFormat(employee.date_birth) }}</div>
          </div>

          <hr />

          <!-- App version -->
          <div class="d-flex justify-content-between text-muted small">
            <span>Версия приложения</span>
            <span>v{{ appVersion }}</span>
          </div>
        </div>
      </div>

      <div class="mb-3 border-0">
        <!-- Кнопка загрузки -->
        <div class="col-12 text-center py-2">
          <button class="btn btn-outline-danger w-100" @click="() => logOut()">
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  CURRENT_USER,
  IS_STATS_LOADING,
  LOAD_ROLES,
  LOAD_USER_STAT,
  LOGOUT,
  ORDER_TASK_FILTERS,
  RESET_ORDER_TASK_FILTERS,
  ROLES,
  SET_ORDER_TASK_FILTERS,
  USER_STAT,
} from "../store/types";
import { getDataFromType } from "../helpers/order-helpers";
import Spinner from "./Spinner.vue";

export default {
  name: "EmployeeProfile",
  components: {
    Spinner,
  },
  data() {
    return {
      appVersion: __APP_VERSION__, // версия приложения
      selectedPeriod: "today", // выбранный период дохода
      defaultAvatar: null, // если понадобится заглушка
      created_from: "",
      created_to: "",
      periods: [
        { value: "today", label: "Сегодня" },
        { value: "week", label: "Неделя" },
        { value: "month", label: "Месяц" },
        { value: "period", label: "Период" },
      ],
    };
  },

  async beforeMount() {
    // Загружаем статистику за сегодня
    await this.loadUserStat("today");

    // Загружаем справочник ролей
    await this.loadRoles();
  },

  computed: {
    ...mapGetters({
      employee: CURRENT_USER, // текущий пользователь
      roles: ROLES, // все роли системы
      isStatsLoading: IS_STATS_LOADING, // загрузка статистики
      userStat: USER_STAT, // статистика пользователя
      orderTaskFilters: ORDER_TASK_FILTERS,
    }),

    /**
     * Общее затраченное время
     */
    totalElapsedTime() {
      if (this.selectedPeriod === "period") {
        if (!this.created_from || !this.created_to) return "-";
      }

      return this.formatTime(this.userStat.total_elapsed_time);
    },

    /**
     * Общее количество выполненных задач
     */
    totalTasksCompleted() {
      if (this.selectedPeriod === "period") {
        if (!this.created_from || !this.created_to) return "-";
      }

      return this.userStat.total_tasks_completed;
    },

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
  },

  methods: {
    ...mapActions({
      loadRoles: LOAD_ROLES,
      loadUserStatAction: LOAD_USER_STAT,
      logOut: LOGOUT,
      resetOrderTaskFilters: RESET_ORDER_TASK_FILTERS,
      setOrderTaskFilters: SET_ORDER_TASK_FILTERS,
    }),

    // Формат денег
    formatCurrency(amount) {
      if (this.selectedPeriod === "period") {
        if (!this.created_from || !this.created_to) return "-";
      }

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

    async loadUserStat(dataType) {
      this.selectedPeriod = dataType;
      console.log("[STAT] Загружается статистика за:", dataType);
      if (dataType === "period") return; // для периода ждем выбора дат
      const period = getDataFromType(dataType);
      await this.loadUserStatAction({
        created_from: period.from,
        created_to: period.to,
      });
    },
    applyFilter() {
      if (this.selectedPeriod !== "period") return;
      if (!this.created_from || !this.created_to) return;

      this.loadUserStatAction({
        created_from: this.created_from,
        created_to: this.created_to,
      });
    },

    formatTime(value) {
      // Если 0, null, undefined, пусто
      if (!value || value === "0") return "00:00:00";

      // Если строка с миллисекундами
      if (typeof value === "string" && value.includes(".")) {
        return value.split(".")[0];
      }

      return value; // если уже HH:mm:ss
    },

    async viewUserTasks() {
      const period = getDataFromType(this.selectedPeriod);
      if (this.selectedPeriod == "period") {
        if (!this.created_from || !this.created_to) {
          alert("Сначала выберите период");
          return;
        } else {
          period.from = this.created_from;
          period.to = this.created_to;
        }
      }

      await this.resetOrderTaskFilters();
      setTimeout(() => {
        this.setOrderTaskFilters({
          ...this.orderTaskFilters,
          finished_at: period.from,
          finished_to: period.to,
          isForUserStats: true,
          by_executor_id: this.employee.id,
          status: "Finished",
        });
        this.$router.push("/tasks");
      }, 300);
    },
  },
};
</script>
<style scoped>
/* Кликабельный блок как ссылка */
.clickable-link {
  cursor: pointer; /* курсор как у ссылки */
  color: #0d6efd; /* bootstrap primary */
}

.clickable-link:hover {
  text-decoration: underline; /* эффект ссылки */
}
</style>

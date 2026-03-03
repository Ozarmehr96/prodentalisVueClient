<template>
  <app-page
    title="Статистика зарплаты сотрудников"
    @onAddButtonClickEvent="openModal(null)"
    :showBackButton="true"
  >
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label for="userFilter" class="form-label">Сотрудник</label>
            <select
              id="userFilter"
              class="form-control"
              v-model="filters.user_id"
              @change="applyFilters"
            >
              <option value="">Все сотрудники</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.full_name }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-3">
            <label for="date_from" class="form-label">Дата от</label>
            <input
              type="date"
              class="form-control"
              id="date_from"
              v-model="filters.date_from"
              @change="applyFilters"
            />
          </div>

          <div class="col-12 col-md-3">
            <label for="date_to" class="form-label">Дата до</label>
            <input
              type="date"
              class="form-control"
              id="date_to"
              v-model="filters.date_to"
              @change="applyFilters"
            />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>

    <Spinner v-if="isLoading" style="margin-left: 50%; position: none; left: 0" />

    <div class="table-responsive" v-if="!isLoading">
      <table
        class="table table-bordered border-primary align-middle text-center table-hover"
      >
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Начислено</th>
            <th>Выплачено</th>
            <th>Сумма к выплате</th>
            <th>Тип оплаты труда</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in usersSalaryStats" :key="item.id">
            <td class="text-start">{{ item.user.full_name }}</td>
            <td>{{ formatAmount(item.tasks_total_price) }}</td>
            <td>{{ formatAmount(item.paid) }}</td>
            <td>{{ formatAmount(item.to_be_paid) }}</td>
            <td>{{ item?.user?.salary_type?.name || "—" }}</td>
          </tr>

          <tr v-if="!usersSalaryStats || usersSalaryStats.length === 0">
            <td :colspan="5" class="text-muted py-3">
              Нет данных. Попробуйте изменить фильтр.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import {
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  IS_LAB_ADMIN,
  LOAD_USERS_SALARY_STATS,
  USERS_SALARY_STATS,
  IS_SALARY_PAYMENT_JOURNALS_LOADING,
} from "../../../store/types";
import { getDefaultPeriod } from "../../../helpers/timeHelpers";
import Spinner from "../../../components/Spinner.vue";

export default {
  components: {
    AppPage,
    Spinner,
  },
  data() {
    return {
      filters: {
        user_id: "",
        date_from: "",
        date_to: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isAdmin: IS_LAB_ADMIN,
      usersSalaryStats: USERS_SALARY_STATS,
      isLoading: IS_SALARY_PAYMENT_JOURNALS_LOADING,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin || this.isAdmin;
    },
  },
  async beforeMount() {
    this.setDefaultPeriod();
    this.usersSalaryStats.length = [];
    await this.loadItems();
  },
  methods: {
    ...mapActions({
      loadUsersSalaryStats: LOAD_USERS_SALARY_STATS,
    }),
    setDefaultPeriod() {
      let defaultPeriod = getDefaultPeriod();
      this.filters.date_from = defaultPeriod.date_from;
      this.filters.date_to = defaultPeriod.date_to;
    },
    async loadItems() {
      await this.loadUsersSalaryStats(this.filters);
    },
    applyFilters() {
      this.loadItems();
    },
    clearFilters() {
      this.filters = {
        user_id: "",
        date_from: "",
        date_to: "",
      };
      this.setDefaultPeriod();
      this.loadItems();
    },
    formatAmount(amount) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "TJS",
        minimumFractionDigits: 0,
      }).format(amount);
    },
  },
};
</script>

<style scoped>
.table tbody tr:hover {
  background-color: #f8f9fa;
}
</style>

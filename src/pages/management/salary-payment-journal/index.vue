<template>
  <app-page
    title="Журнал выплат зарплаты сотрудникам"
    @onAddButtonClickEvent="openModal(null)"
    :showBackButton="true"
  >
    <template v-slot:headerline>
      <button
        class="btn position-absolute top-3 end-3 d-flex align-items-center me-3 brand-style"
        @click="openModal(null)"
        style="gap: 5px; right: 0px !important; color: white"
      >
        Создать выплату
      </button>
    </template>

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
            <label for="date_from" class="form-label">Дата выплаты от</label>
            <input
              type="date"
              class="form-control"
              id="date_from"
              v-model="filters.date_from"
              @change="applyFilters"
            />
          </div>

          <div class="col-12 col-md-3">
            <label for="date_to" class="form-label">Дата выплаты до</label>
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

    <div class="table-responsive">
      <table
        class="table table-bordered border-primary align-middle text-center table-hover"
      >
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Сумма</th>
            <th>Тип выплаты</th>
            <th>Период</th>
            <th>Комментарий</th>
            <th>Создал</th>
            <th>Дата создания</th>
            <th v-if="canControl">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in salaryJournals"
            :key="item.id"
            @click="() => openModal(item)"
            style="cursor: pointer"
          >
            <td>{{ item.user_name }}</td>
            <td>{{ formatAmount(item.amount) }}</td>
            <td>{{ item?.salary_payment_type?.name || "—" }}</td>
            <td>
              {{ $toDateFormat(item.period_start) }} -
              {{ $toDateFormat(item.period_end) }}
            </td>
            <td>{{ item.comment || "—" }}</td>
            <td>{{ item.created_by_name || "—" }}</td>
            <td>{{ $toDateTimeFormat(item.created_at) }}</td>
            <td v-if="canControl" @click.stop>
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm btn-warning" @click="() => openModal(item)">
                  Редактировать
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)">
                  Удалить
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!salaryJournals || salaryJournals.length === 0">
            <td :colspan="canControl ? 7 : 6" class="text-muted py-3">
              Нет данных. Попробуйте изменить фильтр.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <SalaryJournalModal
      v-model:show="showModal"
      :item="selectedItem"
      :isEdit="selectedItem !== null"
      @saved="applyFilters"
    />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";
import {
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  IS_LAB_ADMIN,
  LOAD_SALARY_PAYMENT_JOURNALS,
  DELETE_SALARY_PAYMENT_JOURNAL,
  SALARY_PAYMENT_JOURNALS,
} from "../../../store/types";
import SalaryJournalModal from "../../../components/costing/salary-payment-journal/SalaryJournalModal.vue";

export default {
  components: {
    AppPage,
    SalaryJournalModal,
  },
  data() {
    return {
      showModal: false,
      selectedItem: null,
      users: [],
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
      salaryJournals: SALARY_PAYMENT_JOURNALS,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin || this.isAdmin;
    },
  },
  async beforeMount() {
    await this.loadItems();
  },
  methods: {
    ...mapActions({
      loadSalaryJournals: LOAD_SALARY_PAYMENT_JOURNALS,
      deleteSalary: DELETE_SALARY_PAYMENT_JOURNAL,
    }),
    async loadItems() {
      await this.loadSalaryJournals(this.filters);
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
      this.loadItems();
    },
    formatAmount(amount) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "TJS",
        minimumFractionDigits: 0,
      }).format(amount);
    },
    openModal(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    deleteItem(id) {
      if (!confirm("Вы уверены, что хотите удалить выплату?")) {
        return;
      }

      this.deleteSalary({
        id,
        callback: () => {
          this.$toast("Выплата успешно удалена");
          this.loadItems();
        },
      });
    },
  },
};
</script>

<style scoped>
.table tbody tr:hover {
  background-color: #f8f9fa;
}
</style>

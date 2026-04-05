<template>
  <app-page
    title="Расходные материалы"
    @onAddButtonClickEvent="openModal(null)"
    :showBackButton="true"
    v-if="canControl"
  >
    <template v-slot:headerline>
      <button
        class="btn position-absolute top-3 end-3 d-flex align-items-center me-3 brand-style"
        @click="openModal(null)"
        style="gap: 5px; right: 0px !important; color: white"
      >
        Добавить закупку
      </button>
    </template>

    <FilterWizard
      :initialDateType="'month'"
      @onFilterChanged="onDateChanged"
      ref="filterWizard"
      dateTitle="Период закупки"
    />

    <div class="row g-3 mb-3">
      <div class="col-12 col-sm">
        <div class="card metric-card bg-gradient-orange">
          <div class="card-body">
            <p class="mb-1 ostatokText" style="font-size: 14px">Сумма затрат за период</p>
            <h3 class="h4 fw-bold text-orange mb-1">
              {{ formatAmount(totalAmount) }} {{ currency }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <Spinner
      v-if="isLoading"
      style="position: initial; margin-left: 50%; margin-top: 12.5%"
    />

    <div class="table-responsive" v-if="!isLoading">
      <table
        class="table table-bordered border-primary align-middle text-center table-hover"
      >
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Куплено</th>
            <th>Сумма закупок</th>
            <th>Средняя цена, ед.</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item.id" style="cursor: pointer">
            <!-- Материал -->
            <td>
              {{ item.material_name || "—" }}
            </td>

            <!-- Количество -->
            <td>
              {{ item.quantity || "—" }}
              <small class="text-muted">{{ item.unit }}</small>
            </td>

            <!-- Итог -->
            <td>
              {{ formatAmount(item.total_amount) }}
            </td>

            <!-- Цена за единицу -->
            <td>
              {{ formatAmount(item.price) }}
            </td>
          </tr>

          <!-- Нет данных -->
          <tr v-if="!items || items.length === 0">
            <td :colspan="4" class="text-muted py-3">
              Нет данных. Попробуйте изменить фильтр.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PurchaseJournalModal
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
import Spinner from "../../../components/Spinner.vue";
import PurchaseJournalModal from "../../../components/costing/purchase-journal/PurchaseJournalModal.vue";
import FilterWizard from "../../../components/costing/FilterWizard.vue";
import {
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  IS_LAB_ADMIN,
  DELETE_PURCHASE_JOURNAL,
  IS_PURCHASE_JOURNALS_LOADING,
  CURRENCY,
  LOAD_MATERIALS_PURCHASES_SUMMARY,
} from "../../../store/types";
import { formatMoney } from "../../../helpers/order-helpers";

export default {
  components: {
    AppPage,
    Spinner,
    PurchaseJournalModal,
    FilterWizard,
  },
  data() {
    return {
      showModal: false,
      items: [],
      selectedItem: null,
      filters: {
        date_from: "",
        date_to: "",
      },
      totalAmount: 0,
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isAdmin: IS_LAB_ADMIN,
      isLoading: IS_PURCHASE_JOURNALS_LOADING,
      currency: CURRENCY,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin || this.isAdmin;
    },
  },
  async beforeMount() {
    // await this.loadItems(); // 🔥 убрал, чтобы не дергать API без необходимости. Данные загрузятся при выборе периода в фильтре
  },
  methods: {
    ...mapActions({
      loadMaterialsPurchasesSummary: LOAD_MATERIALS_PURCHASES_SUMMARY,
      deletePurchase: DELETE_PURCHASE_JOURNAL,
    }),
    async loadItems() {
      this.totalAmount = 0;
      this.items = []; // Очищаем список перед загрузкой новых данных
      this.items = await this.loadMaterialsPurchasesSummary(this.filters);
      this.calcTotalAmount();
    },
    calcTotalAmount() {
      this.totalAmount = (this.items || []).reduce(
        (acc, item) => acc + (Number(item.total_amount) || 0),
        0
      );
    },
    applyFilters() {
      this.loadItems();
    },
    clearFilters() {
      this.filters = {
        date_from: "",
        date_to: "",
      };
      // 🔥 дергаем метод дочернего компонента
      this.$refs.filterWizard.setDateType("month");
      // this.loadItems();
    },
    formatAmount(amount) {
      return formatMoney(amount);
    },
    openModal(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    onDateChanged(period) {
      this.filters.date_from = period.date_from;
      this.filters.date_to = period.date_to;
      this.applyFilters();
    },
  },
};
</script>

<style scoped>
.table tbody tr:hover {
  background-color: #f8f9fa;
}
.card-body {
  padding: 10px;
  padding-left: 14px;
}
.metric-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}
.bg-gradient-orange {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-left: 4px solid #ff9800;
}
.text-orange {
  color: #7e2a0c;
}
.ostatokText {
  color: #d95900;
}
</style>

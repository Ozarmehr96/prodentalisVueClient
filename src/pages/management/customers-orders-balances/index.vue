<template>
  <app-page title="Оплаты и задолженности" :showBackButton="true" v-if="canControl">
    <!-- Фильтры -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-3">
            <label for="floatingInput" class="form-label">Заказчик</label>
            <input
              type="text"
              :readonly="true"
              class="form-control"
              id="floatingInput"
              :value="filters.customer?.full_name"
              @click="showCustomerCanvas = true"
            />
            <SelectCustomersWizard
              v-model:visible="showCustomerCanvas"
              @select-customer="onCustomerSelected"
              :isAddAllButton="true"
            />
          </div>

          <!-- ID заказа -->
          <div class="col-12 col-sm-auto">
            <label for="number" class="form-label small">Номер заказа</label>
            <input
              type="number"
              id="number"
              class="form-control"
              v-model="filters.number"
              placeholder="№"
              @input="applyFilters"
            />
          </div>
          <div class="col-12 col-md-3" style="width: auto">
            <label for="created_from" class="form-label"
              >Дата создания ({{ $toDateFormat(filters.created_from) }} -
              {{ $toDateFormat(filters.created_to) }})</label
            >
            <DateFilter ref="dateFilter" @onDateChanged="onDateChanged" />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-3">
      <!-- Общая сумма -->
      <div class="col-12 col-sm">
        <div class="card metric-card bg-gradient-green">
          <div class="card-body">
            <div class=""></div>
            <p class="mb-1 summaText" style="font-size: 14px">Общая сумма</p>
            <h3 class="h4 fw-bold text-success mb-1">
              {{ formatMoney(summa) }} {{ currency }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Оплачено -->
      <div class="col-12 col-sm">
        <div class="card metric-card bg-gradient-blue">
          <div class="card-body">
            <div class="bg-success"></div>
            <p class="mb-1 oplachenoText" style="font-size: 14px">Оплачено</p>
            <h3 class="h4 fw-bold mb-1" style="color: #1c398e">
              {{ formatMoney(oplacheno) }} {{ currency }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Остаток -->
      <div class="col-12 col-sm">
        <div class="card metric-card bg-gradient-orange">
          <div class="card-body">
            <div class="text-orange"></div>
            <p class="mb-1 ostatokText" style="font-size: 14px">Остаток</p>
            <h3 class="h4 fw-bold text-orange mb-1">
              {{ formatMoney(ostatok) }} {{ currency }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Остаток -->
      <div class="col-12 col-sm">
        <div class="card metric-card bg-gradient-gray">
          <div class="card-body">
            <div class="text-orange"></div>
            <p class="mb-1 text-white" style="font-size: 14px">Количетсво заказов</p>
            <h3 class="h4 fw-bold text-white mb-1">
              {{ orderCount }}
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
            <th>№ заказа</th>
            <th>Заказчик</th>
            <th>Кол. зубов</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Сумма заказа</th>
            <th>Оплачено</th>
            <th>Остаток</th>
            <th v-if="canControl">Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" style="cursor: pointer">
            <td @click="() => $router.push(`/orders/view/${item.order_id}`)">
              <span
                class="text-primary"
                title="Нажмите для просмотра иныормации по заказу"
                >{{ item.order_number }}</span
              >
            </td>
            <td>{{ item.customer_name }}</td>
            <td>{{ item.teeth_count }}</td>
            <td>{{ item.status }}</td>
            <td>{{ $toDateTimeFormat(item.created_at) }}</td>
            <td>{{ formatMoney(item.price_for_customer) }}</td>
            <td>{{ formatMoney(item.amount_paid) }}</td>
            <td :class="{ 'bg-gradient-orange': item.ostatok > 0 }">
              {{ formatMoney(item.ostatok) }}
            </td>

            <td>
              <div
                v-if="canControl && Number(item.ostatok) > 0"
                @click.stop
                class="d-flex justify-content-center gap-2"
              >
                <button class="btn btn-sm btn-warning" @click="() => openModal(item)">
                  Внести платёж
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!items || items.length === 0">
            <td colspan="9" class="text-muted py-3">
              Нет данных. Попробуйте изменить фильтр.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaymentJournalModal
      v-model:show="showModal"
      :payment="selectedOrder"
      :isEdit="false"
      :isOrderPay="true"
      @reloadJournal="updateOrderOstatok"
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
  CURRENCY,
  LOAD_CUSTOMERS_ORDERS_BALANCES,
} from "../../../store/types";
import PaymentJournalModal from "../../../components/costing/payment-journal/PaymentJournalModal.vue";
import Spinner from "../../../components/Spinner.vue";
import SelectCustomersWizard from "../../../components/customers/SelectCustomersWizard.vue";
import DateFilter from "../../../components/DateFilter.vue";

export default {
  components: {
    AppPage,
    PaymentJournalModal,
    Spinner,
    SelectCustomersWizard,
    DateFilter,
  },
  data() {
    return {
      showModal: false,
      isLoading: false,
      selectedOrder: null,
      showCustomerCanvas: false,
      items: [],
      users: [],
      filters: {
        user_id: "",
        created_from: "",
        created_to: "",
        number: "",
        customer: {
          id: null,
          full_name: "Все заказчики",
        },
      },
      summa: 0,
      oplacheno: 0,
      ostatok: 0,
      orderCount: 0,
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isAdmin: IS_LAB_ADMIN,
      currency: CURRENCY,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin || this.isAdmin;
    },
  },
  async beforeMount() {
    // await this.loadItems(); - не нужно здесь вызывать, так как фильтр по дате "сегодня" вызывается автоматически.
  },
  methods: {
    ...mapActions({
      loadCustomersOrdersBalances: LOAD_CUSTOMERS_ORDERS_BALANCES,
    }),

    setInfoZero() {
      this.summa = 0;
      this.orderCount = 0;
      this.oplacheno = 0;
      this.ostatok = 0;
    },
    getInfo() {
      this.setInfoZero();

      this.items.forEach((i) => {
        this.summa += i.price_for_customer || 0;
        this.oplacheno += i.amount_paid || 0;
        this.ostatok += i.ostatok || 0;
      });

      this.orderCount = this.items.length;
    },

    formatMoney(value) {
      if (value == null) return "-";

      // Обрезаем без округления
      let truncated =
        value >= 0 ? Math.floor(value * 10000) / 10000 : Math.ceil(value * 10000) / 10000;

      // Проверяем: есть ли дробная часть
      let hasDecimal = truncated % 1 !== 0;

      // Формируем строку
      let str = hasDecimal
        ? truncated.toFixed(4) // показываем 4 знака
        : truncated.toString(); // просто число

      let parts = str.split(".");

      // Форматируем тысячи
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      return parts.join(".");
    },

    async loadItems() {
      this.isLoading = true;
      this.setInfoZero();
      this.filters.customer_id = this.filters?.customer?.id;
      if (this.filters?.customer) {
        this.filters.customer = {
          id: this.filters?.customer?.id,
          full_name: this.filters?.customer?.full_name,
        };
      }

      let params = {
        ...this.filters,
        callback: () => {
          this.isLoading = false;
        },
      };
      this.items = await this.loadCustomersOrdersBalances(params);
      this.getInfo();
      this.isLoading = false;
    },
    applyFilters() {
      this.loadItems();
    },
    clearFilters() {
      this.filters = {
        user_id: "",
        created_from: "",
        created_to: "",
        customer: {
          id: null,
          full_name: "Все заказчики",
        },
      };
      // 🔥 дергаем метод дочернего компонента
      this.$refs.dateFilter.setDateType("today");
      // this.loadItems();
    },
    openModal(item) {
      this.selectedOrder = item;
      this.showModal = true;
    },
    updateOrderOstatok(payment) {
      // Ищем нужный заказ по ID
      let order = this.items.find((t) => t.order_id === payment.order_id);

      if (order) {
        // Обновляем оплачено
        order.amount_paid += payment.amount;

        // Обновляем остаток
        order.ostatok -= payment.amount;
        this.getInfo();
      }
    },
    onCustomerSelected(customer) {
      this.filters.customer = customer;
      this.filters.customer_id = customer.id;
      this.applyFilters();
    },
    onDateChanged(period) {
      this.filters.created_from = period.date_from;
      this.filters.created_to = period.date_to;
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

.bg-gradient-green {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-left: 4px solid #4caf50;
}
.bg-gradient-orange {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-left: 4px solid #ff9800;
}
.bg-gradient-gray {
  background: linear-gradient(135deg, #6c757d, #343a40); /* серый → тёмно-серый */
  color: white; /* чтобы текст был виден */
}
.text-orange {
  color: #7e2a0c;
}
.bg-gradient-blue {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196f3;
}
/* Можно дополнительно подчеркнуть, чтобы выглядело как ссылка */
.text-primary {
  text-decoration: underline;
}
.oplachenoText {
  color: #1447e6;
}
.ostatokText {
  color: #d95900;
}
.summaText {
  color: #008236;
}
.redOstatok {
  background-color: #d95900;
}
</style>

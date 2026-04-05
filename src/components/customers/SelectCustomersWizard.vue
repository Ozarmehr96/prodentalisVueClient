<template>
  <div :class="showLabel ? 'form-floating' : ''">
    <input
      :disabled="disabled"
      type="text"
      :readonly="true"
      class="form-control form-floating"
      id="floatingInput"
      :value="val"
      @click="
        () => {
          this.bsOffcanvas.show();
        }
      "
    />
    <label v-if="showLabel" for="floatingInput" class="form-label">Заказчик</label>
    <div class="invalid-feedback">Выберите заказчика</div>
    <div class="offcanvas offcanvas-start" tabindex="-1" ref="offcanvasRef">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Выбор заказчика</h5>
        <button type="button" class="btn-close" @click="closeOffcanvas"></button>
      </div>
      <button
        type="button"
        class="btn btn-primary me-3 ms-3 brand-style"
        @click="showCustomerModal = true"
      >
        Добавить нового заказчика
      </button>

      <div class="offcanvas-body">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Поиск заказчика..."
          v-model="searchQuery"
        />

        <div class="list-group">
          <button
            v-for="customer in filteredCustomers"
            :key="customer.id"
            type="button"
            class="list-group-item list-group-item-action"
            @click="selectCustomer(customer)"
          >
            <div class="fw-bold" style="color: black">{{ customer.full_name }}</div>
            <small class="text-muted">{{ customer.phone }}</small>
          </button>

          <div v-if="filteredCustomers.length === 0" class="text-muted mt-2">
            Заказчики не найдены
          </div>
        </div>
      </div>

      <CustomerModal v-model:show="showCustomerModal" />
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";
import { mapGetters, mapActions } from "vuex";
import { CUSTOMER, CUSTOMERS, LOAD_CUSTOMERS, SET_CUSTOMER } from "../../store/types";
import CustomerModal from "./CustomerModal.vue";
import AddButton from "../AddButton.vue";

export default {
  components: {
    AddButton,
    CustomerModal,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isGetLastSelected: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    defaultVal: {
      type: [String, null],
      default: null,
    },
    selectedCustomerId: {
      type: [String, null],
      default: null,
    },

    isAddAllButton: false,
    disabled: false,
  },
  data() {
    return {
      searchQuery: "",
      bsOffcanvas: null,
      showCustomerModal: false,
      selectedCustomer: null,
    };
  },
  computed: {
    ...mapGetters({
      customers: CUSTOMERS,
      customer: CUSTOMER,
    }),
    val() {
      if (this.defaultVal) {
        return this.defaultVal;
      }

      if (this.isGetLastSelected && this.customer) {
        return this.customer.full_name;
      }

      let fio = this.selectedCustomer?.full_name;
      if (fio && this.selectedCustomer?.phone) {
        return `${fio} (${this.selectedCustomer.phone})`;
      }

      if (!fio && this.isAddAllButton) {
        return "Все заказчики";
      }
      return fio;
    },
    filteredCustomers() {
      let customers = [];

      if (this.isAddAllButton) {
        customers.push({
          id: null,
          full_name: "Все заказчики",
        });
      }

      const filtered = this.customers
        .filter(
          (c) =>
            (c.full_name &&
              c.full_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
            (c.phone && c.phone.includes(this.searchQuery))
        )
        .sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));

      return [...customers, ...filtered];
    },
  },
  watch: {
    visible(val) {
      if (!this.bsOffcanvas) return;
      if (val) {
        this.bsOffcanvas.show();
      }
      // не закрываем через watch, закрытие отслеживаем через событие Bootstrap
    },
  },
  async mounted() {
    if (this.customers.length == 0) {
      await this.loadCustomers();
    }

    if (this.selectedCustomerId) {
      const customer = this.customers.find((c) => c.id === this.selectedCustomerId);
      if (customer) {
        this.selectedCustomer = customer;
      }
    }
    this.bsOffcanvas = new bootstrap.Offcanvas(this.$refs.offcanvasRef);

    // Подписка на событие закрытия offcanvas
    this.$refs.offcanvasRef.addEventListener("hide.bs.offcanvas", () => {
      this.$emit("update:visible", false);
    });

    // Подписка на событие открытия offcanvas
    this.$refs.offcanvasRef.addEventListener("show.bs.offcanvas", () => {
      this.$emit("update:visible", true);
    });

    // Если при монтировании visible=true
    if (this.visible) this.bsOffcanvas.show();
  },
  methods: {
    ...mapActions({
      loadCustomers: LOAD_CUSTOMERS,
      setCustomer: SET_CUSTOMER,
    }),
    closeOffcanvas() {
      this.bsOffcanvas.hide();
    },
    reset() {
      this.selectedCustomer = null;
      this.setCustomer(null);
    },
    selectCustomer(customer) {
      this.selectedCustomer = customer;
      this.$emit("select-customer", customer);
      this.setCustomer(customer);
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

<template>
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
  },
  data() {
    return {
      searchQuery: "",
      bsOffcanvas: null,
      showCustomerModal: false,
    };
  },
  computed: {
    ...mapGetters({
      customers: CUSTOMERS,
      customer: CUSTOMER,
    }),
    filteredCustomers() {
      return this.customers
        .filter(
          (c) =>
            (c.full_name &&
              c.full_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
            (c.phone && c.phone.includes(this.searchQuery))
        )
        .sort((a, b) => a.full_name?.localeCompare(b.full_name));
    },
  },
  watch: {
    visible(val) {
      if (!this.bsOffcanvas) return;
      if (val) this.bsOffcanvas.show();
      // не закрываем через watch, закрытие отслеживаем через событие Bootstrap
    },
  },
  async mounted() {
    if (this.customers.length == 0) {
      await this.loadCustomers();
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
    selectCustomer(customer) {
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

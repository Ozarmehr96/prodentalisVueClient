<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content p-3 position-relative">
        <!-- Кнопка закрытия -->
        <button
          v-if="!isLoading"
          type="button"
          class="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          @click="close"
        ></button>

        <h5 class="mb-3">
          {{ isEdit ? "Редактирование платежа" : "Добавление платежа" }}
        </h5>

        <form @submit.prevent="savePayment">
          <div class="row g-3">
            <!-- Заказчик -->
            <div class="col-12">
              <div class="form-floating">
                <input
                  type="text"
                  :disabled="isEdit"
                  :class="{ 'is-invalid': !isCustomerValid }"
                  :value="`${localPayment.customer_name} ${localPayment.customer_phone}`"
                  class="form-control"
                  id="floatingInput"
                  @click="showCustomerCanvas = true"
                  readonly
                />
                <label for="floatingInput">Заказчик</label>
                <div class="invalid-feedback">Выберите заказчика</div>
                <SelectCustomersWizard
                  v-model:visible="showCustomerCanvas"
                  @select-customer="onCustomerSelected"
                />
              </div>
            </div>

            <!-- Сумма -->
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-control"
                  :class="{ 'is-invalid': !isAmountValid }"
                  v-model.number="localPayment.amount"
                  placeholder="Сумма"
                  required
                />
                <div class="invalid-feedback">Сумма должна быть больше 0</div>
                <label for="amount">Сумма</label>
              </div>
            </div>

            <!-- Дата платежа -->
            <div class="col-12 col-md-6" title="Дата платежа влияет на отчеты">
              <div class="form-floating">
                <input
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': !isPaymentDateValid }"
                  v-model="localPayment.payment_date"
                  placeholder="Дата платежа"
                  required
                />
                <div class="invalid-feedback">Выберите дату платежа</div>
                <label for="paymentDate">Дата платежа</label>
              </div>
            </div>

            <!-- Комментарий -->
            <div class="col-12">
              <div class="form-floating">
                <textarea
                  class="form-control"
                  id="comment"
                  style="height: 100px"
                  v-model.trim="localPayment.comment"
                  placeholder="Комментарий"
                ></textarea>
                <label for="comment">Комментарий</label>
              </div>
            </div>

            <!-- Кнопка -->
            <div class="col-12 d-flex justify-content-end mt-2">
              <ButtonWithLoader
                type="submit"
                :isLoading="isLoading"
                title="Сохранить"
                loadingText=""
                :isValid="isValid"
                :customClasses="[
                  'btn',
                  isValid ? 'brand-style' : 'btn-outline-secondary',
                ]"
              />
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ButtonWithLoader from "../../ButtonWithLoader.vue";
import {
  IS_PAYMENT_JOURNALS_LOADING,
  SAVE_PAYMENT_JOURNAL,
  UPDATE_PAYMENT_JOURNAL,
  CUSTOMERS,
  LOAD_CUSTOMERS,
} from "../../../store/types";
import SelectCustomersWizard from "../../customers/SelectCustomersWizard.vue";

const emptyPayment = () => ({
  id: null,
  customer_id: "",
  customer_name: "",
  customer_phone: "",
  amount: 0,
  payment_date: "",
  comment: "",
});

export default {
  name: "PaymentJournalModal",
  components: {
    ButtonWithLoader,
    SelectCustomersWizard,
  },
  props: {
    payment: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    payment: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initLocalPayment();
      },
    },
    show: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initLocalPayment();
      },
    },
  },
  data() {
    return {
      localPayment: emptyPayment(),
      showCustomerCanvas: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: IS_PAYMENT_JOURNALS_LOADING,
      customers: CUSTOMERS,
    }),

    isValid() {
      let valid = this.isCustomerValid && this.isAmountValid && this.isPaymentDateValid;
      if (this.isEdit) {
        return (
          (valid &&
            (this.payment.amount !== this.localPayment.amount ||
              this.$toDateFormat(this.payment.payment_date) !==
                this.$toDateFormat(this.localPayment.payment_date))) ||
          this.payment.comment?.trim() !== this.localPayment.comment?.trim()
        );
      }
      return valid;
    },

    isCustomerValid() {
      return !!this.localPayment.customer_id;
    },

    isAmountValid() {
      return this.localPayment.amount > 0;
    },

    isPaymentDateValid() {
      return !!this.localPayment.payment_date;
    },
  },
  async beforeMount() {
    await this.loadCustomers().then(() => {
      let customer = this.customers.find((t) => t.id === this.localPayment.customer_id);
      if (customer) {
        this.localPayment.customer_name = customer.full_name;
        this.localPayment.customer_phone = `(${customer.phone})`;
      }
    });
  },
  methods: {
    ...mapActions({
      savePaymentAction: SAVE_PAYMENT_JOURNAL,
      updatePaymentAction: UPDATE_PAYMENT_JOURNAL,
      loadCustomers: LOAD_CUSTOMERS,
    }),
    onCustomerSelected(customer) {
      this.localPayment.customer_id = customer.id;
      this.localPayment.customer_name = customer.full_name;
      this.localPayment.customer_phone = `(${customer.phone})`;
    },

    formatDateForInput(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    close() {
      this.$emit("update:show", false);
    },

    async savePayment() {
      if (!this.isValid) return;

      const paymentData = {
        ...this.localPayment,
        payment_date: this.localPayment.payment_date,
      };

      if (this.isEdit) {
        await this.updatePaymentAction({
          ...paymentData,
          id: this.payment.id,
          callback: () => {
            this.close();
            this.$toast("Платеж успешно обновлён");
            this.$emit("reloadJournal");
          },
        });
      } else {
        await this.savePaymentAction({
          ...paymentData,
          callback: () => {
            this.close();
            this.$toast("Платеж успешно создан");
            this.$emit("reloadJournal");
          },
        });
      }
    },

    initLocalPayment() {
      if (this.payment) {
        let customer = this.customers.find((t) => t.id === this.payment.customer_id);
        this.localPayment = {
          id: this.payment.id,
          customer_id: this.payment.customer_id,
          amount: this.payment.amount,
          payment_date: this.payment.payment_date
            ? this.$toDateFormat(this.payment.payment_date, "YYYY-MM-DD")
            : "",
          comment: this.payment.comment || "",
          customer_name: customer ? customer.full_name : "",
          customer_phone: customer ? `(${customer.phone})` : "",
        };
      } else {
        this.localPayment = emptyPayment();
      }
    },
  },
};
</script>

<style scoped>
.modal {
  display: block;
  background: transparent;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
.modal-dialog {
  z-index: 1050;
}
</style>

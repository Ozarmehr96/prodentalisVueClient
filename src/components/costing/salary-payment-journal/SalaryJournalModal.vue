<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content p-3 position-relative">
        <button
          type="button"
          class="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          @click="close"
        ></button>
        <h5 class="mb-3">
          {{ isEdit ? "Редактирование выплаты" : "Выплата зарплаты" }}
        </h5>

        <form @submit.prevent="saveSalary">
          <div class="row g-3">
            <!-- Сотрудник -->
            <div class="col-12">
              <div class="form-floating">
                <input
                  type="text"
                  :disabled="isEdit"
                  :class="{ 'is-invalid': !isUserValid }"
                  :value="`${localItem.user_name || ''}`"
                  class="form-control"
                  id="floatingInput"
                  @click="showUsersCanvas = true"
                  readonly
                />
                <label for="floatingInput">Сотрудник</label>
                <div class="invalid-feedback">Выберите сотрудника</div>
                <SelectUsersWizard
                  v-model:visible="showUsersCanvas"
                  @select-user="onUserSelected"
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
                  :class="{ 'is-invalid': localItem.amount && !isAmountValid }"
                  v-model.number="localItem.amount"
                  placeholder="Сумма"
                  required
                />
                <div class="invalid-feedback">Сумма должна быть больше 0</div>
                <label>Сумма</label>
              </div>
            </div>

            <!-- Тип выплаты -->
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <select
                  class="form-select"
                  v-model="localItem.salary_payment_type"
                  required
                >
                  <option
                    v-for="type in salaryPaymentTypes"
                    :key="type.id"
                    :value="type.code"
                  >
                    {{ type.name }}
                  </option>
                </select>
                <label>Тип выплаты</label>
              </div>
            </div>

            <!-- Период с -->
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input
                  type="date"
                  class="form-control"
                  v-model="localItem.period_start"
                  placeholder="Период с"
                  required
                />
                <label>Период с</label>
              </div>
            </div>

            <!-- Период по -->
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input
                  type="date"
                  class="form-control"
                  v-model="localItem.period_end"
                  placeholder="Период по"
                  required
                />
                <label>Период по</label>
              </div>
            </div>

            <!-- Комментарий -->
            <div class="col-12">
              <div class="form-floating">
                <textarea
                  class="form-control"
                  style="height: 100px"
                  v-model.trim="localItem.comment"
                  placeholder="Комментарий"
                ></textarea>
                <label>Комментарий</label>
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
  IS_SALARY_PAYMENT_JOURNALS_LOADING,
  SAVE_SALARY_PAYMENT_JOURNAL,
  UPDATE_SALARY_PAYMENT_JOURNAL,
  LOAD_USERS,
  LOAD_SALARY_PAYMENT_TYPES,
  SALARY_PAYMENT_TYPES,
} from "../../../store/types";
import SelectUsersWizard from "../../users/SelectUsersWizard.vue";

const emptyItem = () => ({
  id: null,
  user_id: "",
  user_name: "",
  amount: 0,
  period_start: "",
  period_end: "",
  salary_payment_type: "Salary",
  comment: "",
});

export default {
  name: "SalaryJournalModal",
  components: {
    ButtonWithLoader,
    SelectUsersWizard,
  },
  props: {
    item: {
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
  data() {
    return {
      localItem: emptyItem(),
      users: [],
      showUsersCanvas: false,
    };
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log("Item changed in modal:", val);
        if (val) {
          this.setVal(val);
        } else {
          this.localItem = emptyItem();
        }
      },
    },
    show: {
      immediate: true,
      handler(val) {
        if (!this.isEdit && val === true) {
          this.localItem = emptyItem();
        }

        if (this.isEdit && val === true) {
          this.setVal(this.item);
        }
      },
    },
  },
  computed: {
    ...mapGetters({
      isLoading: IS_SALARY_PAYMENT_JOURNALS_LOADING,
      salaryPaymentTypes: SALARY_PAYMENT_TYPES,
    }),
    isValid() {
      return this.isUserValid && this.isAmountValid && this.isPeriodValid;
    },
    isUserValid() {
      return !!this.localItem.user_id;
    },
    isAmountValid() {
      return this.localItem.amount > 0;
    },
    isPeriodValid() {
      return (
        this.localItem.period_start &&
        this.localItem.period_end &&
        this.localItem.period_start <= this.localItem.period_end
      );
    },
  },
  async beforeMount() {
    await this.loadUsersList();
    await this.loadSalaryPaymentTypes();
  },
  methods: {
    ...mapActions({
      saveSalaryAction: SAVE_SALARY_PAYMENT_JOURNAL,
      updateSalaryAction: UPDATE_SALARY_PAYMENT_JOURNAL,
      loadUsers: LOAD_USERS,
      loadSalaryPaymentTypes: LOAD_SALARY_PAYMENT_TYPES,
    }),
    async loadUsersList() {
      try {
        this.users = await this.loadUsers();
      } catch (e) {
        console.error(e);
      }
    },
    close() {
      this.$emit("update:show", false);
    },
    onUserSelected(user) {
      this.localItem.user_id = user.id;
      this.localItem.user_name = user.full_name;
    },
    setVal(val) {
      this.localItem = {
        id: val.id,
        user_id: val.user_id,
        user_name: val.user_name,
        amount: val.amount,
        period_start: this.$toDateFormat(val.period_start, "YYYY-MM-DD") || "",
        period_end: this.$toDateFormat(val.period_end, "YYYY-MM-DD") || "",
        salary_payment_type: val.salary_payment_type.code,
        comment: val.comment || "",
      };
    },
    async saveSalary() {
      if (!this.isValid) return;

      const payload = {
        ...this.localItem,
      };

      if (this.isEdit) {
        await this.updateSalaryAction({
          ...payload,
          callback: () => {
            this.close();
            this.$toast("Выплата успешно обновлена");
            this.$emit("saved");
          },
        });
      } else {
        await this.saveSalaryAction({
          ...payload,
          callback: () => {
            this.close();
            this.$toast("Выплата успешно создана");
            this.$emit("saved");
          },
        });
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

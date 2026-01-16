<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content p-3 position-relative">
        <!-- Кнопка закрытия -->
        <button
          type="button"
          class="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          @click="close"
        ></button>

        <h5 class="mb-3">
          {{ isEdit ? "Редактирование заказчика" : "Добавление заказчика" }}
        </h5>

        <form @submit.prevent="saveCustomer">
          <div class="row g-3">
            <!-- ФИО -->
            <div class="col-12">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': localCustomer.full_name && !isFullNameValid }"
                  v-model.trim="localCustomer.full_name"
                  placeholder="ФИО заказчика"
                  @input="onFullNameInput"
                />
                <div class="invalid-feedback">
                  Минимум 4 символа, только буквы и пробелы
                </div>
                <label for="fullName">ФИО заказчика</label>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': localCustomer.login && !isLoginValid }"
                  v-model="localCustomer.login"
                  placeholder="Логин"
                  @input="onLoginInput"
                />
                <div class="invalid-feedback">
                  Минимум 4 символа, только латинские буквы или цифры
                </div>

                <label for="pass">Логин</label>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': localCustomer.pass && !isPasswordValid }"
                  v-model="localCustomer.pass"
                  placeholder="Пароль"
                />
                <div class="invalid-feedback">
                  Минимум 8 символов и хотя бы одна латинская буква
                </div>
                <label for="pass">Пароль</label>
              </div>
            </div>

            <!-- Телефон -->
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': localCustomer.phone && !isPhoneValid }"
                  v-model.trim="localCustomer.phone"
                  placeholder="Телефон"
                />
                <div class="invalid-feedback">Максимум 9 цифр</div>
                <label for="phone">Телефон</label>
              </div>
            </div>

            <!-- Комментарий -->
            <div class="col-12">
              <div class="form-floating">
                <textarea
                  class="form-control"
                  id="comment"
                  style="height: 100px"
                  v-model.trim="localCustomer.comment"
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
import ButtonWithLoader from "../ButtonWithLoader.vue";
import { IS_CUSTOMERS_LOADING, SAVE_CUSTOMER, UPDATE_CUSTOMER } from "../../store/types";

const emptyCustomer = () => ({
  id: null,
  full_name: "",
  phone: "",
  comment: "",
  pass: "",
  login: "",
});

export default {
  name: "CustomerModal",
  components: {
    ButtonWithLoader,
  },
  props: {
    customer: {
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
    customer: {
      immediate: true,
      deep: true,
      handler(val) {
        this.localCustomer = val ? { ...val } : emptyCustomer();
      },
    },
    show: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!this.isEdit && val === true) this.localCustomer = emptyCustomer();
      },
    },
  },
  data() {
    return {
      // Оригинал для сравнения
      originalCustomer: null,
      localCustomer: emptyCustomer(), // ✅ ОБЯЗАТЕЛЬНО
    };
  },
  computed: {
    ...mapGetters({
      isLoading: IS_CUSTOMERS_LOADING,
    }),

    // Валидность формы
    isValid() {
      return (
        this.isFullNameValid &&
        this.isLoginValid &&
        this.isPasswordValid &&
        this.isPhoneValid
      );
    },

    isFullNameValid() {
      const name = this.localCustomer?.full_name?.trim();
      if (!name) return false;

      const lettersCount = (name.match(/[a-zA-Zа-яА-ЯёЁ]/g) || []).length;

      return lettersCount >= 4;
    },

    isLoginValid() {
      const login = this.localCustomer?.login?.trim();
      const regex = /^[a-zA-Z0-9]{4,}$/;
      return regex.test(login);
    },

    isPasswordValid() {
      const pass = this.localCustomer?.pass;

      // нет пробелов
      if (/\s/.test(pass)) return false;

      // минимум 8 символов, хотя бы 1 латинская буква
      const regex = /^(?=.*[a-zA-Z]).{8,}$/;
      return regex.test(pass);
    },

    isPhoneValid() {
      const phone = this.localCustomer?.phone?.trim();
      const regex = /^\d{9}$/; // ровно 9 цифр
      return regex.test(phone);
    },
  },

  methods: {
    ...mapActions({
      saveCustomerAction: SAVE_CUSTOMER,
      updateCustomerAction: UPDATE_CUSTOMER,
    }),

    // Убираем всё кроме латинских букв и цифр
    onLoginInput() {
      this.localCustomer.login = this.localCustomer.login.replace(/[^a-zA-Z0-9]/g, "");
    },

    // Нормализация ФИО:
    // - убираем всё кроме букв и пробелов
    // - схлопываем несколько пробелов в один
    // - запрещаем строку только из пробелов
    onFullNameInput() {
      let value = this.localCustomer.full_name || "";

      // 1. Оставляем только буквы и пробелы
      value = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "");

      // 2. Схлопываем несколько пробелов в один
      value = value.replace(/\s+/g, " ");

      // 3. Убираем пробелы в начале
      value = value.replace(/^\s+/, "");

      // 4. Если нет ни одной буквы — очищаем полностью
      if (!/[a-zA-Zа-яА-ЯёЁ]/.test(value)) {
        value = "";
      }

      this.localCustomer.full_name = value;
    },

    // Закрыть модалку
    close() {
      this.$emit("update:show", false); // для v-model:show
    },

    // Сохранить заказчика
    async saveCustomer() {
      if (!this.isValid) return;

      if (this.isEdit) {
        await this.updateCustomerAction({
          ...this.localCustomer,
          callback: () => {
            this.close();
            this.$toast("Заказчик успешно обновлён");
          },
        });
      } else {
        await this.saveCustomerAction({
          ...this.localCustomer,
          callback: () => {
            this.close();
            this.$toast(`Заказчик "${this.localCustomer.full_name}" успешно создан`);
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

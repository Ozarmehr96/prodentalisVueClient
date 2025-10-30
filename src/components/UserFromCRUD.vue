<template>
  <div class="mt-3">
    <div class="row" v-if="existingUser ? user : true">
      <div class="col-12" style="max-width: 720px">
        <form @submit.prevent="handleSubmit" novalidate>
          <!-- Линия 1 -->
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Фамилия</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="user.last_name"
                :class="{ 'is-invalid': errors.last_name }"
                @blur="validateField('last_name')"
                placeholder="Введите фамилию"
              />
              <div class="invalid-feedback">{{ errors.last_name }}</div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Имя</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="user.name"
                :class="{ 'is-invalid': errors.name }"
                @blur="validateField('name')"
                placeholder="Введите имя"
              />
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Отчество</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="user.surname"
                :class="{ 'is-invalid': errors.surname }"
                @blur="validateField('surname')"
                placeholder="Отчество (необязательно)"
              />
              <div class="invalid-feedback">{{ errors.surname }}</div>
            </div>
          </div>

          <!-- Линия 2 -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Дата рождения</label>
              <input
                type="date"
                class="form-control"
                v-model="user.date_birth"
                :class="{ 'is-invalid': errors.date_birth }"
                @blur="validateField('date_birth')"
                :max="maxDate"
              />
              <div class="invalid-feedback">{{ errors.date_birth }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Телефон</label>
              <input
                type="tel"
                class="form-control"
                v-model.trim="user.phone_number"
                :class="{ 'is-invalid': errors.phone_number }"
                @blur="validateField('phone_number')"
                placeholder="+992XXXXXXXXX"
              />
              <div class="invalid-feedback">{{ errors.phone_number }}</div>
            </div>
          </div>

          <!-- Линия 3 -->
          <div class="row mb-3">
            <div class="col-md-5">
              <label class="form-label">Логин</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="user.login"
                :class="{ 'is-invalid': errors.login }"
                @blur="validateField('login')"
                placeholder="Придумайте логин"
              />
              <div class="invalid-feedback">{{ errors.login }}</div>
            </div>

            <div class="col-md-7">
              <label class="form-label">Пароль</label>
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  v-model="user.pass"
                  :class="{ 'is-invalid': errors.pass }"
                  @blur="validateField('pass')"
                  placeholder="Введите пароль"
                />
                <button class="btn btn-outline-secondary" type="button" @click="generatePassword">
                  🔑
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="togglePassword">
                  👁
                </button>
                <div class="invalid-feedback">{{ errors.pass }}</div>
              </div>
              
            </div>
          </div>

          <!-- Роль -->
          <div class="mb-3">
            <label class="form-label">Роль</label>
            <select
              class="form-select"
              v-model="user.role"
              :class="{ 'is-invalid': errors.role }"
              @blur="validateField('role')"
            >
              <option value="">Выберите роль</option>
              <option v-for="role in roles" :key="role.code" :value="role.code">
                {{ role.title }}
              </option>
            </select>
            <div class="invalid-feedback">{{ errors.role }}</div>
          </div>

          <!-- Лаборатория -->
          <div class="mb-3" v-if="isSystemAdmin && user.role === 'LabDirector'">
            <label class="form-label">Лаборатория</label>
            <select
              class="form-select"
              v-model="user.lab_id"
              :class="{ 'is-invalid': errors.lab_id }"
              @blur="validateField('lab_id')"
            >
              <option value="">Выберите лабораторию</option>
              <option v-for="lab in labs" :key="lab.id" :value="lab.id">
                {{ lab.name }}
              </option>
            </select>
            <div class="invalid-feedback">{{ errors.lab_id }}</div>
          </div>

          <!-- Специализация -->
          <div class="mb-3">
            <label class="form-label">Специализация</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="user.specialization"
              placeholder="Например: техник, керамист и т.д."
            />
          </div>

          <spinner v-if="isSaving" />
          <button v-else type="submit" class="btn btn-primary w-100 brand-style">
            Сохранить
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  CURRENT_USER,
  ADD_USER,
  UPDATE_USER,
  ACCESS_TOKEN,
  LOAD_MAIN_ROLES,
  MAIN_ROLES,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LABS,
  LOAD_LABS,
} from "../store/types";
import Spinner from "./Spinner.vue";
import errors from "../store/modules/errors";

export default {
  name: "UserFormCRUD",
  components: { Spinner },
  props: {
    existingUser: { type: Object, default: null },
  },
  data() {
    return {
      user: {
        last_name: "",
        name: "",
        surname: "",
        date_birth: "",
        phone_number: "",
        login: "",
        pass: "",
        role: "",
        lab_id: "",
        specialization: "",
      },
      errors: {},
      isSaving: false,
      showPassword: false,
    };
  },
  async beforeMount() {
    await this.loadMainRoles();
    if (this.isSystemAdmin) await this.loadLabs();

    if (this.existingUser) {
      this.user = { ...this.existingUser };
      this.user.date_birth = this.$toDateFormat(this.user.date_birth, "YYYY-MM-DD");
      // принудительно триггерим обновление select
      this.$nextTick(() => {
        this.user.role = this.user.role; // принудительно триггерим обновление select
      });
    }
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER,
      accessToken: ACCESS_TOKEN,
      roles: MAIN_ROLES,
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      labs: LABS,
    }),
    maxDate() {
      const today = new Date();
      return `${today.getFullYear() - 16}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    },
  },
  methods: {
    ...mapActions({
      createUser: ADD_USER,
      updateUser: UPDATE_USER,
      loadMainRoles: LOAD_MAIN_ROLES,
      loadLabs: LOAD_LABS,
    }),
    generatePassword() {
      const chars = "abcde123456789";
      this.user.pass = Array.from({ length: 10 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    // 🔍 Кастомная проверка конкретного поля
    validateField(field) {
      const value = this.user[field];
      switch (field) {
        case "last_name":
        case "name":
          if (!value) this.errors[field] = "Поле обязательно для заполнения";
          else if (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(value)) this.errors[field] = "Допускаются только буквы и дефисы";
          else this.errors[field] = "";
          break;

        case "surname":
          if (value && !/^[A-Za-zА-Яа-яЁё\s-]+$/.test(value))
            this.errors[field] = "Допускаются только буквы и дефисы";
          else this.errors[field] = "";
          break;

        case "date_birth":
          if (!value) this.errors[field] = "Укажите дату рождения";
          else this.errors[field] = "";
          break;

        case "phone_number":
          if (!value || !/^(\+992)?\d{9}$/.test(value))
            this.errors[field] = "Формат: +992XXXXXXXXX или 9 цифр";
          else this.errors[field] = "";
          break;

        case "login":
          if (!value) this.errors[field] = "Введите логин";
          else if (!/^[A-Za-z][A-Za-z0-9_]{3,19}$/.test(value))
            this.errors[field] = "Логин должен начинаться с буквы и содержать 4–20 символов";
          else this.errors[field] = "";
          break;

        case "pass": {
          if (!value && this.existingUser) break;
          if (!value) this.errors[field] = "Минимум 8 символов, хотя бы одна буква и цифра";
          else if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(value))
            this.errors[field] = "Минимум 8 символов, хотя бы одна буква и цифра";
          else this.errors[field] = "";
          console.log(this.errors[field]);
          break;
        }

        case "role":
          if (!value) this.errors[field] = "Выберите роль";
          else this.errors[field] = "";
          break;

        case "lab_id":
          if (this.isSystemAdmin && this.user.role === "LabDirector" && !value)
            this.errors[field] = "Выберите лабораторию";
          else this.errors[field] = "";
          break;
      }
    },

    // 🧩 Проверка всех полей перед сохранением
    validateAll() {
      Object.keys(this.user).forEach((f) => this.validateField(f));
      return Object.values(this.errors).every((e) => !e);
    },

    async handleSubmit() {
      if (!this.validateAll()) {
        this.$toastError("Исправьте ошибки в форме");
        console.log(this.errors);

        return;
      }

      this.isSaving = true;
      try {
        if (this.existingUser) {
          await this.updateUser({
            ...this.user,
            callback: (u) => {
              if (!this.isLabDirector)
                this.$toast(`Данные сотрудника успешно обновлены.`);
              this.$router.push("/users");
            },
          });
        } else {
          await this.createUser({
            ...this.user,
            callback: (u) => {
              if (!this.isLabDirector)
                this.$toast(`Запрос на добавление ${u.full_name} отправлен.`);
              this.$router.push("/users");
            },
          });
        }
      } catch (e) {
        console.error(e);
        this.$toastError("Ошибка при сохранении данных!");
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>

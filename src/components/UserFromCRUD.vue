<template>
  <div class="mt-3">
    <div class="row">
      <div class="col-12" style="max-width: 720px">
        <form
          @submit.prevent="handleSubmit"
          ref="myForm"
          class="needs-validation"
          novalidate
        >
          <!-- Линия 1 -->
          <div class="row mb-3">
            <div
              class="col-md-4"
              title="Фамилия должна содержать только буквы и дефис"
            >
              <label for="last_name" class="form-label">Фамилия</label>
              <input
                type="text"
                class="form-control"
                id="last_name"
                name="last_name"
                required
                pattern="^$|^[A-Za-zА-Яа-яЁё\s\-]+$"
              />
              <div class="invalid-feedback">
                Пожалуйста, введите корректный email!
              </div>
            </div>
            <div
              class="col-md-4"
              title="Имя должно содержать только буквы и дефис"
            >
              <label for="name" class="form-label">Имя</label>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                required
                pattern="^$|^[A-Za-zА-Яа-яЁё\s\-]+$"
              />
            </div>
            <div
              class="col-md-4"
              title="Отчество должно содержать только буквы и дефис"
            >
              <label for="surname" class="form-label">Отчество</label>
              <input
                type="text"
                class="form-control"
                id="surname"
                name="surname"
                placeholder="Отчество (необязательно)"
                pattern="^$|^[A-Za-zА-Яа-яЁё\s\-]+$"
              />
            </div>
          </div>

          <!-- Линия 2 -->
          <div class="row mb-3" title="Минимальный возраст сотрудника — 16 лет">
            <div class="col-md-6">
              <label for="date_birth" class="form-label">Дата рождения</label>
              <input
                type="date"
                class="form-control"
                id="date_birth"
                name="date_birth"
                required
                :max="maxDate"
              />
            </div>
            <div
              class="col-md-6"
              title="Введите номер из 9 цифр, с кодом страны +992 или без него"
            >
              <label for="phone_number" class="form-label">Телефон</label>
              <input
                type="tel"
                class="form-control"
                id="phone_number"
                name="phone_number"
                pattern="^(\+992)?\d{9}$"
                placeholder="+992XXXXXXXXX"
              />
            </div>
          </div>

          <!-- Линия 3 -->
          <div
            class="row mb-3"
            title="Логин должен начинаться с буквы и содержать от 4 до 20 символов (буквы, цифры, подчёркивания)"
          >
            <div class="col-md-5">
              <label for="login" class="form-label">Логин</label>
              <input
                type="text"
                class="form-control"
                id="login"
                name="login"
                pattern="^[A-Za-z][A-Za-z0-9_]{3,19}$"
                placeholder="Придумайте логин"
                required
              />
            </div>
            <div class="col-md-7" title="Пароль должен содержать минимум 8 символов, хотя бы одну букву и одну цифру, без пробелов">
              <label for="pass" class="form-label">Пароль</label>
              <div class="input-group">
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  name="pass"
                  id="pass"
                  required
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="generatePassword"
                >
                  🔑 Сгенерировать
                </button>
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="togglePassword"
                >
                  👁
                </button>
              </div>
            </div>
          </div>

          <!-- Роль -->
          <div class="mb-3">
            <label for="role" class="form-label">Роль</label>
            <select class="form-select" id="role" name="role" v-model="selectedRole" required>
              <option value="">Выберите роль</option>
              <option v-for="role in roles" :value="role.code">
                {{ role.title }}
              </option>
            </select>
          </div>

          <!-- Лаборатория -->
          <div class="mb-3" v-if="isSystemAdmin && selectedRole === 'LabDirector'">
            <label for="lab" class="form-label">Лаборатория</label>
            <select class="form-select" id="lab" name="lab_id" required>
              <option value="">Укажите лабораторию</option>
              <option v-for="lab in labs" :value="lab.id">
                {{ lab.name }}
              </option>
            </select>
          </div>

          <!-- Специализация -->
          <div class="mb-3">
            <label for="specialization" class="form-label">Специализация</label>
            <input
              type="text"
              class="form-control"
              id="specialization"
              name="specialization"
            />
          </div>

          <spinner v-if="isSaving" />
          <button
            v-else
            type="submit"
            class="btn btn-primary w-100 brand-style"
          >
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
  ACCESS_TOKEN,
  LOAD_ROLES,
  ROLES,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LABS,
  LOAD_LABS,
} from "../store/types";
import Spinner from "./Spinner.vue";
import labs from "../store/modules/labs";

/**
 * Компонент "Добавление нового сотрудника"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  name: "UserFormCRUD",
  components: {
    Spinner,
  },
  data() {
    return {
      isSaving: false,
      password: "",
      showPassword: false,
      selectedRole: ""
    };
  },
  async beforeMount() {
    await this.loadRoles();
    if (this.isSystemAdmin) {
      await this.loadLabs();
    }
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER,
      accessToken: ACCESS_TOKEN,
      roles: ROLES,
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      labs: LABS
    }),
    maxDate() {
      const today = new Date();

      // Год, равный сегодняшнему минус 16
      const minYear = today.getFullYear() - 16;

      // Месяц (нумерация с 0, поэтому +1), с добавлением ведущего нуля
      const month = String(today.getMonth() + 1).padStart(2, "0");

      // День с ведущим нулём
      const day = String(today.getDate()).padStart(2, "0");

      // Формат даты для атрибута max: YYYY-MM-DD
      return `${minYear}-${month}-${day}`;
    },
  },
  methods: {
    ...mapActions({
      createUser: ADD_USER,
      loadRoles: LOAD_ROLES,
      loadLabs: LOAD_LABS
    }),
    generatePassword() {
      const chars =
        "abcd123456789";
      let pass = "";
      for (let i = 0; i < 10; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.password = pass;
    },
    togglePassword() {
      const input = document.getElementById("pass");
      this.showPassword = !this.showPassword;
      input.type = this.showPassword ? "text" : "password";
    },
    async handleSubmit() {
      const form = this.$refs.myForm;
      if (form.checkValidity()) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        this.isSaving = true;
        let params = {
          ...data,
          callback: (u) => {
            if (!this.isLabDirector) {
              this.$toast(
                `Запрос на добавление сотрудника ${u.full_name} отправлен на подтверждение.`,
                10000
              );
            }

            this.$router.push("/users");
            return;
          },
        };
        await this.createUser(params);
        this.isSaving = false;
        console.log(data);
      } else {
        form.reportValidity(); // Показывает стандартные подсказки
      }
    },
  },
};
</script>

<template>
  <section v-if="canShow && !currentUser.hasOwnProperty('id')" class="h-100 gradient-form" style="background-color: #eee">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-xl-10">
          <div class="card rounded-3 text-black">
            <div class="row g-0">
              <div class="col-md-6 col-lg-6">
                <div class="card-body p-md-5 mx-md-6">
                  <div class="text-center">
                    <div class="logo-big"></div>
                    <h4 class="mt-1 mb-5 pb-1">ProDentalis</h4>
                  </div>

                  <form>
                    <p>Пожалуйста, войдите в систему</p>

                    <div class="form-floating mb-4">
                      <input
                        type="text"
                        v-model="login"
                        class="form-control"
                        id="floatingInput"
                        placeholder="342"
                      />
                      <label for="floatingInput">Введите логин</label>
                    </div>

                    <div class="form-floating mb-4">
                      <input
                        v-model="pass"
                        type="password"
                        class="form-control"
                        id="floatingInput"
                        placeholder=" "
                      />
                      <label for="floatingInput">Введите пароль</label>
                    </div>

                    <div class="text-center">
                      <ButtonWithLoader
                        :isLoading="isLogging"
                        title="Вход"
                        :customClasses="['btn-primary fa-lg gradient-custom-2 mb-3 w-100']"
                        :loadingText="'Авторизация...'"
                        @click="auth"
                        :isValid="true"
                        style=""
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div
                class="col-md-6 col-lg-6 d-flex align-items-center gradient-custom-2"
              >
                <div class="text-black px-3 py-4 p-md-5 mx-md-4">
                  <h4 class="mb-4">
                    Cистема автоматизации зуботехнической лаборатории
                  </h4>
                  <p class="mb-0">
                    Добро пожаловать в ProDentalis — современную систему,
                    созданную для упрощения и оптимизации работы зуботехнической
                    лаборатории. Управляйте заказами, контролируйте производство
                    и повышайте качество работы.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import { CURRENT_USER, LOGIN } from "../../store/types";
import { userRoles } from "../../services/constans";
import auth from "../../store/modules/auth";
import ButtonWithLoader from "../../components/ButtonWithLoader.vue";

/**
 * Страница "Логин"
 *
 * @vue-computed {string} accessToken - Токен доступа к системе
 */
export default {
  components: {
    ButtonWithLoader
  },
  data() {
    return {
      login: null,
      pass: null,
      isLogging: false,
      canShow: true
    };
  },
  computed: {},

  methods: {
    ...mapActions({
      loginAction: LOGIN,
      currentUser: CURRENT_USER
    }),
    async auth() {
      this.isLogging = true;
      await this.loginAction({
        login: this.login,
        pass: this.pass,
        callback: (user) => {
          this.isLogging = true;
          let path = userRoles.get(user.role);
          this.canShow = false;
          this.$router.push(`/orders`); // у всех есть доступ сюда
        },
      });
      this.isLogging = false;
    },
  },
};
</script>

<style>
.gradient-custom-2 {
  background: linear-gradient(135deg, #3dd2cc, #11998e);
  transition: background 0.3s ease; /* плавный переход */
}

.gradient-custom-2:hover {
  background: linear-gradient(135deg, #11998e, #3dd2cc); /* инвертируем цвета */
}

@media (min-width: 768px) {
  .gradient-form {
    height: 100vh !important;
  }
}
@media (min-width: 769px) {
  .gradient-custom-2 {
    border-top-right-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
  }
}
.logo-big {
    background-image: url('./../../logo-big.svg');
    width: 80px;
    height: 80px;
    display: inline-block;
}
</style>

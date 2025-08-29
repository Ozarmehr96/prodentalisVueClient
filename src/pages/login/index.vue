<template>
  <section class="h-100 gradient-form" style="background-color: #eee">
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
                      <button
                        @click="auth"
                        class="btn btn-primary fa-lg gradient-custom-2 mb-3 w-100"
                        type="button"
                      >
                        Вход
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div
                class="col-md-6 col-lg-6 d-flex align-items-center gradient-custom-2"
              >
                <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                  <h4 class="mb-4">
                    Cистема автоматизации зуботехнической лаборатории
                  </h4>
                  <p class="small mb-0">
                    Добро пожаловать в ProDentalis — современную систему,
                    созданную для упрощения и оптимизации работы зуботехнической
                    лаборатории. Управляйте заказами, контролируйте производство
                    и повышайте качество работы вместе с нами.
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
import { LOGIN } from "../../store/types";
import { userRoles } from "../../services/constans";
import auth from "../../store/modules/auth";

/**
 * Страница "Логин"
 *
 * @vue-computed {string} accessToken - Токен доступа к системе
 */
export default {
  data() {
    return {
      login: null,
      pass: null,
    };
  },
  computed: {},

  methods: {
    ...mapActions({
      loginAction: LOGIN,
    }),
    async auth() {
      await this.loginAction({
        login: this.login,
        pass: this.pass,
        callback: (user) => {
          let path = userRoles.get(user.role);
          window.location.href = path;
        },
      });
    },
  },
};
</script>

<style>
.gradient-custom-2 {
  /* fallback for old browsers */
  background: #fccb90;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(
    to right,
    #ee7724,
    #d8363a,
    #dd3675,
    #b44593
  );

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
}

.gradient-custom-2:hover {
  background: linear-gradient(45deg, #b44593, #d8363a);
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

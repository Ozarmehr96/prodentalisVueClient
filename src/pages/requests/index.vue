<template>
  <app-page title="Запросы">
    <template v-slot:headerline>
      <!-- Кнопка обновить в правом верхнем углу -->
      <button class="btn btn-outline-primary position-absolute top-3 end-3 d-flex align-items-center me-3" @click="loadRequests"
        style="gap: 5px; right:0px !important;">
        Обновить
      </button>
    </template>
    <!-- Карточки -->
    <div class="row">
      <div class="col-12 mb-3 position-relative" v-for="request in filtresRequests">
        <div class="card h-100" :class="getUserAction(request.request_type, request.status_code).borderClass
          " v-if="request.request_type === 'ApproveTelegram'">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">Подтверждение Telegram аккаунта</h5>
              <span :class="getUserAction(request.request_type).class">{{ request.status }}</span>
            </div>
            <p class="me-2 mb-1">
              Мы получили запрос на привязку вашего Telegram. Подтвердите, что это вы.
            </p>

            <!-- Подсказка про уведомления -->
            <small class="text-muted me-2 mb-1">
              После привязки вы будете получать уведомления о статусах задач прямо в Telegram.
            </small>
            <div class="d-flex gap-2 mt-2" v-if="request.status_code == 'Pending'">
              <button class="btn btn-success btn-sm" @click="updateRequest('Approved', request.id)">
                Подтвердить
              </button>
              <button class="btn btn-danger btn-sm" @click="updateRequest('Rejected', request.id)">
                Отклонить
              </button>
            </div>
          </div>
        </div>
        <div class="card h-100" :class="getUserAction(request.request_type, request.status_code).borderClass
          " v-if="request.is_user_type">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">{{ request.user.full_name }}</h5>
              <span :class="getUserAction(request.request_type).class">{{
                getUserAction(request.request_type).text
              }}</span>
            </div>
            <p class="card-text">{{ request.user.phone_number }}</p>
            <p class="card-text">
              <small>Дата рождения: </small><span class="data-val">{{
                $toDateFormat(request.user.date_birth)
              }}</span>
            </p>
            <p class="card-text">
              <small>Логин: </small><span class="data-val">{{ request.user.login }}</span>
            </p>
            <p class="card-text">
              <small>Роль: </small><span class="data-val">{{ request.user.role_title }}</span>
            </p>
            <p class="card-text">
              <small>Специализация: </small><span class="data-val">{{ request.user.specialuzation }}</span>
            </p>
            <p class="card-text">
              <small>Статус:
                <span class="data-val" :class="getUserAction(request.request_type, request.status_code).textColor">{{
                  request.status
                }}</span></small>
            </p>
            <p class="card-text">
              <small>Дата: </small><span class="data-val">{{
                $toDateTimeFormat(request.created_at)
              }}</span>
            </p>
            <p class="card-text">
              <small>Инициатор: </small><span class="data-val">{{ request.requested_by_name }}</span>
            </p>
            <div class="d-flex gap-2" v-if="isLabDirector && request.status_code == 'Pending'">
              <button class="btn btn-success btn-sm" @click="updateRequest('Approved', request.id)">
                Подтвердить
              </button>
              <button class="btn btn-danger btn-sm" @click="updateRequest('Rejected', request.id)">
                Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filtresRequests && filtresRequests.length == 0" class="text-center py-2 text-muted">
        Нет данных
      </div>
      <!-- Пример карточки -->
      <!-- <div class="col-12 mb-3 position-relative">
        <div class="card h-100 border-warning">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">Иван Иванов Иванович</h5>
              <span class="badge bg-primary">Добавление сотрудника</span>
            </div>
            <p class="card-text">+99211901718</p>
            <p class="card-text">
              <small
                >Статус:
                <span class="text-warning data-val">В ожидании</span></small
              >
            </p>
            <p class="card-text">
              <small>Роль: </small><span class="data-val">Админ</span>
            </p>
            <p class="card-text">
              <small>Логин: </small><span class="data-val">lokaloka</span>
            </p>
            <p class="card-text">
              <small>Специализация: </small
              ><span class="data-val">Стомалотог хороший</span>
            </p>
            <p class="card-text">
              <small>Дата рождения: </small
              ><span class="data-val">18.08.2025</span>
            </p>
            <p class="card-text">
              <small>Дата: </small
              ><span class="data-val">18.08.2025 12:00</span>
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-success btn-sm">Подтвердить</button>
              <button class="btn btn-danger btn-sm">Отклонить</button>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Редактирование, Подтверждено -->
      <!-- <div class="col-12 mb-3">
        <div class="card h-100 border-success">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">Пётр Петров</h5>
              <span class="badge bg-info">Редактирование</span>
            </div>
            <p class="card-text">petr@example.com</p>
            <p class="card-text">
              <small
                >Статус: <span class="text-success">Подтверждено</span></small
              >
            </p>
            <p class="card-text"><small>Дата: 17.08.2025 15:30</small></p>
            <div class="d-flex gap-2">
              <button class="btn btn-success btn-sm" disabled>
                Подтвердить
              </button>
              <button class="btn btn-danger btn-sm" disabled>Отклонить</button>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Удаление, Отклонено -->
      <!-- <div class="col-12 mb-3">
        <div class="card h-100 border-danger">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">Светлана Сидорова</h5>
              <span class="badge bg-dark">Удаление</span>
            </div>
            <p class="card-text">svetlana@example.com</p>
            <p class="card-text">
              <small>Статус: <span class="text-danger">Отклонено</span></small>
            </p>
            <p class="card-text"><small>Дата: 16.08.2025 10:45</small></p>
            <div class="d-flex gap-2">
              <button class="btn btn-success btn-sm" disabled>
                Подтвердить
              </button>
              <button class="btn btn-danger btn-sm" disabled>Отклонить</button>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </app-page>
</template>

<script>
  import AppPage from "../../components/AppPage.vue";
  import { mapGetters, mapActions } from "vuex";
  import {
    INVOKE_USER_REQUEST,
    IS_LAB_DIRECTOR,
    LOAD_REQUESTS,
  } from "./../../store/types";
  /**
   * Страница "Запросы"
   *
   * @vue-computed {object} currentUser - Текущий пользователь
   */
  export default {
    components: {
      AppPage,
    },
    data() {
      return {
        requests: [],
        isLoading: false
      };
    },
    async beforeMount() {
      await this.loadRequests();
    },
    computed: {
      ...mapGetters({
        isLabDirector: IS_LAB_DIRECTOR,
      }),
      filtresRequests() {
        return this.requests;
      },
    },
    methods: {
      ...mapActions({
        loadReqestsAction: LOAD_REQUESTS,
        invokeRequestAction: INVOKE_USER_REQUEST,
      }),
      async loadRequests() {
        this.requests = await this.loadReqestsAction();
      },
      async updateRequest(status, requestId) {
        this.isLoading = true;
        await this.invokeRequestAction({
          id: requestId,
          status: status,
          comment: null,
          callback: async () => {
            await this.loadRequests();
          }
        });
        this.isLoading = false;
      },
      getUserAction(action, status = "") {
        let borderAndTextStyle = this.getBorderStyle(status);
        switch (action) {
          case "AddUser":
            return {
              text: "Добавление",
              class: "badge bg-primary",
              borderClass: borderAndTextStyle.borderColor,
              textColor: borderAndTextStyle.textColor
            };
          case "EditUser":
            return {
              text: "Редактирование",
              class: "badge bg-info",
              borderClass: borderAndTextStyle.borderColor,
              textColor: borderAndTextStyle.textColor
            };
          case "DeleteUser":
            return {
              text: "Удаление",
              class: "badge bg-danger",
              borderClass: borderAndTextStyle.borderColor,
              textColor: borderAndTextStyle.textColor
            };
          default:
            return {
              text: "Неизвестное действие",
              class: "badge bg-secondary",
              borderClass: borderAndTextStyle.borderColor,
              textColor: borderAndTextStyle.textColor
            };
        }
      },
      getBorderStyle(status) {
        switch (status) {
          case "Approved":
            return { textColor: "text-success", borderColor: "border-success" };
          case "Rejected":
            return { textColor: "text-danger", borderColor: "border-danger" };
          case "Pending":
            return { textColor: "text-warning", borderColor: "border-warning" };
          default:
            return { textColor: "text-dark", borderColor: "border-dark" };
        }
      },
    },
  };
</script>
<style scoped>
  .card-legend {
    position: absolute;
    top: -0.6rem;
    right: 1rem;
    padding: 0.15rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
  }

  .card-text {
    margin-bottom: 5px;
  }

  .data-val {
    font-weight: 500;
  }

  /* По умолчанию на всю ширину */
  .custom-col {
    width: 100%;
  }

  /* От 1296px и выше — 8/12 (≈66.66%) */
  @media (min-width: 1521px) {
    .custom-col {
      width: 66.6667% !important;
    }
  }
</style>

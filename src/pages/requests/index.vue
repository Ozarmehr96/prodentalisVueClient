<template>
  <app-page title="Запросы">
    <template v-slot:headerline>
      <!-- Кнопка обновить в правом верхнем углу -->
      <button class="btn btn-outline-primary position-absolute top-3 end-3 d-flex align-items-center me-3"
        @click="loadRequests" style="gap: 5px; right:0px !important;">
        Обновить
      </button>
    </template>
    <!-- Карточки -->
    <div class="row">
      <div class="col-12 mb-3 position-relative" v-for="request in filtresRequests">
        <!-- Карточка редактирования заказа -->
        <UserRequestWizard 
          :request="request" 
          requestType="UpdateOrder"
          @update-request="(e) => updateRequest(e.status, e.id)" 
          :title="`Редактирование заказа № ${request?.order?.number}`"
        >
          <OrderDiffView :order="request.order" :oldOrder="request.old_order" />
           <template v-slot:buttons>
              <button class="btn btn-primary btn-sm" v-if="isLabDirector" @click="() => $router.push(`/orders/view/${request.order.id}`)">
                Посмотреть заказ
              </button>
            </template>
        </UserRequestWizard>

        <!-- Карточка для подтверждения Telegram аккаунта -->
        <UserRequestWizard 
          :request="request" 
          requestType="ApproveTelegram"
          @update-request="(e) => updateRequest(e.status, e.id)" 
          title="Подтверждение Telegram аккаунта"
        >
          <p class="me-2 mb-1">
            Мы получили запрос на привязку вашего Telegram. Подтвердите, что это вы.
          </p>

          <!-- Подсказка про уведомления -->
          <small class="text-muted me-2 mb-1">
            После привязки вы будете получать уведомления о статусах задач прямо в Telegram.
          </small>
        </UserRequestWizard>

        <!-- Карточка для подтверждения или отклонения удаления заказа -->
        <UserRequestWizard 
          :request="request" 
          requestType="DeleteOrder"
          @update-request="(e) => updateRequest(e.status, e.id)" 
          :title="`Удаление заказа №${request?.order?.number}`"
        >
            <p class="me-2 mb-1" v-if="request.requested_by == currentUser.id">
              Вы запросил удаление заказа.
            </p>
            <p class="me-2 mb-1" v-else>
              {{ request.requested_by_name }} запросил удаление заказа.
            </p>

            <!-- Подсказка (по желанию) -->
            <small class="text-muted me-2 mb-1" v-if="isLabDirector && request.status_code == 'Pending'">
              После выбора действия заказ будет либо удалён, либо останется активным.
            </small>
            <template v-slot:buttons>
              <button class="btn btn-primary btn-sm" v-if="isLabDirector" @click="() => $router.push(`/orders/view/${request.order.id}`)">
                Посмотреть заказ
              </button>
            </template>
        </UserRequestWizard>

        <!-- Карточка добавления сотрудника -->
        <UserRequestWizard 
          :request="request"
          v-if="request.request_type === `AddUser`"
          requestType="AddUser"
          @update-request="(e) => updateRequest(e.status, e.id)" 
          title="Добавление нового сотрудника"
        >
            <p class="card-text">
              <small>ФИО: </small><span class="data-val">{{ request.user.full_name }}</span>
            </p>
            <p class="card-text">
              <small>Номер телефона: </small><span class="data-val">{{ request.user.phone_number }}</span>
            </p>
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
              <small>Дата: </small><span class="data-val">{{
                $toDateTimeFormat(request.created_at)
                }}</span>
            </p>
            <p class="card-text">
              <small>Инициатор: </small><span class="data-val">{{ request.requested_by_name }}</span>
            </p>
        </UserRequestWizard>
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
    </div>
  </app-page>
</template>

<script>
  import AppPage from "../../components/AppPage.vue";
  import { mapGetters, mapActions } from "vuex";
  import {
    CURRENT_USER,
    INVOKE_USER_REQUEST,
    IS_LAB_DIRECTOR,
    LOAD_REQUESTS,
  } from "./../../store/types";
  import OrderDiffView from "../../components/order/OrderDiffView.vue";
  import UserRequestWizard from "../../components/UserRequestWizard.vue";
  /**
   * Страница "Запросы"
   *
   * @vue-computed {object} currentUser - Текущий пользователь
   */
  export default {
    components: {
      AppPage,
      OrderDiffView,
      UserRequestWizard
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
        currentUser: CURRENT_USER
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
            return { textColor: "text-primary", borderColor: "border-primary" };
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

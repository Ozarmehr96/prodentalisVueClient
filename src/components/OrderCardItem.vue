<template>
  <div class="card h-100 shadow-sm mb-3 ordercarItem">
    <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
      <span class="fw-bold">Заказ №{{ order.number }}</span>

      <template v-if="currentUser.id === order.created_user_id">
        <button
          v-if="order.has_update_request && !order.has_delete_request"
          class="btn btn-outline-danger btn-sm ms-auto me-2"
          @click.stop="cancelRequest('UpdateOrder', 'редактирование', order.id)"
        >
          Отменить запрос на редактирование
        </button>

        <button
          v-if="order.has_delete_request"
          class="btn btn-outline-danger btn-sm ms-auto me-2"
          @click.stop="cancelRequest('DeleteOrder', 'удаление', order.id)"
        >
          Отменить запрос на удаление
        </button>
      </template>

      <span class="badge" :class="getStatusClass(order.status.code)">
        {{ order.status.name }}
      </span>
    </div>

    <div
      class="card-body d-flex justify-content-between align-items-start"
      :id="`order-${order.id}-body`"
      style="padding-bottom: 0 !important; margin-bottom: -15px; cursor: pointer"
      @click="() => $router.push(`/orders/view/${order.id}`)"
    >
      <!-- Левая колонка: данные заказа -->
      <div class="main-data me-3 leftColumn" style="flex: 1 1 auto">
        <!-- Заказчик и пациент -->
        <div class="d-flex mb-2">
          <span class="text-muted orderKey">Заказчик:</span>
          <span class="fw-semibold">{{ order.customer_name }}</span>
        </div>

        <!-- Пациент -->
        <div class="d-flex mb-2">
          <span class="text-muted orderKey">Пациент:</span>
          <span class="fw-semibold">{{ order.patient_name }}</span>
        </div>

        <!-- Дата создания -->
        <div class="d-flex mb-2">
          <span class="text-muted orderKey">Создан:</span>
          <span class="fw-semibold">{{ $toDateTimeFormat(order.created_at) }}</span>
        </div>

        <!-- Срок исполнения -->
        <div class="d-flex mb-2">
          <span class="text-danger fw-bold orderKey">Срок:</span>
          <span class="fw-semibold text-danger fw-bold">{{
            $toDateFormat(order.expired_at)
          }}</span>
        </div>

        <!-- Цена -->
        <div class="d-flex mb-2" v-if="(isSystemAdmin || isLabDirector) && order.price">
          <span class="text-muted orderKey">Цена:</span>
          <span class="fw-semibold">{{ order.price }} TJS</span>
        </div>

        <!-- Комментарий -->
        <div class="d-flex mb-2" v-if="order.description">
          <span class="text-muted orderKey">Комментарии:</span>
          <span class="fw-semibold">{{ order.description }}</span>
        </div>

        <!-- Типы работ -->
        <div>
          <strong>Типы работ:</strong>
          <ul class="list-unstyled ms-2">
            <li
              v-for="wt in workTypes"
              :key="wt.id"
              class="mb-1 d-flex align-items-center"
            >
              <div
                class="workTypeBlock me-2"
                :style="`background-color:${wt.background_color};`"
              ></div>
              <span class="me-2 text-nowrap">{{ wt.name }} :</span>
              <span class="text-muted">
                <div class="teeth d-inline-flex">
                  <span v-for="tooth in wt.teeth" :key="tooth" class="tooth">
                    {{ tooth }}
                  </span>
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Правая колонка: QR код -->
      <div class="qr-code d-none d-lg-block" style="flex: 0 0 auto; min-width: 120px">
        <QrCode :link="host" :maxSize="150" :id="`order-qr-${order.id}`" />
      </div>
      <div
        class="qr-code d-none d-lg-block"
        style="flex: 0 0 auto; min-width: 120px; transform: scale(1.8)"
      >
        <ToothSelection
          ref="toothSelection"
          @onToothSelectedChanged="selectedToothChnged"
          @onCopyToothData="copyToothData"
        />
      </div>
    </div>

    <div class="card-footer text-muted small d-flex align-items-center order-item-footer">
      <!-- Текст слева -->
      <span class="text-truncate"> Создал: {{ order.created_user_name }} </span>

      <div class="ms-auto d-none d-sm-flex">
        <button
          v-if="canControl && order.status.code === 'Primerka' && false"
          class="btn btn-sm btn-success ms-auto me-2 footerButton"
          @click="finishPrimerka"
          title="Завершить примерку"
          style="min-width: 150px"
        >
          Завершить примерку
        </button>

        <button
          v-if="canControl && order.status.code === 'Created'"
          class="btn btn-sm btn-success ms-auto me-2 footerButton"
          @click="startOrder"
          title="Начать выполнение заказа"
          style="min-width: 150px"
        >
          Начать
        </button>

        <button
          v-if="canControl && order.status.code === 'Started'"
          class="btn btn-sm btn-success ms-auto me-2 footerButton"
          @click="finishOrder"
          title="Завершить выполнение заказа"
          style="min-width: 150px"
        >
          Завершить
        </button>

        <button
          v-if="
            order.status.code !== 'Finished' &&
            canControl &&
            !order.has_delete_request &&
            !order.has_update_request
          "
          class="btn btn-sm btn-warning ms-auto me-2 footerButton"
          @click="() => $router.push(`/orders/${order.id}`)"
          title="Редактировать"
        >
          Редактировать
        </button>

        <button
          v-if="canDelete && !order.has_delete_request"
          class="btn btn-sm btn-outline-danger me-2 footerButton"
          @click="deleteOrder"
          title="Удалить"
        >
          Удалить
        </button>
        <!-- Кнопка справа -->
        <button
          class="btn btn-sm btn-outline-primary footerButton"
          @click="() => $emit('onPrintOrder', order)"
          title="Печать заказа"
        >
          Печать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  convertOrderTeethToWorkTypes,
  getOrderStatusClass,
} from "../helpers/order-helpers";
import QrCode from "./QrCode.vue";
import {
  FINISH_ORDER,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  START_ORDER,
  DELETE_ORDER,
  IS_LAB_ADMIN,
  CURRENT_USER,
  INVOKE_USER_REQUEST,
  LOAD_ACTIVE_REQUEST_BY_TYPE,
  SET_ORDER_SELECTED_TEETH,
  SET_SELECTED_TOOTH,
} from "../store/types";
import ToothSelection from "./ToothSelection.vue";

export default {
  name: "OrderCard",
  components: { QrCode, ToothSelection },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  async beforeMount() {
    let orderToEdit = JSON.parse(JSON.stringify(this.order));

    orderToEdit.teeth.forEach(async (t) => {
      let selectedTooth = {};
      selectedTooth.id = t.tooth_id;
      selectedTooth.isSelected = false;
      selectedTooth.workTypes = t.work_types;
      selectedTooth.background_color = t.work_types.length
        ? t.work_types[0].background_color
        : null;

      await new Promise((resolve) => setTimeout(resolve, 100)); // небольшая задержка для корректного рендера
      await this.setSelectedTooth(selectedTooth).then(async () => {
        await this.$refs.toothSelection.applySelection();
      });
    });
  },
  async mounted() {
    await this.$refs.toothSelection.applySelection();
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isLabAdmin: IS_LAB_ADMIN,
      currentUser: CURRENT_USER,
    }),
    canControl() {
      return this.isSystemAdmin || this.isLabAdmin || this.isLabDirector;
    },
    canDelete() {
      if (this.order.status.code === "DeletionRequest") {
        return false;
      }

      return this.isSystemAdmin || this.isLabAdmin || this.isLabDirector;
    },
    // преобразование зубов в типы работ
    workTypes() {
      return convertOrderTeethToWorkTypes(this.order.teeth.slice());
    },
    host() {
      return `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? ":" + window.location.port : ""
      }/orders/view/${this.order.id}`;
    },
  },
  methods: {
    ...mapActions({
      setOrderSelectedTeeth: SET_ORDER_SELECTED_TEETH,
      setSelectedTooth: SET_SELECTED_TOOTH,
      startOrderAction: START_ORDER,
      finishOrderAction: FINISH_ORDER,
      deleteOrderAction: DELETE_ORDER,
      invokeRequestAction: INVOKE_USER_REQUEST,
      loadActiveUserRequestByType: LOAD_ACTIVE_REQUEST_BY_TYPE,
    }),
    startOrder() {
      this.startOrderAction(this.order.id).then(() => this.$emit("statusChanged"));
    },
    async deleteOrder() {
      if (!confirm(`Вы уверены, что хотите удалить заказ №${this.order.number}?`)) return;

      let message = "Заказ успешно удалён.";
      if (this.isLabAdmin) {
        message = "Запрос на удаление заказа отправлен на рассмотрение директору.";
      }

      await this.deleteOrderAction(this.order.id).then(() => {
        this.$emit("statusChanged");
        this.$toast(message);
      });
    },
    async finishOrder() {
      if (
        confirm(
          `Вы действительно хотите завершить выполнение заказа №${this.order.number}?`
        )
      ) {
        await this.finishOrderAction(this.order.id).then(() => {
          this.$emit("statusChanged");
        });
      }
    },
    async cancelRequest(requestType, requestTypeText, orderId) {
      if (
        !confirm(
          `Вы уверены, что хотите отменить запрос на ${requestTypeText} заказа №${this.order.number}?`
        )
      ) {
        return;
      }

      // загрузка активного запроса пользователя по типу
      let request = await this.loadActiveUserRequestByType({
        requestType,
        objectId: orderId,
      });

      // проверка наличия запроса и соответствия заказа
      if (!request || (request.order && request.order.id !== orderId)) {
        this.$toastError(
          `Активный запрос на ${requestTypeText} заказа №${this.order.number} не найден.`
        );
        return;
      }

      this.invokeRequestAction({
        id: request.id,
        status: "Cancelled",
        comment: null,
        callback: async () => {
          this.$emit("statusChanged");
          this.$toast(
            `Запрос на ${requestTypeText} заказа №${this.order.number} успешно отменён.`
          );
        },
      });
    },
    // стили для статуса
    getStatusClass(statusCode) {
      return getOrderStatusClass(statusCode);
    },
    /**
     * Завершение примерки.
     */
    finishPrimerka() {},
    /**
     * Отправить примерку.
     */
    startPrimerka() {},
  },
};
</script>

<style scoped>
.ordercarItem {
  max-width: 1800px;
}

.footerButton {
  height: 28px;
  font-size: 0.75rem;
}

.workTypeBlock {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  display: inline-flex;
}

.card {
  border-radius: 1rem;
}

.teeth {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tooth {
  font-size: 14px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.orderKey {
  width: 110px;
}
</style>

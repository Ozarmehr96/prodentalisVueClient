<template>
  <div class="card h-100 shadow-sm mb-3 ordercarItem">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span class="fw-bold">Заказ №{{ order.number }}</span>
      <span class="badge" :class="getStatusClass(order.status.code)">
        {{ order.status.name }}
      </span>
    </div>

    <div class="card-body d-flex justify-content-between align-items-start" :id="`order-${order.id}-body`"
      style="padding-bottom: 0 !important; margin-bottom: -15px;  cursor: pointer;"
      @click="() => $router.push(`/orders/view/${order.id}`)">
      <!-- Левая колонка: данные заказа -->
      <div class="main-data me-3" style="flex: 1 1 auto">
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
          <span class="fw-semibold text-danger fw-bold">{{ $toDateFormat(order.expired_at) }}</span>
        </div>

        <!-- Цена -->
        <div class="d-flex mb-2" v-if="(isSystemAdmin || isLabDirector) && order.price">
          <span class="text-muted orderKey">Цена:</span>
          <span class="fw-semibold">{{ order.price }} TJS</span>
        </div>

        <!-- Комментарий -->
        <div class="d-flex mb-2" v-if="order.description">
          <span class="text-muted orderKey">Комментарии:</span>
          <span class="fw-semibold">{{ order.description }} TJS</span>
        </div>

        <!-- Типы работ -->
        <div>
          <strong>Типы работ:</strong>
          <ul class="list-unstyled ms-2">
            <li v-for="wt in workTypes" :key="wt.id" class="mb-1 d-flex align-items-center">
              <div class="workTypeBlock me-2" :style="`background-color:${wt.background_color};`"></div>
              <span class="me-2">{{ wt.name }} :</span>
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
      <div class="qr-code" style="flex: 0 0 auto; min-width: 120px">
        <QrCode :link="host" :maxSize="150" :id="`order-qr-${order.id}`" />
      </div>
    </div>

    <div class="card-footer text-muted small d-flex align-items-center"
      style="max-height: 38px; padding: 0.25rem 0.5rem; overflow: hidden">
      <!-- Текст слева -->
      <span class="text-truncate">
        Создано пользователем: {{ order.created_user_name }}
      </span>

      <div class="ms-auto" style="display: flex;">

        <button v-if="canControl && order.status.code === 'Created'" class="btn btn-sm btn-success ms-auto me-2 footerButton"
          @click="startOrder" title="Начать выполнение заказа" style="min-width: 150px;">
          Начать
        </button>

        <button v-if="canControl && order.status.code === 'Started'" class="btn btn-sm btn-danger ms-auto me-2 footerButton"
          @click="finishOrder" title="Завершить выполнение заказа" style="min-width: 150px;">
          Завершить
        </button>

        <button
          v-if="canControl"
          class="btn btn-sm btn-warning ms-auto me-2 footerButton"
          @click="() => $router.push(`/orders/${order.id}`)" title="Редактировать">
          Редактировать
        </button>
        <!-- Кнопка справа -->
        <button class="btn btn-sm btn-outline-primary me-2 footerButton" @click="() => $emit('onPrintOrder', order)" title="Печать заказа">
          Печать
        </button>
        <button 
          v-if="canControl"
          class="btn btn-sm btn-danger footerButton" @click="deleteOrder" title="Удалить">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { convertOrderTeethToWorkTypes } from "../helpers/order-helpers";
import QrCode from "./QrCode.vue";
import { FINISH_ORDER, IS_LAB_DIRECTOR, IS_SYSTEM_ADMIN, START_ORDER, DELETE_ORDER, IS_LAB_ADMIN, CURRENT_USER } from "../store/types";
import dayjs from "dayjs";
export default {
  name: "OrderCard",
  components: { QrCode },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isLabAdmin: IS_LAB_ADMIN,
      currentUser: CURRENT_USER
    }),
    canControl() {
      return this.isSystemAdmin || this.isLabAdmin || this.isLabDirector;
    },
    // преобразование зубов в типы работ
    workTypes() {
      return convertOrderTeethToWorkTypes(this.order.teeth.slice());
    },
    host() {
      return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ":" + window.location.port : ""
        }/orders/${this.order.id}`;
    },
  },
  methods: {
    ...mapActions({
      startOrderAction: START_ORDER,
      finishOrderAction: FINISH_ORDER,
      deleteOrderAction: DELETE_ORDER,
    }),
    startOrder() {
      this.startOrderAction(this.order.id).then(() => this.$emit("statusChanged"));
    },
    async deleteOrder() {
      if (!confirm(`Вы уверены, что хотите удалить заказ №${this.order.number}?`)) return;
      await this.deleteOrderAction(this.order.id);
    },
    async finishOrder() {
      if (confirm(`Вы действительно хотите завершить выполнение заказа №${this.order.id}?`)) {
        await this.finishOrderAction(this.order.id).then(() => {
          this.$emit("statusChanged");
        });
      }
    },
    formatDeadLine(date) {
      const expiredDate = dayjs(date);
      const now = dayjs();

      const diffDays = expiredDate.diff(now, "day"); // разница в днях

      if (diffDays < 0 && this.order.status.code !== "Finished") {
        // просрочено
        return `${expiredDate.format("DD.MM.YYYY")} (Просрочено ${Math.abs(diffDays)} дн.)`;
      } else {
        if (this.order.status.code === "Finished") {
          return date;
        }
        // ещё не просрочено
        return `${expiredDate.format("DD.MM.YYYY")} (осталось ${diffDays} дн.)`;
      }
    },
    // парсинг зубов (они приходят строкой)
    parseTeeth(teethStr) {
      try {
        return JSON.parse(teethStr);
      } catch {
        return [];
      }
    },
    // стили для статуса
    getStatusClass(statusCode) {
      switch (statusCode) {
        case "Created":
          return "bg-primary";
        case "Started":
          return "bg-success text-white";
        case "Finished":
          return "bg-secondary";
        case "Canceled":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    },
  },
};
</script>

<style scoped>
.ordercarItem {
  max-width: 1800px;
}

.footerButton {
  height: 28px;
  font-size: 0.75rem
}

.workTypeBlock {
  width: 20px;
  height: 20px;
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

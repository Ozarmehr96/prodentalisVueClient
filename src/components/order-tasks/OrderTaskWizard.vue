<template>
  <main>
    <div class="card mb-3 shadow-lg border-0">
      <div class="card-body p-4">
        <!-- Верхняя строка: слева текст, справа статус -->
        <div
          v-if="!showButtonsOnly"
          class="d-flex justify-content-between align-items-start"
        >
          <!-- Левая часть -->
          <div class="me-2">
            <h5 class="card-title mb-1">{{ orderTask.work_step.name }}</h5>
            <p class="text-muted small mb-3">{{ orderTask.work_type.name }}</p>
          </div>
          <!-- Правая часть: статус -->
          <span :class="getStatusClass(orderTask.status.code)" class="badge mb-3">
            {{ orderTask.status.name }}
          </span>
        </div>

        <!-- Информация о заказе -->
        <div class="bg-light rounded p-3 mb-3" v-if="!showButtonsOnly && orderTask.order">
          <div class="d-flex justify-content-between mb-1">
            <small class="text-muted">Заказ</small>
            <small>
              <router-link :to="`/orders/view/${orderTask.order.id}`">
                №{{ orderTask.order_number }}
              </router-link>
            </small>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <small class="text-muted">Пациент</small>
            <small>{{ orderTask.order.patient_name }}</small>
          </div>
          <div class="d-flex justify-content-between">
            <small class="text-muted">Срок</small>
            <small>{{ $toDateFormat(orderTask.order.expired_at) }}</small>
          </div>
          <div class="d-flex justify-content-between">
            <small class="text-muted">Зубы</small>
            <small>
              <div class="teeth d-inline-flex">
                <span
                  v-for="tooth in currentWorkTypeTeeth"
                  :key="tooth"
                  class="tooth"
                  style="background-color: white"
                >
                  {{ tooth }}
                </span>
              </div></small
            >
          </div>
          <div
            class="d-flex"
            v-if="
              currentExecutor &&
              (orderTask.status.code === 'Started' || orderTask.status.code === 'Paused')
            "
          >
            <timer
              :elapsedTime="currentExecutor ? currentExecutor.elapsedTime : 0"
              :running="orderTask.status.code === 'Started' && currentExecutor"
            />
          </div>
        </div>

        <div class="d-grid gap-2" v-if="orderTask.status.code === 'NotStarted'">
          <button @click="startTask(orderTask.id)" class="btn btn-primary">
            <i class="bi bi-play-fill"></i> Начать
          </button>
        </div>
        <template v-if="currentExecutor && !orderTask.is_auto_started">
          <div class="d-grid gap-2 d-md-flex" v-if="orderTask.status.code === 'Started'">
            <button @click="pauseTask(orderTask.id)" class="btn btn-warning flex-fill">
              <i class="bi bi-pause-fill"></i> Пауза
            </button>
            <button @click="finishTask(orderTask.id)" class="btn btn-secondary flex-fill">
              <i class="bi bi-check-circle-fill"></i> Завершить
            </button>
          </div>

          <div class="d-grid gap-2 d-md-flex" v-if="orderTask.status.code === 'Paused'">
            <button @click="startTask(orderTask.id)" class="btn btn-success flex-fill">
              <i class="bi bi-play-fill"></i> Продолжить
            </button>
            <button @click="finishTask(orderTask.id)" class="btn btn-secondary flex-fill">
              <i class="bi bi-check-circle-fill"></i> Завершить
            </button>
          </div>
        </template>
        <div v-else-if="anotherExecutor" class="d-flex justify-content-between">
          <small
            >Взят в работу: {{ anotherExecutor.executor.name }}
            {{ orderTask.is_auto_started ? "(автоматически)" : "" }}</small
          >
        </div>

        <div
          v-if="currentExecutor && orderTask.is_auto_started"
          class="d-flex justify-content-between"
        >
          <small>Автоматически запущен</small>
        </div>

        <div class="d-grid" v-if="orderTask.status === 'Finished'">
          <button disabled class="btn btn-secondary">
            <i class="bi bi-check-circle-fill"></i> Этап завершён
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  CURRENT_USER,
  FINISH_ORDER_TASK,
  PAUSE_ORDER_TASK,
  START_ORDER_TASK,
} from "../../store/types";
import {
  convertOrderTeethToWorkTypes,
  getTaskStatusClass,
} from "../../helpers/order-helpers";
import Timer from "../order/Timer.vue";

export default {
  name: "OrderTaskWizard",
  components: {
    Timer,
  },
  props: {
    /* Задача заказа */
    orderTask: {
      type: Object,
      required: true,
    },
    /* Показать только кнопки управления задачей без дополнительной информации */
    showButtonsOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      orderTasks: [
        {
          id: "88b074e9-2493-4182-9350-1317a2e4ffb6",
          order_id: 5,
          order_number: 5,
          work_type: {
            id: 2,
            name: "Цирконий",
            image_url: null,
            description: null,
            background_color: null,
            steps: [],
          },
          work_step: {
            roles: [],
            id: 3,
            name: "Модилирование",
            price: 0,
            description: null,
            priority: 0,
          },
          priority: 1,
          status: {
            id: 1,
            name: "Не начат",
            code: "NotStarted",
          },
          created_at: "2025-12-01T16:49:43.67874",
          comment: null,
          isFittingStep: false,
          executors: [],
          order: {
            id: 5,
            customer_name: "ozarmehr",
            patient_name: "ozarmehr",
            number: 5,
            expired_at: "2025-12-10T00:00:00",
            created_at: "0001-01-01T00:00:00",
            teeth: [
              {
                id: 11,
                order_id: 5,
                tooth_id: 48,
                work_types: [
                  {
                    id: 2,
                    name: "Цирконий",
                    image_url: null,
                    description: null,
                    background_color: "#12d380",
                    steps: [],
                  },
                ],
              },
            ],
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER,
    }),
    canShowTimer() {
      return (
        this.orderTask.status.code != "Pending" &&
        this.orderTask.status.code != "NotStarted" &&
        this.currentExecutor
      );
    },
    workTypesWithTeeth() {
      return convertOrderTeethToWorkTypes(this.orderTask.order.teeth.slice());
    },
    currentWorkTypeTeeth() {
      return this.workTypesWithTeeth.find((w) => w.id == this.orderTask.work_type.id)
        .teeth;
    },
    /**
     * Текущий исполнитель задачи
     */
    currentExecutor() {
      let executor = this.orderTask.executors.find(
        (e) => e.executor.id === this.currentUser.id
      );

      return executor;
    },
    /**
     * Другой исполнитель, если есть
     */
    anotherExecutor() {
      let executor = this.orderTask.executors.find(
        (e) => e.executor.id.trim() !== this.currentUser.id.trim()
      );

      return executor;
    },
  },
  methods: {
    ...mapActions({
      startOrderTaskAction: START_ORDER_TASK,
      pauseOrderTaskAction: PAUSE_ORDER_TASK,
      finishOrderTaskAction: FINISH_ORDER_TASK,
    }),
    async startTask(orderTaskId) {
      await this.startOrderTaskAction({
        orderTaskId,
        callback: (orderTask) => this.$emit("refreshTasks"),
      });
    },
    async pauseTask(orderTaskId) {
      await this.pauseOrderTaskAction({
        orderTaskId,
        callback: (orderTask) => this.$emit("refreshTasks"),
      });
    },
    async finishTask(orderTaskId) {
      await this.finishOrderTaskAction({
        orderTaskId,
        callback: (orderTask) => this.$emit("refreshTasks"),
      });
    },
    getStatusClass(status) {
      return getTaskStatusClass(status);
    },
  },
};
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
</style>

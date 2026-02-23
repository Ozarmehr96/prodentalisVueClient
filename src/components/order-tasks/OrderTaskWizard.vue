<template>
  <main>
    <div
      class="card mb-3 shadow-lg border-0 task-item"
      :class="isSaving || isStopping || isFinishing || isCanceling ? `pe-none` : ``"
    >
      <div
        class="card-header d-flex flex-wrap"
        style="background-color: white; cursor: pointer"
        v-on:click="goToViewPage"
        v-if="!showButtonsOnly"
      >
        <span>Заказ №{{ orderTask.order_number }}</span>
      </div>
      <div class="card-body p-4">
        <!-- Верхняя строка: слева текст, справа статус -->
        <div
          v-if="!showButtonsOnly"
          style="cursor: pointer"
          v-on:click="goToViewPage"
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
            <small class="text-muted">Пациент</small>
            <small>{{ orderTask.order.patient_name }}</small>
          </div>
          <div class="d-flex justify-content-between">
            <small class="text-muted">Срок</small>
            <small>{{ $toDateFormat(orderTask.order.expired_at) }}</small>
          </div>
          <div class="d-flex justify-content-between">
            <small class="text-muted">Стоимость</small>
            <small class="fw-bold"
              >{{ orderTask.total_price }} TJS / {{ orderTask.teeth_count }} ед.</small
            >
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
              :running="
                orderTask.status.code === 'Started' && currentExecutor ? true : false
              "
            />
          </div>
        </div>

        <div class="d-grid gap-2" v-if="orderTask.status.code === 'NotStarted'">
          <ButtonWithLoader
            :isLoading="isSaving"
            title="Начать"
            :customClasses="['btn-primary flex-fill']"
            :loadingText="''"
            @click="startTask(orderTask.id)"
          />
        </div>
        <template v-if="currentExecutor && !orderTask.is_auto_started">
          <div class="d-grid gap-2 d-md-flex" v-if="orderTask.status.code === 'Started'">
            <ButtonWithLoader
              :isLoading="isStopping"
              title="Пауза"
              :customClasses="['btn-warning flex-fill']"
              :loadingText="''"
              @click="pauseTask(orderTask.id)"
            />

            <ButtonWithLoader
              :isLoading="isFinishing"
              title="Завершить"
              :customClasses="['btn-primary flex-fill']"
              :loadingText="''"
              @click="finishTask(orderTask.id)"
            />
            <ButtonWithLoader
              :isLoading="isCanceling"
              title="Отменить"
              :customClasses="['btn-secondary flex-fill']"
              :loadingText="'Отмена...'"
              @click="cancelTask(orderTask.id)"
            />
          </div>
          <div class="d-grid gap-2 d-md-flex" v-if="orderTask.status.code === 'Paused'">
            <ButtonWithLoader
              :isLoading="isSaving"
              title="Продолжить"
              :customClasses="['btn-success flex-fill']"
              :loadingText="''"
              @click="startTask(orderTask.id)"
            />

            <ButtonWithLoader
              :isLoading="isFinishing"
              title="Завершить"
              :customClasses="['btn-primary flex-fill']"
              :loadingText="''"
              @click="finishTask(orderTask.id)"
            />

            <ButtonWithLoader
              :isLoading="isCanceling"
              title="Отменить"
              :customClasses="['btn-secondary flex-fill']"
              :loadingText="'Отмена...'"
              @click="cancelTask(orderTask.id)"
            />
          </div>
        </template>

        <div v-else-if="anotherExecutor" class="d-flex justify-content-between">
          <small
            >Взят в работу: {{ anotherExecutor.executor.name }}
            {{ orderTask.is_auto_started ? "(автоматически)" : "" }}</small
          >
        </div>

        <div
          v-if="currentExecutor && orderTask.is_auto_started === true"
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
  CANCEL_ORDER_TASK,
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
import ButtonWithLoader from "../ButtonWithLoader.vue";

export default {
  name: "OrderTaskWizard",
  components: {
    Timer,
    ButtonWithLoader,
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
      isSaving: false,
      isStopping: false,
      isFinishing: false,
      isCanceling: false,
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
      cancelOrderTaskAction: CANCEL_ORDER_TASK,
    }),
    goToViewPage(e) {
      this.$router.push(`/orders/view/${this.orderTask.order.id}`);
    },
    async startTask(orderTaskId) {
      this.isSaving = true;
      await this.startOrderTaskAction({
        orderTaskId,
        callback: (orderTask) => this.$emit("refreshTasks"),
      });
      this.isSaving = false;
    },
    async pauseTask(orderTaskId) {
      this.isStopping = true;
      await this.pauseOrderTaskAction({
        orderTaskId,
        callback: (orderTask) => this.$emit("refreshTasks"),
      });
      this.isStopping = false;
    },
    async finishTask(orderTaskId) {
      this.isFinishing = true;
      await this.finishOrderTaskAction({
        orderTaskId,
        callback: (orderTask) => this.$emit("refreshTasks"),
      });
      this.isFinishing = false;
    },
    async cancelTask(orderTaskId) {
      if (!confirm("Вы действительно хотите отменить выполнение этой задачи?")) return;

      this.isCanceling = true;
      await this.cancelOrderTaskAction({
        orderTaskId,
        callback: (orderTask) => this.$emit("refreshTasks"),
      });
      this.isCanceling = false;
    },
    getStatusClass(status) {
      return getTaskStatusClass(status);
    },
  },
};
</script>

<style scoped>
.task-item:hover {
  pointer-events: stroke;
}
.table td {
  vertical-align: middle;
}
</style>

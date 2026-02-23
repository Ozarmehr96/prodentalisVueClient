<template>
  <div>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div>
          <div class="card-body">
            <!-- Верхняя строка: слева текст, справа статус -->
            <div class="d-flex justify-content-between align-items-start">
              <!-- Левая часть -->
              <div class="me-2">
                <h5 class="card-title">Заказ №{{ order.number }}</h5>
              </div>
              <!-- Правая часть: статус -->
              <span class="badge mb-3" :class="getStatusOrderStatus(order.status.code)">
                <span>{{ order.status.name }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Левая колонка: данные заказа и стоимость -->
      <div class="col-md-4 col-md-8 col-md-6 col-lg-8">
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Пациент:</span>
              <span class="fw-semibold">{{ order.patient_name }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Заказчик:</span>
              <span class="fw-semibold">{{ order.customer_name }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Создал:</span>
              <span class="fw-semibold">{{ order.created_user_name }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Дата создания:</span>
              <span class="fw-semibold">{{ $toDateTimeFormat(order.created_at) }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">Срок сдачи:</span>
              <span class="fw-semibold">{{ $toDateFormat(order.expired_at) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Комментарии:</span>
              <span class="fw-semibold">{{ order.description }}</span>
            </div>
          </div>
        </div>

        <!-- Блок для изменения срока выполнения заказа -->
        <div
          class="card shadow-sm mb-3"
          v-if="isSystemAdmin || isLabDirector || isLabAdmin"
        >
          <div class="card-body">
            <div class="row g-2 align-items-end">
              <!-- Поле даты -->
              <div class="col-12 col-md-7">
                <label class="form-label mb-1"> Новый срок выполнения </label>
                <input type="date" class="form-control" v-model="newDeadline" />
              </div>

              <!-- Кнопка -->
              <div class="col-12 col-md-5">
                <ButtonWithLoader
                  @click="updateOrderDeadline"
                  type="button"
                  :isLoading="isUpdatingDeadline"
                  title="Обновить срок"
                  loadingText="Обновление..."
                  :isValid="isValidNewDeadline"
                  :customClasses="[
                    'w-100',
                    isValidNewDeadline ? 'brand-style' : 'btn-outline-secondary',
                  ]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Сумма заработка -->
        <div
          class="card text-center mb-3"
          v-if="isSystemAdmin || isLabDirector || isLabAdmin"
        >
          <div class="card-body bg-success bg-opacity-10 rounded text-center">
            <h5 class="card-title text-success small mb-1">Стоимость</h5>
            <p class="fs-2 fw-bold text-success" style="margin-bottom: 0px">
              {{ order.price }} TJS
            </p>
          </div>
        </div>
      </div>

      <!-- Правая колонка: зубы по типам работ -->
      <div class="col-md-4 col-md-8 col-md-6 col-lg-8">
        <WorkTypeCardItem
          v-for="workType in filtredOrderSelectedTeethasWorktype"
          :workType="workType"
          :key="workType.id"
          style="margin-bottom: 10px"
        />
      </div>

      <div
        class="col-md-4 col-md-6 col-lg-8"
        v-if="order.tasks && order.tasks.length > 0"
      >
        <OrderTasksGraphView :order="order" @reloadOrder="() => $emit('reloadOrder')" />
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
import WorkTypeCardItem from "./WorkTypeCardItem.vue";
import {
  IS_LAB_ADMIN,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  UPDATE_ORDER,
  UPDATE_ORDER_DEAD_LINE,
} from "../store/types";
import OrderTasksGraphView from "./order-tasks/OrderTasksGraphView.vue";
import ButtonWithLoader from "./ButtonWithLoader.vue";

export default {
  name: "OrderView",
  components: {
    WorkTypeCardItem,
    OrderTasksGraphView,
    ButtonWithLoader,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newDeadline: null,
      isUpdatingDeadline: false,
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      isLabAdmin: IS_LAB_ADMIN,
    }),
    isValidNewDeadline() {
      return (
        this.newDeadline &&
        this.$toDateFormat(this.newDeadline) !== this.$toDateFormat(this.order.expired_at)
      );
    },
    // Группировка зубов по типам работ
    filtredOrderSelectedTeethasWorktype() {
      return convertOrderTeethToWorkTypes(this.order.teeth);
    },
  },
  methods: {
    ...mapActions({
      updateOrderDeadlineAction: UPDATE_ORDER_DEAD_LINE,
    }),
    getStatusOrderStatus(statusCode) {
      return getOrderStatusClass(statusCode);
    },
    async updateOrderDeadline() {
      this.isUpdatingDeadline = true;
      await this.updateOrderDeadlineAction({
        id: this.order.id,
        expired_at: this.newDeadline,
        callback: () => {
          this.isUpdatingDeadline = false;
          this.$emit("reloadOrder");
          this.$toast("Срок заказа успешно обновлен");
        },
      });
      this.isUpdatingDeadline = false;
    },
  },
};
</script>

<style scoped>
.card-header {
  font-weight: bold;
}
</style>

<template>
  <div
    class="card h-100"
    :class="getBorderStyle(request.status_code).borderColor"
    v-if="requestType == request.request_type && canShow"
  >
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="card-title mb-0">{{ title }}</h5>
        <span :class="getBorderStyle(request.status_code).textColor">
          {{ request.status }}
        </span>
      </div>
      <!-- Основной слот для содержимого карточки -->
      <slot></slot>

      <!-- Информация о статусе -->
      <div>
        <div class="text-muted mt-1" v-if="request.created_at">
          Дата отправки: {{ $toDateTimeFormat(request.created_at) }}
        </div>
        <div class="text-muted mt-1" v-if="request.requested_by">
          <template v-if="currentUser.id === request.requested_by">
            Отправлено мною.
          </template>
          <template v-else> Отправлено: {{ request.requested_by_name }} </template>
        </div>
        <div class="text-muted mt-1" v-if="request.approved_by_name">
          <template v-if="currentUser.id === request.approved_by">
            Решение принято мной.
          </template>
          <template v-else> Принял: {{ request.approved_by_name }} </template>
        </div>
      </div>

      <!-- Кнопки действий для Pending -->
      <div class="d-flex gap-2 mt-2">
        <button
          v-if="isLabDirector && request.status_code === 'Pending'"
          class="btn btn-success btn-sm"
          @click="updateRequest('Approved', request.id)"
        >
          Подтвердить
        </button>
        <button
          v-if="isLabDirector && request.status_code === 'Pending'"
          class="btn btn-danger btn-sm"
          @click="updateRequest('Rejected', request.id)"
        >
          Отклонить
        </button>

        <button
          class="btn btn-outline-danger btn-sm"
          v-if="
            canShowCancelButton &&
            currentUser.id === request.requested_by &&
            request.status_code === 'Pending'
          "
          @click="updateRequest('Cancelled', request.id)"
        >
          Отменить запрос
        </button>

        <!-- Слот для кастомных кнопок -->
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CURRENT_USER, IS_LAB_DIRECTOR } from "../store/types";

export default {
  name: "UserRequestWizard",
  props: {
    request: { type: Object, required: true },
    cardClass: { type: String, default: "" },
    confirmText: { type: String, default: null },
    title: { type: String, required: true },
    canShow: { type: Boolean, default: true },
    canShowCancelButton: { type: Boolean, default: false },
    requestType: { type: String, required: true },
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      currentUser: CURRENT_USER,
    }),
  },
  methods: {
    updateRequest(status, id) {
      if (this.confirmText && status === "Cancelled") {
        if (!confirm(this.confirmText)) {
          return;
        }
      }

      this.$emit("update-request", { status, id });
    },
    getBorderStyle(status) {
      switch (status) {
        case "Approved":
          return { textColor: "badge bg-success", borderColor: "border-success" };
        case "Rejected":
          return { textColor: "badge bg-secondary", borderColor: "border-secondary" };
        case "Cancelled": // добавляем для отменённых
          return { textColor: "badge bg-danger", borderColor: "border-danger" }; // ярко-красный
        case "Pending":
          return { textColor: "badge bg-warning", borderColor: "border-warning" };
        default:
          return { textColor: "badge bg-dark", borderColor: "border-dark" };
      }
    },
  },
};
</script>

<style scoped>
.card-body {
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="card h-100 shadow-sm mb-3">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span class="fw-bold">Заказ №{{ order.id }}</span>
      <span class="badge" :class="getStatusClass(order.status.code)">
        {{ order.status.name }}
      </span>
    </div>

    <div class="card-body" style="padding-bottom: 0px !important">
      <!-- Заказчик и пациент -->
      <p class="mb-1">
        <i class="bi bi-person"></i>
        Заказчик: {{ order.customer_name }}
      </p>
      <p class="mb-1">
        <i class="bi bi-person-fill"></i>
        Пациент: {{ order.patient_name }}
      </p>

      <!-- Комментарий -->
      <p v-if="order.description" class="mb-1">
        <i class="bi bi-chat-left-text"></i>
        {{ order.description }}
      </p>

      <!-- Типы работ -->
      <div>
        <strong>Типы работ:</strong>
        <ul class="list-unstyled ms-2">
          <li v-for="wt in order.work_types" :key="wt.id" class="mb-1">
            <i class="bi bi-tools"></i>
            {{ wt.work_type.name }} :
            <span class="text-muted">
              <!---(зубы: {{ parseTeeth(wt.teeth).join(", ") }}) -->
              <div class="teeth" style="display: inline-flex">
                <span
                  v-for="tooth in parseTeeth(wt.teeth)"
                  :key="tooth"
                  class="tooth"
                >
                  {{ tooth }}
                </span>
              </div>
            </span>
          </li>
        </ul>
      </div>

      <!-- Дата создания -->
      <p class="mb-1">
        <i class="bi bi-calendar"></i>
        Создан: {{ formatDate(order.created_at) }}
      </p>

      <!-- Срок исполнения -->
      <p class="mb-1 text-danger fw-bold">
        <i class="bi bi-hourglass-split"></i>
        Срок: {{ formatDate(order.expired_at) }}
      </p>
    </div>

    <div class="card-footer text-muted small">
      Создано пользователем: {{ order.created_user_id }}
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderCard",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    // форматирование даты
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
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
        case "InProgress":
          return "bg-warning text-dark";
        case "Done":
          return "bg-success";
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
.card {
  border-radius: 1rem;
}
.teeth {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tooth {
  font-size: 12px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>

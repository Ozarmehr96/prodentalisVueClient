<template>
  <div>
    <div class="d-flex align-items-center flex-wrap gap-2">
      <!-- Кнопки выбора периода -->
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn btn-outline-secondary"
          :class="{ active: filters.date_type === 'yesterday' }"
          @click="setDateType('yesterday')"
        >
          Вчера
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          :class="{ active: filters.date_type === 'today' }"
          @click="setDateType('today')"
        >
          Сегодня
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          :class="{ active: filters.date_type === 'week' }"
          @click="setDateType('week')"
        >
          Неделя
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          :class="{ active: filters.date_type === 'month' }"
          @click="setDateType('month')"
        >
          Месяц
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          :class="{ active: filters.date_type === 'period' }"
          @click="setDateType('period')"
        >
          Период
        </button>

        <!-- Поля для ручного выбора периода (справа от кнопок) -->
        <input
          v-if="filters.date_type === 'period'"
          type="date"
          class="form-control form-control-sm"
          style="width: auto"
          v-model="filters.date_from"
          @change="applyFilter"
        />
        <input
          v-if="filters.date_type === 'period'"
          type="date"
          class="form-control form-control-sm"
          style="width: auto"
          v-model="filters.date_to"
          @change="applyFilter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "DateFilterButtons",
  data() {
    return {
      filters: {
        date_type: "today",
        date_from: null,
        date_to: null,
      },
    };
  },
  mounted() {
    this.setDateType("today");
  },
  methods: {
    setDateType(type) {
      this.filters.date_type = type;

      const today = dayjs();
      let from = null;
      let to = null;

      if (type === "yesterday") {
        from = today.subtract(1, "day").format("YYYY-MM-DD");
        to = from;
      } else if (type === "today") {
        from = today.format("YYYY-MM-DD");
        to = from;
      } else if (type === "week") {
        from = today.startOf("week").format("YYYY-MM-DD");
        to = today.format("YYYY-MM-DD");
      } else if (type === "month") {
        from = today.startOf("month").format("YYYY-MM-DD");
        to = today.format("YYYY-MM-DD");
      } else if (type === "period") {
        this.filters.date_from = null;
        this.filters.date_to = null;
        return;
      }

      this.filters.date_from = from;
      this.filters.date_to = to;

      this.applyFilter();
    },
    applyFilter() {
      // если выбран период, но даты не заполнены — не фильтруем
      if (
        this.filters.date_type === "period" &&
        (!this.filters.date_from || !this.filters.date_to)
      ) {
        return;
      }
      this.$emit("onDateChanged", { ...this.filters });
    },
  },
};
</script>

<style scoped>
.btn-group .btn {
  border-radius: 0;
}
.btn-group .btn:first-child {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}
.btn-group .btn:last-child {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
.btn.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}
</style>

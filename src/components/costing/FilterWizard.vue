<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="row g-3">
        <!-- Фильтр по дате -->
        <div class="col-12 col-md-3" style="width: auto">
          <label class="form-label">
            {{ dateTitle }} ({{ $toDateFormat(filters.date_from) }} -
            {{ $toDateFormat(filters.date_to) }})
          </label>

          <DateFilter
            :initialDateType="initialDateType"
            ref="dateFilter"
            @onDateChanged="onDateChanged"
          />
        </div>

        <div class="col-12 col-md-3" style="width: auto" v-if="showStatus">
          <label class="form-label">Статус заказа</label>
          <div class="btn-group d-flex align-items-center flex-wrap" role="group">
            <button
              type="button"
              class="btn btn-outline-secondary"
              :class="{ active: filters.status == null }"
              @click="setStatus(null)"
            >
              Все
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              :class="{ active: filters.status === 'Created' }"
              @click="setStatus('Created')"
            >
              Созданные
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              :class="{ active: filters.status === 'Finished' }"
              @click="setStatus('Finished')"
            >
              Завершенные
            </button>
          </div>
        </div>
        <slot name="additional-filters"></slot>
        <!-- Сброс -->
        <div class="col-12 col-md-2 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            Сбросить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilter from "../../components/DateFilter.vue";

export default {
  components: {
    DateFilter,
  },
  props: {
    initialDateType: {
      type: String,
      default: "today",
    },
    dateTitle: {
      type: String,
      default: "",
    },
    showStatus: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      filters: {
        date_from: "",
        date_to: "",
        status: null,
      },
    };
  },

  methods: {
    onDateChanged(period) {
      this.filters.date_from = period.date_from;
      this.filters.date_to = period.date_to;

      // отправляем фильтры родителю
      this.$emit("onFilterChanged", this.filters);
    },

    clearFilters() {
      this.filters = {
        date_from: "",
        date_to: "",
        status: null,
      };

      // сбрасываем DateFilter
      this.$refs.dateFilter.setDateType(this.initialDateType);

      // this.$emit("onFilterChanged", this.filters);
    },
    setStatus(status) {
      this.filters.status = status;
      this.$emit("onFilterChanged", this.filters);
    },
  },
};
</script>
<style scoped>
.btn.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}
</style>

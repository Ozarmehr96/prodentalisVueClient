<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="row g-3">
        <!-- Фильтр по дате -->
        <div class="col-12 col-md-3" style="width: auto">
          <label class="form-label">
            Дата закупки ({{ $toDateFormat(filters.date_from) }} -
            {{ $toDateFormat(filters.date_to) }})
          </label>

          <DateFilter
            :initialDateType="initialDateType"
            ref="dateFilter"
            @onDateChanged="onDateChanged"
          />
        </div>

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
  },

  data() {
    return {
      filters: {
        date_from: "",
        date_to: "",
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
      };

      // сбрасываем DateFilter
      this.$refs.dateFilter.setDateType(this.initialDateType);

      this.$emit("onFilterChanged", this.filters);
    },
  },
};
</script>

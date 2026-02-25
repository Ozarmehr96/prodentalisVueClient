<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4 position-relative">
        <!-- Заголовок -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Экспорт финансового отчёта</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <!-- Выбор периода -->
        <div class="mb-3">
          <label class="form-label">Дата с</label>
          <input
            type="date"
            v-model="dateFrom"
            class="form-control"
            :disabled="isExporting"
          />
        </div>

        <div class="mb-4">
          <label class="form-label">Дата по</label>
          <input
            type="date"
            v-model="dateTo"
            class="form-control"
            :disabled="isExporting"
          />
        </div>

        <!-- Кнопки -->
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" @click="close" :disabled="isExporting">
            Отмена
          </button>
          <ButtonWithLoader
            @click="exportFinanceReport"
            type="submit"
            :isLoading="isExporting"
            title="Экспортировать"
            loadingText="Создаётся отчёт..."
            :isValid="isValid"
            :customClasses="['btn', isValid ? 'brand-style' : 'btn-outline-secondary']"
          />
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { mapActions, mapGetters } from "vuex";
import {
  EXPORT_FINANCE_REPORT,
  IS_LOADING_EXPORT_FINANCE_REPORT,
} from "../../store/types";
import ButtonWithLoader from "../ButtonWithLoader.vue";

export default {
  name: "FinanceExportModal",
  components: {
    ButtonWithLoader,
  },
  props: {
    show: Boolean,
  },
  data() {
    return {
      dateFrom: null,
      dateTo: null,
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.setDefaultPeriod();
      }
    },
  },
  computed: {
    ...mapGetters({
      isExporting: IS_LOADING_EXPORT_FINANCE_REPORT,
    }),
    isValid() {
      return this.dateFrom && this.dateTo;
    },
  },
  methods: {
    ...mapActions({
      exportFinanceReportAction: EXPORT_FINANCE_REPORT,
    }),
    close() {
      this.$emit("update:show", false);
    },

    setDefaultPeriod() {
      const now = dayjs();

      this.dateTo = now.date(27).format("YYYY-MM-DD");
      this.dateFrom = now.subtract(1, "month").date(27).format("YYYY-MM-DD");
    },
    async exportFinanceReport() {
      await this.exportFinanceReportAction({
        date_from: this.dateFrom,
        date_to: this.dateTo,
        callback: (fileName) => {
          this.close();
          this.$toast(`Финансовый отчёт успешно экспортирован \n'${fileName}'`, 10000);
        },
      });
    },
  },
};
</script>

<style scoped>
.modal {
  display: block;
  background: transparent;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
.modal-dialog {
  z-index: 1050;
}
</style>

<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4 position-relative">
        <!-- Заголовок -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Экспорт заказов по заказчикам</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <!-- Период в одной линии -->
        <div class="mb-4 d-flex flex-wrap gap-2">
          <div class="flex-grow-1">
            <label class="form-label">Дата с</label>
            <input
              type="date"
              v-model="dateFrom"
              class="form-control"
              :disabled="isExporting"
            />
          </div>

          <div class="flex-grow-1">
            <label class="form-label">Дата по</label>
            <input
              type="date"
              v-model="dateTo"
              class="form-control"
              :disabled="isExporting"
            />
          </div>
        </div>

        <!-- Статус toggle -->
        <div class="mb-4">
          <label class="form-label d-block">Статус</label>

          <!-- btn-group Bootstrap -->
          <div class="btn-group w-100" role="group" aria-label="Статусы">
            <button
              type="button"
              class="btn"
              :class="
                status === '' && status !== null ? 'btn-primary' : 'btn-outline-primary'
              "
              @click="status = ''"
            >
              Все
            </button>

            <button
              type="button"
              class="btn"
              :class="status === 'Finished' ? 'btn-primary' : 'btn-outline-primary'"
              @click="status = 'Finished'"
            >
              Завершенные
            </button>
          </div>
        </div>
        <!-- Кнопки -->
        <div class="d-flex justify-content-end gap-2">
          <button
            class="btn btn-outline-secondary"
            @click="close"
            :disabled="isExporting"
          >
            Отмена
          </button>

          <ButtonWithLoader
            @click="exportOrdersByCustomes"
            type="submit"
            :isLoading="isExporting"
            title="Экспортировать"
            loadingText="Создаётся отчёт..."
            :isValid="isValid"
            :customClasses="[
              'btn',
              isValid ? 'brand-style' : 'btn-outline-secondary disabled',
            ]"
          />
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  EXPORT_ORDERS_BY_CUSTOMERS,
  IS_LOADING_EXPORT_ORDERS_BY_CUSTOMERS,
} from "../../store/types";
import ButtonWithLoader from "../ButtonWithLoader.vue";
import { getDefaultPeriod } from "../../helpers/timeHelpers";

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
      status: null,
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.setDefaultPeriod();
        this.status = null;
      }
    },
  },
  computed: {
    ...mapGetters({
      isExporting: IS_LOADING_EXPORT_ORDERS_BY_CUSTOMERS,
    }),
    isValid() {
      return this.dateFrom && this.dateTo && this.status !== null;
    },
  },
  methods: {
    ...mapActions({
      exportAction: EXPORT_ORDERS_BY_CUSTOMERS,
    }),
    close() {
      this.$emit("update:show", false);
    },
    setDefaultPeriod() {
      let defaultPeriod = getDefaultPeriod();
      this.dateTo = defaultPeriod.date_to;
      this.dateFrom = defaultPeriod.date_from;
    },
    async exportOrdersByCustomes() {
      await this.exportAction({
        date_from: this.dateFrom,
        date_to: this.dateTo,
        status: this.status,
        callback: (fileName) => {
          this.close();
          this.$toast(`Отчет сформирован \n'${fileName}'`, 10000);
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

/* Toggle-style кнопки статуса */
.toggle-btn {
  flex: 1;
  border-radius: 6px;
  transition: all 0.2s;
}
.toggle-btn.active {
  background-color: #0d6efd; /* брендовый цвет */
  color: white;
  border-color: #0d6efd;
}
.toggle-btn:not(.active):hover {
  background-color: #e2e6ea;
}

/* Сделать input одинаковой высоты и красивым на мобильных */
input[type="date"].form-control {
  height: 38px;
}
</style>

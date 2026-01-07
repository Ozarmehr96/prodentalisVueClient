<template>
  <!-- Offcanvas (универсальный) -->
  <div
    :class="`offcanvas offcanvas-${position} half-width-offcanvas`"
    tabindex="-1"
    ref="offcanvasRef"
  >
    <div class="offcanvas-header">
      <h1 class="offcanvas-title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <button type="button" class="btn-close text-reset" @click="closePanel"></button>
    </div>
    <div class="offcanvas-body">
      <slot>
        <!-- Контент по умолчанию, если слот пустой -->
        Нет данных
      </slot>
    </div>

    <!-- Футер с кнопками -->
    <div class="p-3 d-flex flex-column flex-sm-row gap-2">
      <button type="button" class="btn btn-secondary w-100 w-sm-50" @click="clear">
        Очистить
      </button>
      <button
        type="button"
        class="btn btn-primary w-100 w-sm-50 brand-style"
        @click="onSaveChanged"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>
import { Offcanvas } from "bootstrap";
/**
 * Универсальный Sidepanel на Bootstrap Offcanvas
 *
 * @vue-prop {Boolean} isOpen - видимость панели
 * @vue-event close - закрытие панели
 */
export default {
  name: "UniversalSidepanel",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: "start", // 'start' или 'end'
    },
  },
  mounted() {
    // Инициализация Bootstrap Offcanvas
    this.bsOffcanvas = new Offcanvas(this.$refs.offcanvasRef, {
      backdrop: "static", // Отключает закрытие по клику на пустое место
      keyboard: false, // Отключает закрытие по Esc
    });
    if (this.isOpen) this.bsOffcanvas.show();

    // Слушаем событие закрытия панели
    this.$refs.offcanvasRef.addEventListener("hide.bs.offcanvas", () => {
      this.$emit("close");
    });
    this.$refs.offcanvasRef.addEventListener("show.bs.offcanvas", () => {
      this.$emit("onOpen");
    });
  },
  watch: {
    isOpen(newVal) {
      if (!this.bsOffcanvas) return;
      if (newVal) this.bsOffcanvas.show();
      else {
        this.bsOffcanvas.hide();
      }
    },
  },
  methods: {
    closePanel() {
      this.$emit("close");
    },
    clear() {
      this.$emit("clear");
    },
    onSaveChanged() {
      this.$emit("onSaveChanged");
    },
  },
};
</script>

<style scoped>
/* Можно добавить кастомные стили */
/* Задаём ширину 50% для offcanvas */
.half-width-offcanvas {
  width: 50% !important;
  max-width: 1200px !important;
}

/* Для мобильных можно вернуть 100% */
@media (max-width: 768px) {
  .half-width-offcanvas {
    width: 100% !important;
    max-width: 100% !important;
  }
}
</style>

<template>
  <!-- Offcanvas (универсальный) -->
  <div class="offcanvas offcanvas-end" tabindex="-1" ref="offcanvasRef">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">
        <slot name="title">{{ title }}</slot>
      </h5>
      <button
        type="button"
        class="btn-close text-reset"
        @click="closePanel"
      ></button>
    </div>
    <div class="offcanvas-body">
      <slot>
        <!-- Контент по умолчанию, если слот пустой -->
        Нет данных
      </slot>
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
  },
  mounted() {
    // Инициализация Bootstrap Offcanvas
    this.bsOffcanvas = new Offcanvas(this.$refs.offcanvasRef);
    if (this.isOpen) this.bsOffcanvas.show();

    // Слушаем событие закрытия панели
    this.$refs.offcanvasRef.addEventListener("hide.bs.offcanvas", () => {
      this.$emit("close");
    });
  },
  watch: {
    isOpen(newVal) {
      console.log("isOpen changed:", newVal);
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
      if (this.bsOffcanvas) this.bsOffcanvas.hide();
    },
  },
};
</script>

<style scoped>
/* Можно добавить кастомные стили */
</style>

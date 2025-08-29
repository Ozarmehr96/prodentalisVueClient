<template>
  <div
    class="position-fixed bottom-0 end-0 p-3"
    style="z-index: 1050;"
  >
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="`toast show bg-${t.type} text-white`"
      style="width: auto; max-width: 400px;"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header">
        <img
          src="../logo.svg"
          class="rounded me-2"
          alt="..."
          style="height: 20px; width: 20px"
        />
        <strong class="me-auto">{{ t.title || "Уведомление" }}</strong>
        <small>{{ t.time }}</small>
        <button
          type="button"
          class="btn-close btn-close-white"
          @click="removeToast(t.id)"
        ></button>
      </div>
      <div class="toast-body">{{ t.text }}</div>
    </div>
  </div>
</template>

<script>
let idCounter = 0;

export default {
  data() {
    return {
      toasts: [],
    };
  },
  methods: {
    // успешная операция
    //this.$toast("Сотрудник добавлен", "success");

    // ошибка
    //this.$toast("Ошибка при добавлении сотрудника", "danger");

    // предупреждение
    //this.$toast("Внимание! Проверьте данные", "warning");
    showToast(text, delay = 5000, type = 'success', title = '') {
      const id = idCounter++;
      const time = new Date().toLocaleTimeString();
      this.toasts.push({ id, text, type, delay, time, title });

      setTimeout(() => this.removeToast(id), Number(delay));
    },
    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
};
</script>

<style>
.toast {
  min-width: 250px;
  margin-bottom: 0.5rem;
}
</style>

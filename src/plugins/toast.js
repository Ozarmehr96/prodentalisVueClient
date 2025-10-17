import { createApp, h, ref } from "vue";
import ToastComponent from "../components/Toast.vue";

export default {
  install(app) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const toastRef = ref(null);

    const toastApp = createApp({
      render() {
        return h(ToastComponent, { ref: toastRef });
      },
    });

    toastApp.mount(container);

    app.config.globalProperties.$toast = (message, delay = 5000, type = 'success', title = '') => {
      if (toastRef.value) {
        toastRef.value.showToast(message, delay, type, title);
      } else {
        console.warn("Toast компонент не инициализирован");
      }
    };

    app.config.globalProperties.$toastError = (message, delay = 5000, title = '') => {
      if (toastRef.value) {
        toastRef.value.showToast(message, delay, 'danger', title);
      } else {
        console.warn("Toast компонент не инициализирован");
      }
    };
  },
};

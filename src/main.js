import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import ToastPlugin from "./plugins/toast";

import dayjs from "dayjs";
import "dayjs/locale/ru";

import "bootstrap/dist/css/bootstrap.min.css";
//import './assets/custom.bootstrap.scss'

import "bootstrap"; // JS (поппер + bootstrap bundle)

const app = createApp(App);

// Настраиваем локаль
dayjs.locale('ru')

// Глобальный метод
app.config.globalProperties.$toDateFormat = (d) => {
  const DATE_FORMAT = 'DD.MM.YYYY' 
  return dayjs(d).format(DATE_FORMAT)
};

app.config.globalProperties.$toDateTimeFormat = (d) => {
  const DATE_FORMAT = 'DD.MM.YYYY HH:mm' 
  return dayjs(d).format(DATE_FORMAT)
};

app.use(ToastPlugin).use(store).use(router).mount("#app");

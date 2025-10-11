// src/services/api.js
import axios from "axios";
import store from "../store";
import {baseURL} from "../services/constans.js";

import * as types from "../store/types";
import { getValueFromSessionStorage } from "../helpers/session-storage";
const api = axios.create({
  baseURL: baseURL, // твой IP и порт "https://localhost:5065/api/v1"
  timeout: -1, // времся выполнения запроса, то есть сколько времени будет ждать клиент
  //withCredentials: true
});

// Перехватчик перед запросом — добавляем токен
api.interceptors.request.use((config) => {
  const token = getValueFromSessionStorage("accessToken");
  if (token) {
    config.headers.Authorization = `${token}`;
  }

  return config;
});

// Перехватчик ошибок — ловим 401
api.interceptors.response.use(
  (response) => {
    const { dispatch } = store;
    const token = response.headers["access-token"];
    //const websocketToken = response.headers["websocket-token"];
    if (token && token.length > 1) {
     // const expires = response.headers["expires"];

      //if (websocketToken && websocketToken.length > 1) {
     //   dispatch(types.SET_WEBSOCKET_TOKEN, websocketToken);
    //  }

      dispatch(types.SET_ACCESS_TOKEN, token);
    }
    return response;
  },
  (error) => {
    const { dispatch } = store;

    const dateTime = Date.now();

    if (error.response && error.response.data && error.response.data.error) {
      dispatch(types.ADD_ERROR, {
        title: error.response.data.error,
        info: `
          ${error.response.status.toString().toUpperCase()} ошибка в запросе
          ${error.config.method.toUpperCase()} ${error.config.url}.
          Параметры: ${error.config.data}
        `,
        stack: JSON.stringify(error.response.data),
        dateTime,
      });
      alert(error.response.data.error);
    } else if (error && error.response && error.response.status) {
      dispatch(types.ADD_ERROR, {
        title: "Неизвестная ошибка сервера",
        info: `
          ${error.response.status.toString().toUpperCase()} ошибка в запросе
          ${error.config.method.toUpperCase()} ${error.config.url}.
          Параметры: ${error.config.data}
        `,
        stack: JSON.stringify(error.response.data),
        dateTime,
      });

      alert(`Ошибка ${error.response.status}. Попробуйте позднее`);
    } else if (error.config) {
      if (error.name === 'CanceledError') {
        console.warn("Запрос был отменен");
        return;
      }

      dispatch(types.ADD_ERROR, {
        title: "Неизвестная ошибка сервера",
        info: `
          Неизвестная ошибка в запросе
          ${error.config.method.toUpperCase()} ${error.config.url}.
          Параметры: ${error.config.data || JSON.stringify({})}
        `,
        stack:
          error.response && error.response.data
            ? JSON.stringify(error.response.data)
            : null,
        dateTime,
      });

      alert(
        `Ошибка соединения с сервером. Попробуйте перезапустить приложение`
      );
    }

    if (error.response && error.response.status === 401) {
    }

    // если вернулась ошибка, то это ошибка авторизации
    if (error.response && error.response.status === 401) {
      dispatch(types.LOGOUT);

      if (typeof window !== "undefined" && window.location.pathname !== "") {
        window.location.href = '/';
      }

      return;
    }

    return Promise.reject(error);
  }
);

export default api;

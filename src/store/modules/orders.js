import api from "../../services/api";
import * as types from "../types";

const state = {
  orders: [],
  order: null,
  isLoading: false,
  filters: {
    number: null,
    customer_name: null,
    created_from: null,
    created_to: null,
    status: "",
    date_type: "",
  },
};

let ordersController = null; // вне метода, чтобы хранить контроллер между вызовами

const mutations = {
  [types.MUTATE_ORDERS]: (state, orders) => (state.orders = orders),
  [types.MUTATE_ORDER]: (state, order) => (state.order = order),
  [types.MUTATE_ORDER_FILTERS]: (state, order) => (state.order = order),
  [types.MUTATE_IS_ORDER_LOADING]: (state, isLoading) =>
    (state.isLoading = isLoading),
};

const actions = {
  [types.CREATE_ORDER]: async ({ commit }, params) => {
    try {
      const response = await api.post("/orders", params);
      if (params.callback) {
        params.callback(response.data);
      }
      await commit(types.MUTATE_ORDERS, [...state.orders, response.data]);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
  [types.UPDATE_ORDER]: async ({ commit }, params) => {
    try {
      const response = await api.put(`/orders/${params.id}`, params);
      if (params.callback) {
        params.callback(response.data);
      }

      // обновляем список заказов
      await commit(
        types.MUTATE_ORDERS,
        state.orders.map((order) =>
          order.id === response.data.id ? response.data : order
        )
      );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
  [types.LOAD_ORDERS]: async ({ commit }, params) => {
    // Отменяем предыдущий, если есть
    if (ordersController) {
      ordersController.abort();
    }

    const controller = new AbortController(); // новый контроллер для этого запроса
    ordersController = controller;

    commit(types.MUTATE_ORDERS, []); // очищаем старые данные
    commit(types.MUTATE_IS_ORDER_LOADING, true);

    api
      .get("/orders", { params, signal: controller.signal })
      .then((response) => {
        // Проверяем, что этот запрос не был отменён другим новым
        if (ordersController === controller) {
          commit(types.MUTATE_ORDERS, response.data);
        }
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      })
      .finally(() => {
        // Сбрасываем контроллер только если это последний запрос
        if (ordersController === controller) {
          commit(types.MUTATE_IS_ORDER_LOADING, false);
          ordersController = null;
        }
      });
  },
  [types.LOAD_ORDERS_PAGED]: async ({ commit }, params) => {
    if (ordersController) {
      ordersController.abort();
    }

    const controller = new AbortController();
    ordersController = controller;
    commit(types.MUTATE_IS_ORDER_LOADING, true);

    try {
      if (params.page === 1) {
        await commit(types.MUTATE_ORDERS, []);
      }
      const response = await api.get(`/orders/page/${params.page}`, {
        params,
        signal: controller.signal,
      });

      if (ordersController === controller) {
        // commit(types.MUTATE_ORDERS, response.data.items);
        return response.data; // ⚡ важно — вернём в компонент
      }
    } catch (err) {
      if (err.name !== "CanceledError") console.error(err);
      throw err;
    } finally {
      if (ordersController === controller) {
        commit(types.MUTATE_IS_ORDER_LOADING, false);
        ordersController = null;
      }
    }
  },

  [types.LOAD_ORDER]: async ({ commit }, orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      await commit(types.MUTATE_ORDER, response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },

  [types.START_ORDER]: async ({ commit }, orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/start`);
      await commit(types.MUTATE_ORDER, response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },

  [types.DELETE_ORDER]: async ({ commit }, orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
    } catch (e) {
      console.error(e);
    }
  },

  [types.FINISH_ORDER]: async ({ commit }, orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/finish`);
      await commit(types.MUTATE_ORDER, response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },

  [types.SET_ORDER_FILTERS]: async ({ commit }, filter) => {
    await commit(types.MUTATE_ORDER_FILTERS, filter);
    return filter;
  },

  [types.SET_ORDER_LOADING]: async ({ commit }, isLoading) => {
    await commit(types.MUTATE_IS_ORDER_LOADING, isLoading);
  },
};

const getters = {
  [types.ORDERS]: (state) => state.orders,
  [types.ORDER]: (state) => state.order,
  [types.ORDER_FILTERS]: (state) => state.filters,
  [types.IS_ORDER_LOADING]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

import api from "../../services/api";
import * as types from "../types";

const state = {
  orders: [],
  order: null
};

const mutations = {
  [types.MUTATE_ORDERS]: (state, orders) => (state.orders = orders),
  [types.MUTATE_ORDER]: (state, order) => (state.order = order),
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
      await commit(types.MUTATE_ORDERS, state.orders.map(order => order.id === response.data.id ? response.data : order));
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
  [types.LOAD_ORDERS]: async ({ commit }) => {
    try {
      const response = await api.get("/orders");
      await commit(types.MUTATE_ORDERS, response.data);
      return response.data;
    } catch (e) {
      console.error(e);
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

  [types.FINISH_ORDER]: async ({ commit }, orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/finish`);
      await commit(types.MUTATE_ORDER, response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
};

const getters = {
  [types.ORDERS]: (state) => state.orders,
  [types.ORDER]: (state) => state.order,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

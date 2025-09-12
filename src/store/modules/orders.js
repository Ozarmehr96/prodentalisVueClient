import api from "../../services/api";
import * as types from "../types";

const state = {
  orders: [],
};

const mutations = {
  [types.MUTATE_ORDERS]: (state, orders) => (state.orders = orders),
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
  [types.LOAD_ORDERS]: async ({ commit }) => {
    try {
      const response = await api.get("/orders");
      await commit(types.MUTATE_ORDERS, response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
};

const getters = {
  [types.ORDERS]: (state) => state.orders,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

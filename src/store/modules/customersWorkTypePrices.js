import api from "../../services/api";
import { CUSTOMERS_WORK_TYPE_PRICES, IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, LOAD_CUSTOMERS_WORK_TYPE_PRICES, MUTATE_CUSTOMERS_WORK_TYPE_PRICES, MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, SAVE_CUSTOMERS_WORK_TYPE_PRICES, SET_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES } from "../types";

const state = {
  isLoading: false,
  customersWorkTypePrices: [],
};

const mutations = {
  [MUTATE_CUSTOMERS_WORK_TYPE_PRICES]: (state, customersWorkTypePrices) => (state.customersWorkTypePrices = customersWorkTypePrices),
  [MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES]: (state, isLoading) => (state.isLoading = isLoading),
};

const actions = {
  [SET_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES]: ({ commit }, isLoading) => {
    commit(MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, isLoading);
  },

  [LOAD_CUSTOMERS_WORK_TYPE_PRICES]: async ({ commit }) => {
    try {
      commit(MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, true);
      const response = await api.get("/customers-work-type-prices");
      commit(MUTATE_CUSTOMERS_WORK_TYPE_PRICES, response.data);
      commit(MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, false);
      return response.data;
    } catch (e) {
      console.error(e);
      commit(MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, false);
    }
  },

  [SAVE_CUSTOMERS_WORK_TYPE_PRICES]: async ({ commit, state }, params) => {
    try {
      commit(MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, true);
      const response = await api.post("/customers-work-type-prices", params);
      commit(MUTATE_CUSTOMERS_WORK_TYPE_PRICES, state.customersWorkTypePrices.concat([response.data]));
      commit(MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, false);
      if (params.callback) params.callback(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
      commit(MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES, false);
    }
  },
};

const getters = {
  [CUSTOMERS_WORK_TYPE_PRICES]: (state) => state.customersWorkTypePrices,
  [IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

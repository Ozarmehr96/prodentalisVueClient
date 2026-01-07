import api from "../../services/api";
import { CUSTOMER, CUSTOMERS, IS_CUSTOMERS_LOADING, LOAD_CUSTOMER, LOAD_CUSTOMERS, MUTATE_CUSTOMER, MUTATE_CUSTOMERS, MUTATE_IS_CUSTOMERS_LOADING, SAVE_CUSTOMER, SET_CUSTOMERS_IS_LOADING, UPDATE_CUSTOMER } from "../types";

const state = {
    isLoading: false,
    customers: [],
    customer: null,
};

const mutations = {
  [MUTATE_IS_CUSTOMERS_LOADING]: (state, isLoading) => (state.isLoading = isLoading),
  [MUTATE_CUSTOMERS]: (state, customers) => (state.customers = customers),
  [MUTATE_CUSTOMER]: (state, customer) => (state.customer = customer),
};

const actions = {
  [SET_CUSTOMERS_IS_LOADING]: ({ commit }, isLoading) => {
    commit(MUTATE_IS_CUSTOMERS_LOADING, isLoading);
  },

  [LOAD_CUSTOMER]: async ({ commit }, id) => {
    try {
      await commit(MUTATE_IS_CUSTOMERS_LOADING, true);
      const response = await api.get("/customers/" + id);
      await commit(MUTATE_CUSTOMER, response.data);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
    }
  },

  [LOAD_CUSTOMERS]: async ({ commit }) => {
    try {
      await commit(MUTATE_IS_CUSTOMERS_LOADING, true);
      const response = await api.get("/customers");
      await commit(MUTATE_CUSTOMERS, response.data);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
    }
  },

  [SAVE_CUSTOMER]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_CUSTOMERS_LOADING, true);
      const response = await api.post("/customers", params);
      await commit(MUTATE_CUSTOMERS, state.customers.concat([response.data]));
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
    }
  },

  [UPDATE_CUSTOMER]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_CUSTOMERS_LOADING, true);
      const response = await api.put("/roles/" + params.id, params);
      await commit(MUTATE_CUSTOMER, response.data);
      // Обновляем массив ролей
      const updatedRoles = state.roles.map(role =>
        role.id === response.data.id ? response.data : role
      );

      // Коммитим массив ролей
      commit(MUTATE_CUSTOMERS, updatedRoles);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
    }
  },

  [DELETE_ROLE]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_CUSTOMERS_LOADING, true);
      const response = await api.delete("/roles/" + params.id);
      await commit(MUTATE_ROLE, null);
      const roles = state.roles.filter((role) => role.id !== params.id);
      commit(MUTATE_CUSTOMERS, roles);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_CUSTOMERS_LOADING, false);
    }
  },
};

const getters = {
  [CUSTOMER]: (state) => state.customer,
  [CUSTOMERS]: (state) => state.customers,
  [IS_CUSTOMERS_LOADING]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

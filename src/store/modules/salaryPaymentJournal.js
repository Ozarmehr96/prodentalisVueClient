import api from "../../services/api";
import {
  LOAD_SALARY_PAYMENT_JOURNAL,
  SET_IS_SALARY_PAYMENT_JOURNALS_LOADING,
  DELETE_SALARY_PAYMENT_JOURNAL,
  SAVE_SALARY_PAYMENT_JOURNAL,
  UPDATE_SALARY_PAYMENT_JOURNAL,
  LOAD_SALARY_PAYMENT_TYPES,
  MUTATE_SALARY_PAYMENT_TYPES,
  MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING,
  SALARY_PAYMENT_TYPES,
  MUTATE_SALARY_PAYMENT_JOURNAL,
  SALARY_PAYMENT_JOURNAL,
  IS_SALARY_PAYMENT_JOURNALS_LOADING,
  LOAD_SALARY_PAYMENT_JOURNALS,
  MUTATE_SALARY_PAYMENT_JOURNALS,
  SALARY_PAYMENT_JOURNALS,
  LOAD_SALARY_TYPES,
  MUTATE_SALARY_TYPES,
  SALARY_TYPES,
  MUTATE_USERS_SALARY_STATS,
  USERS_SALARY_STATS,
  LOAD_USERS_SALARY_STATS,
} from "../types";

const state = {
  isLoading: false,
  salaryJournals: [],
  salaryJournal: [],
  salaryPaymentTypes: [],
  salaryTypes: [],
  usersSalaryStats: []
};

const mutations = {
  [MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING]: (state, isLoading) => (state.isLoading = isLoading),
  [MUTATE_SALARY_PAYMENT_JOURNALS]: (state, salaryJournals) => (state.salaryJournals = salaryJournals),
  [MUTATE_SALARY_PAYMENT_JOURNAL]: (state, salaryJournal) => (state.salaryJournal = salaryJournal),
  [MUTATE_SALARY_PAYMENT_TYPES]: (state, salaryPaymentTypes) => (state.salaryPaymentTypes = salaryPaymentTypes),
  [MUTATE_SALARY_TYPES]: (state, salaryTypes) => (state.salaryTypes = salaryTypes),
  [MUTATE_USERS_SALARY_STATS]: (state, usersSalaryStats) => (state.usersSalaryStats = usersSalaryStats),
};

const actions = {
  [SET_IS_SALARY_PAYMENT_JOURNALS_LOADING]: ({ commit }, isLoading) => {
    commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, isLoading);
  },

  [LOAD_SALARY_PAYMENT_JOURNALS]: async ({ commit }, params = {}) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.get(`/salary-payments`, { params });
      await commit(MUTATE_SALARY_PAYMENT_JOURNALS, response.data);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return [];
    }
  },

  [LOAD_SALARY_PAYMENT_JOURNAL]: async ({ commit }, id) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.get("/salary-payments/" + id);
      await commit(MUTATE_SALARY_PAYMENT_JOURNAL, response.data);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return null;
    }
  },

  [LOAD_SALARY_PAYMENT_TYPES]: async ({ commit }) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.get("/salary-payments/types");
      await commit(MUTATE_SALARY_PAYMENT_TYPES, response.data);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return null;
    }
  },

  [LOAD_SALARY_TYPES]: async ({ commit }) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.get("/salary-payments/salary-types");
      await commit(MUTATE_SALARY_TYPES, response.data);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return null;
    }
  },

  [SAVE_SALARY_PAYMENT_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.post("/salary-payments", params);
      await commit(MUTATE_SALARY_PAYMENT_JOURNAL, response.data);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      throw e;
    }
  },

  [UPDATE_SALARY_PAYMENT_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.put("/salary-payments/" + params.id, params);
      await commit(MUTATE_SALARY_PAYMENT_JOURNAL, response.data);
      const updated = state.salaryJournals.map((item) =>
        item.id === response.data.id ? response.data : item
      );
      commit(MUTATE_SALARY_PAYMENT_JOURNALS, updated);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      throw e;
    }
  },

  [DELETE_SALARY_PAYMENT_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.delete("/salary-payments/" + params.id);
      await commit(MUTATE_SALARY_PAYMENT_JOURNAL, null);
      const filtered = state.salaryJournals.filter((item) => item.id !== params.id);
      commit(MUTATE_SALARY_PAYMENT_JOURNALS, filtered);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      throw e;
    }
  },

  [LOAD_USERS_SALARY_STATS]: async ({ commit }, params = {}) => {
    try {
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.get(`/stats/users-salary-stats`, { params });
      await commit(MUTATE_USERS_SALARY_STATS, response.data);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_SALARY_PAYMENT_JOURNALS_LOADING, false);
      return [];
    }
  },
};

const getters = {
  [SALARY_PAYMENT_JOURNAL]: (state) => state.salaryJournal,
  [SALARY_PAYMENT_JOURNALS]: (state) => state.salaryJournals,
  [IS_SALARY_PAYMENT_JOURNALS_LOADING]: (state) => state.isLoading,
  [SALARY_PAYMENT_TYPES]: (state) => state.salaryPaymentTypes,
  [SALARY_TYPES]: (state) => state.salaryTypes,
  [USERS_SALARY_STATS]: (state) => state.usersSalaryStats,
};

export default {
  state,
  mutations,
  actions,
  getters,
};


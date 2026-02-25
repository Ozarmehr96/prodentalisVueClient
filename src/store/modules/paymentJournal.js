import api from "../../services/api";
import {
  PAYMENT_JOURNAL,
  PAYMENT_JOURNALS,
  DELETE_PAYMENT_JOURNAL,
  IS_PAYMENT_JOURNALS_LOADING,
  LOAD_PAYMENT_JOURNAL,
  LOAD_PAYMENT_JOURNALS,
  MUTATE_PAYMENT_JOURNAL,
  MUTATE_PAYMENT_JOURNALS,
  MUTATE_IS_PAYMENT_JOURNALS_LOADING,
  SAVE_PAYMENT_JOURNAL,
  SET_IS_PAYMENT_JOURNALS_LOADING,
  UPDATE_PAYMENT_JOURNAL,
} from "../types";

const state = {
  isLoading: false,
  paymentJournals: [],
  paymentJournal: null,
};

const mutations = {
  [MUTATE_IS_PAYMENT_JOURNALS_LOADING]: (state, isLoading) => (state.isLoading = isLoading),
  [MUTATE_PAYMENT_JOURNALS]: (state, paymentJournals) => (state.paymentJournals = paymentJournals),
  [MUTATE_PAYMENT_JOURNAL]: (state, paymentJournal) => (state.paymentJournal = paymentJournal),
};

const actions = {
  [SET_IS_PAYMENT_JOURNALS_LOADING]: ({ commit }, isLoading) => {
    commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, isLoading);
  },

  [LOAD_PAYMENT_JOURNALS]: async ({ commit }, filters = {}) => {
    try {
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.get(`/customers-payments`, {params: filters});
      await commit(MUTATE_PAYMENT_JOURNALS, response.data);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      return [];
    }
  },

  [LOAD_PAYMENT_JOURNAL]: async ({ commit }, id) => {
    try {
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.get("/customers-payments/" + id);
      await commit(MUTATE_PAYMENT_JOURNAL, response.data);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      return null;
    }
  },

  [SAVE_PAYMENT_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.post("/customers-payments", params);
      await commit(MUTATE_PAYMENT_JOURNALS, state.paymentJournals.concat([response.data]));
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      throw e;
    }
  },

  [UPDATE_PAYMENT_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.put("/customers-payments/" + params.id, params);
      await commit(MUTATE_PAYMENT_JOURNAL, response.data);
      // Обновляем массив платежей
      const updatedPayments = state.paymentJournals.map((payment) =>
        payment.id === response.data.id ? response.data : payment
      );
      commit(MUTATE_PAYMENT_JOURNALS, updatedPayments);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      throw e;
    }
  },

  [DELETE_PAYMENT_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, true);
      const response = await api.delete("/customers-payments/" + params.id);
      await commit(MUTATE_PAYMENT_JOURNAL, null);
      const payments = state.paymentJournals.filter((payment) => payment.id !== params.id);
      commit(MUTATE_PAYMENT_JOURNALS, payments);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PAYMENT_JOURNALS_LOADING, false);
      throw e;
    }
  },
};

const getters = {
  [PAYMENT_JOURNAL]: (state) => state.paymentJournal,
  [PAYMENT_JOURNALS]: (state) => state.paymentJournals,
  [IS_PAYMENT_JOURNALS_LOADING]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

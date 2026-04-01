import api from "../../services/api";
import {
  PURCHASE_JOURNAL,
  PURCHASE_JOURNALS,
  DELETE_PURCHASE_JOURNAL,
  IS_PURCHASE_JOURNALS_LOADING,
  LOAD_PURCHASE_JOURNAL,
  LOAD_PURCHASE_JOURNALS,
  MUTATE_PURCHASE_JOURNAL,
  MUTATE_PURCHASE_JOURNALS,
  MUTATE_IS_PURCHASE_JOURNALS_LOADING,
  SAVE_PURCHASE_JOURNAL,
  SET_IS_PURCHASE_JOURNALS_LOADING,
  UPDATE_PURCHASE_JOURNAL,
  LOAD_MATERIALS_PURCHASES_SUMMARY,
} from "../types";

const state = {
  isLoading: false,
  purchaseJournals: [],
  purchaseJournal: null,
};

const mutations = {
  [MUTATE_IS_PURCHASE_JOURNALS_LOADING]: (state, isLoading) => (state.isLoading = isLoading),
  [MUTATE_PURCHASE_JOURNALS]: (state, purchaseJournals) => (state.purchaseJournals = purchaseJournals),
  [MUTATE_PURCHASE_JOURNAL]: (state, purchaseJournal) => (state.purchaseJournal = purchaseJournal),
};

const actions = {
  [SET_IS_PURCHASE_JOURNALS_LOADING]: ({ commit }, isLoading) => {
    commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, isLoading);
  },

  [LOAD_PURCHASE_JOURNALS]: async ({ commit }, filters = {}) => {
    try {
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, true);
      const response = await api.get("/material-purchases", { params: filters });
      await commit(MUTATE_PURCHASE_JOURNALS, response.data);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      return [];
    }
  },

  [LOAD_PURCHASE_JOURNAL]: async ({ commit }, id) => {
    try {
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, true);
      const response = await api.get("/material-purchases/" + id);
      await commit(MUTATE_PURCHASE_JOURNAL, response.data);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      return null;
    }
  },

  [LOAD_MATERIALS_PURCHASES_SUMMARY]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, true);
      const response = await api.get("/material-purchases/summary", { params });
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      return null;
    }
  },

  [SAVE_PURCHASE_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, true);
      const response = await api.post("/material-purchases", params);
      await commit(MUTATE_PURCHASE_JOURNALS, state.purchaseJournals.concat([response.data]));
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      throw e;
    }
  },

  [UPDATE_PURCHASE_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, true);
      const response = await api.put("/material-purchases/" + params.id, params);
      await commit(MUTATE_PURCHASE_JOURNAL, response.data);
      const updatedPurchases = state.purchaseJournals.map((purchase) =>
        purchase.id === response.data.id ? response.data : purchase
      );
      commit(MUTATE_PURCHASE_JOURNALS, updatedPurchases);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      throw e;
    }
  },

  [DELETE_PURCHASE_JOURNAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, true);
      const response = await api.delete("/material-purchases/" + params.id);
      await commit(MUTATE_PURCHASE_JOURNAL, null);
      const purchases = state.purchaseJournals.filter((purchase) => purchase.id !== params.id);
      commit(MUTATE_PURCHASE_JOURNALS, purchases);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_PURCHASE_JOURNALS_LOADING, false);
      throw e;
    }
  },
};

const getters = {
  [PURCHASE_JOURNAL]: (state) => state.purchaseJournal,
  [PURCHASE_JOURNALS]: (state) => state.purchaseJournals,
  [IS_PURCHASE_JOURNALS_LOADING]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

import api from "../../services/api";
import { LABS, LOAD_LAB, LOAD_LABS, MUTATE_LABS, SAVE_LAB, UPDATE_LAB } from "../types";

const state = {
 labs: [],
};

const mutations = {
 [MUTATE_LABS]: (state, labs) => (state.labs = labs),
};

const actions = {
 [LOAD_LABS]: async ({ commit }) => {
  try {
   const response = await api.get(`/labs`);
   commit(MUTATE_LABS, response.data);
   return response.data;
  } catch (e) {
   console.error(e);
  }
 },

 [LOAD_LAB]: async ({ commit }, labId) => {
  try {
   const response = await api.get(`/labs/${labId}`);
   return response.data;
  } catch (e) {
   console.error(e);
  }
 },

 [SAVE_LAB]: async ({ commit }, params) => {
  try {
   const response = await api.post(`/labs`, params);
   if (params.hasOwnProperty("callback")) {
    params.callback(response.data);
   }
   return response.data;
  } catch (e) {
   console.error(e);
  }
 },

 [UPDATE_LAB]: async ({ commit }, params) => {
  try {
   const response = await api.put(`/labs/${params.id}`, params);
   if (params.hasOwnProperty("callback")) {
    params.callback(response.data);
   }
   return response.data;
  } catch (e) {
   console.error(e);
  }
 },
};

const getters = {
 [LABS]: (state) => state.labs,
};

export default {
 state,
 mutations,
 actions,
 getters,
};

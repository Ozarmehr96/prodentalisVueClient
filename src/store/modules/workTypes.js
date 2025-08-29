import api from "../../services/api";
import * as types from "../types";

const state = {
  selectedWorkTypeSteps: [],
};

const mutations = {
  [types.MUTATE_SELECTED_WORK_TYPE_STEPS]: (state, selectedWorkTypeSteps) => {
    state.selectedWorkTypeSteps = selectedWorkTypeSteps;
  },
};

const actions = {
  [types.SET_SELECTED_WORK_TYPE_STEPS]: ({ commit, state }, workTypeStep) => {
    commit(types.MUTATE_SELECTED_WORK_TYPE_STEPS, workTypeStep);
  },

  [types.SAVE_WORK_TYPE]: async ({}, params) => {
    try {
      let response = await api.post("/work-types", params);
      params.callback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving work type:", error);
    }
  },

  [types.UPDATE_WORK_TYPE]: async ({}, params) => {
    try {
      let response = await api.put("/work-types/" + params.id, params);
      params.callback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating work type:", error);
    }
  },

  [types.LOAD_WORK_TYPES]: async ({}) => {
    try {
      let response = await api.get("/work-types");
      return response.data;
    } catch (error) {
      console.error("Error loading work types:", error);
    }
  },

  [types.LOAD_WORK_TYPE]: async ({}, id) => {
    try {
      let response = await api.get("/work-types/" + id);
      return response.data;
    } catch (error) {
      console.error("Error loading work type:", error);
    }
  },
};

const getters = {
  [types.SELECTED_WORK_TYPE_STEPS]: (state) => state.selectedWorkTypeSteps,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

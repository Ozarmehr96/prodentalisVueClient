import api from "../../services/api";
import {
  DELETE_WORK_TYPE,
  LOAD_WORK_TYPE,
  LOAD_WORK_TYPES,
  MUTATE_SELECTED_WORK_TYPE_STEPS,
  MUTATE_WORK_TYPES,
  SAVE_WORK_TYPE,
  SELECTED_WORK_TYPE_STEPS,
  SET_SELECTED_WORK_TYPE_STEPS,
  UPDATE_WORK_TYPE,
  WORK_TYPES,
} from "../types";

const state = {
  selectedWorkTypeSteps: [],
  workTypes: [],
};

const mutations = {
  [MUTATE_SELECTED_WORK_TYPE_STEPS]: (state, selectedWorkTypeSteps) => {
    state.selectedWorkTypeSteps = selectedWorkTypeSteps;
  },
  [MUTATE_WORK_TYPES]: (state, workTypes) => {
    state.workTypes = workTypes;
  },
};

const actions = {
  [SET_SELECTED_WORK_TYPE_STEPS]: ({ commit, state }, workTypeStep) => {
    commit(MUTATE_SELECTED_WORK_TYPE_STEPS, workTypeStep);
  },

  [SAVE_WORK_TYPE]: async ({}, params) => {
    try {
      let response = await api.post("/work-types", params.formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      params.callback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving work type:", error);
    }
  },

  [UPDATE_WORK_TYPE]: async ({}, params) => {
    try {
      let response = await api.put("/work-types/" + params.id, params.formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      params.callback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating work type:", error);
    }
  },

  [DELETE_WORK_TYPE]: async ({}, id) => {
    try {
      let response = await api.delete("/work-types/" + id);
      return response.data;
    } catch (error) {
      console.error("Error deleting work type:", error);
    }
  },

  [LOAD_WORK_TYPES]: async ({ commit }) => {
    try {
      let response = await api.get("/work-types");
      commit(MUTATE_WORK_TYPES, response.data);
      return response.data;
    } catch (error) {
      console.error("Error loading work types:", error);
    }
  },

  [LOAD_WORK_TYPE]: async ({}, id) => {
    try {
      let response = await api.get("/work-types/" + id);
      return response.data;
    } catch (error) {
      console.error("Error loading work type:", error);
    }
  },
};

const getters = {
  [SELECTED_WORK_TYPE_STEPS]: (state) => state.selectedWorkTypeSteps,
  [WORK_TYPES]: (state) => state.workTypes,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

import api from "../../services/api";
import {
  DELETE_WORK_STEP,
  LOAD_WORK_STEP,
  LOAD_WORK_STEPS,
  MUTATE_WORK_STEPS,
  SAVE_WORK_STEP,
  SAVE_WORK_STEP_PRIORITY,
  UPDATE_WORK_STEP,
  WORK_STEPS,
} from "../types";

const state = {
  steps: [],
};

const mutations = {
  [MUTATE_WORK_STEPS] : (state, workSteps) => {
    state.steps = workSteps;
  }
};

const actions = {
  [SAVE_WORK_STEP]: async ({}, params) => {
    try {
      let response = await api.post("/work-steps", params);
      params.callback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving work step:", error);
    }
  },
  [UPDATE_WORK_STEP]: async ({}, params) => {
    try {
      let response = await api.put(`/work-steps/${params.id}`, params);
      params.callback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating work step:", error);
    }
  },
  [DELETE_WORK_STEP]: async ({}, id) => {
    try {
      let response = await api.delete(`/work-steps/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting work step:", error);
    }
  },
  [SAVE_WORK_STEP_PRIORITY]: async ({}, params) => {
    try {
      let response = await api.post(`/work-steps/priorities`, params);
      params.callback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving work step priority:", error);
    }
  },
  [LOAD_WORK_STEPS]: async ({commit}) => {
    try {
      let response = await api.get("/work-steps");
      commit(MUTATE_WORK_STEPS, response.data);
      return response.data;
    } catch (error) {
      console.error("Error loading work steps:", error);
    }
  },
  [LOAD_WORK_STEP]: async ({}, id) => {
    try {
      let response = await api.get(`/work-steps/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error loading work step:", error);
    }
  },
};

const getters = {
  [WORK_STEPS]: (state) => state.steps,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

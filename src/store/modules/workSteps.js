import api from "../../services/api";
import {
  DELETE_WORK_STEP,
  LOAD_WORK_STEP,
  LOAD_WORK_STEPS,
  SAVE_WORK_STEP,
  UPDATE_WORK_STEP,
} from "../types";

const state = {};

const mutations = {};

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
  [LOAD_WORK_STEPS]: async ({}) => {
    try {
      let response = await api.get("/work-steps");
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

const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};

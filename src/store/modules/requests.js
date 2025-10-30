import { INVOKE_USER_REQUEST, LOAD_ACTIVE_REQUEST_BY_TYPE, LOAD_REQUESTS } from "../types";
import api from "../../services/api";
const state = {};

const mutations = {};

const actions = {
  [LOAD_REQUESTS]: async ({ commit }, params) => {
    try {
      const response = await api.get("/requests");
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },

  [INVOKE_USER_REQUEST]: async ({ commit }, params) => {
    try {
      const response = await api.put(`/requests/${params.id}`, params);
      params.callback(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },

  [LOAD_ACTIVE_REQUEST_BY_TYPE]: async ({ }, {requestType, objectId}) => {
    try {
      const response = await api.get(`/requests/type/${requestType}/${objectId}`);
      return response.data;
    } catch (e) {
      console.error(e);
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

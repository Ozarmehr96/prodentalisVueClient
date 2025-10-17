import {
  ADD_USER,
  MUTATE_ROLES,
  ROLES,
  LOAD_ROLES,
  LOAD_USERS,
  LOAD_USER,
  MUTATE_LOADED_USER,
  LOADED_USER,
  UPDATE_USER,
  DELETE_USER,
} from "../types";
import api from "../../services/api";

const state = {
  roles: [],
  user: null
};

const mutations = {
  [MUTATE_ROLES]: (state, roles) => (state.roles = roles),
  [MUTATE_LOADED_USER]: (state, user) => (state.user = user),
};

const actions = {
  [ADD_USER]: async ({ commit }, params) => {
    try {
      const response = await api.post("/users", params);
      console.log(response);
      console.log(response);

      params.callback(response.data);
    } catch (e) {
      console.error(e);
    }
  },
  
  [UPDATE_USER]: async ({ commit }, params) => {
    try {
      const response = await api.put("/users/" + params.id, params);
      params.callback(response.data);
    } catch (e) {
      console.error(e);
    }
  },
  
  [DELETE_USER]: async ({ commit }, userId) => {
    try {
      const response = await api.delete("/users/" + userId);
      params.callback(response.data);
    } catch (e) {
      console.error(e);
    }
  },

  [LOAD_ROLES]: async ({ commit }) => {
    try {
      const response = await api.get("/users/roles");
      await commit(MUTATE_ROLES, response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },

  [LOAD_USERS]: async ({ commit }) => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },

  [LOAD_USER]: async ({ commit }, userId) => {
    try {
      const response = await api.get("/users/" + userId);
      await commit(MUTATE_LOADED_USER, response.data)
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
};

const getters = {
  [ROLES]: (state) => state.roles,
  [LOADED_USER]: (state) => state.user,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

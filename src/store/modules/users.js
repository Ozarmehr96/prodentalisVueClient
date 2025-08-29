import {
  ADD_USER,
  MUTATE_ROLES,
  ROLES,
  LOAD_ROLES,
  LOAD_USERS,
} from "../types";
import api from "../../services/api";

const state = {
  roles: [],
};

const mutations = {
  [MUTATE_ROLES]: (state, roles) => (state.roles = roles),
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
};

const getters = {
  [ROLES]: (state) => state.roles,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

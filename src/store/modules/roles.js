import api from "../../services/api";
import {
  DELETE_ROLE,
  IS_ROLES_LOADING,
  LOAD_ROLE,
  LOAD_ROLES,
  MUTATE_IS_ROLES_LOADING,
  MUTATE_ROLE,
  MUTATE_ROLES,
  ROLES,
  SAVE_ROLE,
  SET_IS_ROLES_LOADING,
  UPDATE_ROLE,
} from "../types";

const state = {
  isLoading: false,
  roles: [],
  role: null,
};

const mutations = {
  [MUTATE_IS_ROLES_LOADING]: (state, isLoading) => (state.isLoading = isLoading),
  [MUTATE_ROLE]: (state, role) => (state.role = role),
  [MUTATE_ROLES]: (state, roles) => (state.roles = roles),
};

const actions = {
  [SET_IS_ROLES_LOADING]: ({ commit }, isLoading) => {
    commit(types.MUTATE_IS_ROLES_LOADING, isLoading);
  },

  [LOAD_ROLE]: async ({ commit }, roleId) => {
    try {
      await commit(MUTATE_IS_ROLES_LOADING, true);
      const response = await api.get("/roles/" + roleId);
      await commit(MUTATE_ROLE, response.data);
      await commit(MUTATE_IS_ROLES_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_ROLES_LOADING, false);
    }
  },

  [LOAD_ROLES]: async ({ commit }) => {
    try {
      await commit(MUTATE_IS_ROLES_LOADING, true);
      const response = await api.get("/roles");
      await commit(MUTATE_ROLES, response.data);
      await commit(MUTATE_IS_ROLES_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_ROLES_LOADING, false);
    }
  },

  [SAVE_ROLE]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_ROLES_LOADING, true);
      const response = await api.post("/roles", params);
      await commit(MUTATE_ROLES, state.roles.concat([response.data]));
      await commit(MUTATE_IS_ROLES_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_ROLES_LOADING, false);
    }
  },

  [UPDATE_ROLE]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_ROLES_LOADING, true);
      const response = await api.put("/roles/" + params.id, params);
      await commit(MUTATE_ROLE, response.data);
      // Обновляем массив ролей
      const updatedRoles = state.roles.map(role =>
        role.id === response.data.id ? response.data : role
      );

      // Коммитим массив ролей
      commit(MUTATE_ROLES, updatedRoles);
      await commit(MUTATE_IS_ROLES_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_ROLES_LOADING, false);
    }
  },

  [DELETE_ROLE]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_ROLES_LOADING, true);
      const response = await api.delete("/roles/" + params.id);
      await commit(MUTATE_ROLE, null);
      const roles = state.roles.filter((role) => role.id !== params.id);
      commit(MUTATE_ROLES, roles);
      await commit(MUTATE_IS_ROLES_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_ROLES_LOADING, false);
    }
  },
};

const getters = {
  [ROLES]: (state) => state.roles,
  [IS_ROLES_LOADING]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

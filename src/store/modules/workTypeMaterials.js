import api from "../../services/api";
import { IS_WORK_TYPE_MATERIALS_LOADING, LOAD_WORK_TYPE_MATERIAL, LOAD_WORK_TYPE_MATERIALS, MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, MUTATE_WORK_TYPE_MATERIAL, MUTATE_WORK_TYPE_MATERIALS, SAVE_WORK_TYPE_MATERIAL, SET_IS_WORK_TYPE_MATERIALS_LOADING, WORK_TYPE_MATERIAL, WORK_TYPE_MATERIALS } from "../types";

const state = {
  workTypeMaterial: null,
  workTypeMaterials: [],
  isLoading: false,
};

const mutations = {
  [MUTATE_WORK_TYPE_MATERIALS]: (state, workTypeMaterials) => (state.workTypeMaterials = workTypeMaterials),
  [MUTATE_WORK_TYPE_MATERIAL]: (state, workTypeMaterial) => (state.workTypeMaterial = workTypeMaterial),
  [MUTATE_IS_WORK_TYPE_MATERIALS_LOADING]: (state, isLoading) => (state.isLoading = isLoading),
};

const actions = {
  [SET_IS_WORK_TYPE_MATERIALS_LOADING]: ({ commit }, isLoading) => {
    commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, isLoading);
  },

  [LOAD_WORK_TYPE_MATERIALS]: async ({ commit }) => {
    try {
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, true);
      const response = await api.get("/work-types-materials");
      commit(MUTATE_WORK_TYPE_MATERIALS, response.data);
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, false);
    }
  },

  [LOAD_WORK_TYPE_MATERIAL]: async ({ commit }, id) => {
    try {
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, true);
      const response = await api.get(`/work-types-materials/${id}`);
      commit(MUTATE_WORK_TYPE_MATERIAL, response.data);
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, false);
    }
  },

  [SAVE_WORK_TYPE_MATERIAL]: async ({ commit, state }, params) => {
    try {
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, true);
      const response = await api.post("/work-types-materials/" + params.workTypeId, params);
      commit(MUTATE_WORK_TYPE_MATERIALS, state.workTypeMaterials.concat([response.data]));
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, false);
      if (params.callback) params.callback(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
      commit(MUTATE_IS_WORK_TYPE_MATERIALS_LOADING, false);
    }
  },
};

const getters = {
  [WORK_TYPE_MATERIAL]: (state) => state.workTypeMaterial,
  [WORK_TYPE_MATERIALS]: (state) => state.workTypeMaterials,
  [IS_WORK_TYPE_MATERIALS_LOADING]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

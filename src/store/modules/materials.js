import api from "../../services/api";
import {
  DELETE_MATERIAL,
  IS_MATERIALS_LOADING,
  LOAD_MATERIAL,
  LOAD_MATERIALS,
  MATERIAL,
  MATERIALS,
  MUTATE_IS_MATERIALS_LOADING,
  MUTATE_MATERIAL,
  MUTATE_MATERIALS,
  SAVE_MATERIAL,
  SET_IS_MATERIALS_LOADING,
  UPDATE_MATERIAL,
} from "../types";

const state = {
  material: null,
  materials: [],
  isLoading: false,
};

const mutations = {
  [MUTATE_MATERIALS]: (state, materials) => (state.materials = materials),
  [MUTATE_MATERIAL]: (state, material) => (state.material = material),
  [MUTATE_IS_MATERIALS_LOADING]: (state, isLoading) =>
    (state.isLoading = isLoading),
};

const actions = {
  [SET_IS_MATERIALS_LOADING]: ({ commit }, isLoading) => {
    commit(MUTATE_IS_MATERIALS_LOADING, isLoading);
  },

  [LOAD_MATERIALS]: async ({ commit }) => {
    try {
      await commit(MUTATE_IS_MATERIALS_LOADING, true);
      const response = await api.get("/materials");
      await commit(MUTATE_MATERIALS, response.data);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
    }
  },

  [LOAD_MATERIAL]: async ({ commit }, id) => {
    try {
      await commit(MUTATE_IS_MATERIALS_LOADING, true);
      const response = await api.get(`/materials/${id}`);
      await commit(MUTATE_MATERIAL, response.data);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
    }
  },

  [SAVE_MATERIAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_MATERIALS_LOADING, true);
      const response = await api.post("/materials", params);
      await commit(MUTATE_MATERIALS, state.materials.concat([response.data]));
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
    }
  },

  [UPDATE_MATERIAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_MATERIALS_LOADING, true);
      const response = await api.put("/materials/" + params.id, params);
      await commit(MUTATE_MATERIAL, response.data);
      // Обновляем массив материалов
      const updatedMaterials = state.materials.map(material =>
        material.id === response.data.id ? response.data : material
      );

      // Коммитим массив материалов
      commit(MUTATE_MATERIALS, updatedMaterials);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
    }
  },

  [DELETE_MATERIAL]: async ({ commit }, params) => {
    try {
      await commit(MUTATE_IS_MATERIALS_LOADING, true);
      const response = await api.delete("/materials/" + params.id);
      await commit(MUTATE_MATERIAL, null);
      const materials = state.materials.filter((material) => material.id !== params.id);
      commit(MUTATE_MATERIALS, materials);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
      if (params.callback) {
        params.callback(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      await commit(MUTATE_IS_MATERIALS_LOADING, false);
    }
  },
};

const getters = {
  [MATERIAL]: (state) => state.material,
  [MATERIALS]: (state) => state.materials,
  [IS_MATERIALS_LOADING]: (state) => state.isLoading,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

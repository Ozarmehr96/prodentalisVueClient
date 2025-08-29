import * as types from "../types";

const state = {
};

const mutations = {
  [types.MUTATE_ACCESS_TOKEN]: (state, accessToken) => (state.accessToken = accessToken),
};

const actions = {
  [types.SET_ACCESS_TOKEN]: ({ commit }, accessToken) => {
    commit(types.MUTATE_ACCESS_TOKEN, accessToken);
  },
};

const getters = {
  [types.ACCESS_TOKEN]: (state) => state.accessToken,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

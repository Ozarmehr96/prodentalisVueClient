import * as types from '../types';

const state = {
  errors: [],
  showed: false,
};

const getters = {
  [types.ERRORS]: state => state.errors,
  [types.ERRORS_SHOWED]: state => state.showed,
};

const mutations = {
  [types.MUTATE_ADD_ERROR]: (state, error) => state.errors.push(error),
  [types.MUTATE_SHOWED]: (state, showed) => state.showed = showed,
};

const actions = {
  [types.ADD_ERROR]: ({ commit }, { title, info, stack, dateTime }) => {
    commit(types.MUTATE_ADD_ERROR, { title, info, stack, dateTime });
  },
  [types.TOGGLE_ERRORS]: ({ commit }, showed) => {
    commit(types.MUTATE_SHOWED, showed);
  },
  [types.SHOW_ERRORS]: ({ dispatch }) => {
    dispatch(types.TOGGLE_ERRORS, true);
  },
  [types.HIDE_ERRORS]: ({ dispatch }) => {
    dispatch(types.TOGGLE_ERRORS, false);
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}

import {
  MUTATE_ORDER_SELECTED_TEETH,
  MUTATE_SELECTED_TOOTH,
  ORDER_SELECTED_TEETH,
  SELECTED_TOOTH,
  SET_ORDER_SELECTED_TEETH,
  SET_SELECTED_TOOTH,
} from "../types";

const state = {
  selectedTooth: {
    id: null,
    isSelected: false,
  },
  orderSelectedTeeth: [],
};

const mutations = {
  [MUTATE_SELECTED_TOOTH]: (state, selectedTooth) =>
    (state.selectedTooth = selectedTooth),
  [MUTATE_ORDER_SELECTED_TEETH]: (state, newOrderSelectedTeeth) =>
    (state.orderSelectedTeeth = newOrderSelectedTeeth),
};

const actions = {
  [SET_SELECTED_TOOTH]: ({ commit }, selectedTooth) => {
    commit(MUTATE_SELECTED_TOOTH, selectedTooth);
  },
  [SET_ORDER_SELECTED_TEETH]: ({ commit }, newOrderSelectedTeeth) => {
    commit(MUTATE_ORDER_SELECTED_TEETH, newOrderSelectedTeeth);
  },
};

const getters = {
  [SELECTED_TOOTH]: (state) => state.selectedTooth,
  [ORDER_SELECTED_TEETH]: (state) => state.orderSelectedTeeth,
};

export default {
  state,
  mutations,
  actions,
  getters,
};

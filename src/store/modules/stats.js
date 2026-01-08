import api from "../../services/api";
import {
 IS_STATS_LOADING,
 LOAD_USER_STAT,
 MUTATE_IS_STATS_LOADING,
 MUTATE_USER_STAT,
 USER_STAT,
} from "../types";

const state = {
 userStat: {
  money: 0,
  total_elapsed_time: 0,
  total_tasks_completed: 0,
 },
 isLoading: false,
};

const mutations = {
 [MUTATE_USER_STAT]: (state, userStat) => (state.userStat = userStat),
 [MUTATE_IS_STATS_LOADING]: (state, isLoading) => (state.isLoading = isLoading),
};

const actions = {
 [LOAD_USER_STAT]: async ({ commit }, params) => {
  try {
   await commit(MUTATE_IS_STATS_LOADING, true);
   const response = await api.get("/stats", {params});
   await commit(MUTATE_USER_STAT, response.data);
   await commit(MUTATE_IS_STATS_LOADING, false);
   return response.data;
  } catch (e) {
   console.error(e);
   await commit(MUTATE_IS_STATS_LOADING, false);
  }
 },
};

const getters = {
 [USER_STAT]: (state) => state.userStat,
 [IS_STATS_LOADING]: (state) => state.isLoading,
};

export default {
 state,
 mutations,
 actions,
 getters,
};

import api from "../../services/api";
import * as types from "../types";

import {
  deleteValueFromSessionStorage,
  getObjectFromSessionStorage,
  getValueFromSessionStorage,
  setObjectToSessionStorage,
  setValueToSessionStorage,
} from "../../helpers/session-storage";

const state = {
  websocketToken: "",
  accessToken: "",
  accessTokenExpires: 0,
  currentUser: {},
};

const mutations = {
  [types.MUTATE_ACCESS_TOKEN]: (state, accessToken) =>
    (state.accessToken = accessToken),
  [types.MUTATE_CURRENT_USER]: (state, currentUser) =>
    (state.currentUser = currentUser),
};

const actions = {
  [types.SET_ACCESS_TOKEN]: ({ commit }, accessToken) => {
    if (typeof sessionStorage === "undefined") return;
    setValueToSessionStorage("accessToken", accessToken);
    commit(types.MUTATE_ACCESS_TOKEN, accessToken);
  },
  [types.SET_CURRENT_USER]: ({ commit }, currentUser) => {
    if (Object.keys(currentUser).length > 0) {
      console.log("currentUser", currentUser);
      setObjectToSessionStorage("currentUser", currentUser);
    } else {
      deleteValueFromSessionStorage("currentUser");
    }

    commit(types.MUTATE_CURRENT_USER, currentUser);
  },
  [types.LOGIN]: async ({ commit, dispatch }, params) => {
    try {
      const response = await api.post("/auth", {
        login: params.login,
        pass: params.pass,
      });

      await dispatch(types.SET_CURRENT_USER, response.data);

      params.callback(response.data);
    } catch (error) {
      console.error(error);
    }
  },
  [types.LOGOUT]: ({ dispatch }, params) => {
    deleteValueFromSessionStorage("currentUser");
    sessionStorage.removeItem("accessToken");
    window.location = "/login";
  },
  [types.INITIALIZE_AUTH_STATE]: ({ commit, dispatch }, payload) => {
    commit(
      types.MUTATE_ACCESS_TOKEN,
      getValueFromSessionStorage("accessToken")
    );
    commit(
      types.MUTATE_CURRENT_USER,
      getObjectFromSessionStorage("currentUser")
    );
  },
};

const getters = {
  [types.ACCESS_TOKEN]: (state) => state.accessToken,
  [types.CURRENT_USER]: (state) => state.currentUser,
  [types.IS_LAB_ADMIN]: (state) => state.currentUser.role === "Admin",
  [types.IS_LAB_DIRECTOR]: (state) => state.currentUser.role == "LabDirector",
};

export default {
  state,
  mutations,
  actions,
  getters,
};

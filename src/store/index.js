// src/store/index.js
import { createStore } from "vuex";
import auth from "./modules/auth";
import errors from "./modules/errors";
import users from "./modules/users";
import requests from "./modules/requests";
import workSteps from "./modules/workSteps";
import workTypes from "./modules/workTypes";
const store = createStore({
  modules: {
    auth,
    errors,
    users,
    requests,
    workSteps,
    workTypes,
  },
});

export default store; // вот здесь нужен default экспорт!

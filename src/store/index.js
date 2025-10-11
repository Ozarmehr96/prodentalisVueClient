// src/store/index.js
import { createStore } from "vuex";
import auth from "./modules/auth";
import errors from "./modules/errors";
import users from "./modules/users";
import requests from "./modules/requests";
import workSteps from "./modules/workSteps";
import workTypes from "./modules/workTypes";
import orders from "./modules/orders";
import order_wizard from "./modules/order_wizard";
import labs from "./modules/labs";
const store = createStore({
  modules: {
    auth,
    errors,
    users,
    requests,
    workSteps,
    workTypes,
    orders,
    order_wizard,
    labs
  },
});

export default store; // вот здесь нужен default экспорт!

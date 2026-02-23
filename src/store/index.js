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
import roles from "./modules/roles";
import orderTasks from "./modules/orderTasks";
import stats from "./modules/stats";
import customers from "./modules/customers";
import materials from "./modules/materials";
import workTypeMaterials from "./modules/workTypeMaterials";
import customersWorkTypePrices from "./modules/customersWorkTypePrices";
import paymentJournal from "./modules/paymentJournal";
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
    labs,
    roles,
    orderTasks,
    stats,
    customers,
    materials,
    workTypeMaterials,
    customersWorkTypePrices,
    paymentJournal
  },
});

export default store; // вот здесь нужен default экспорт!

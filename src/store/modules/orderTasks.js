import api from "../../services/api";
import {
 FINISH_ORDER_TASK,
 IS_LOADING_ORDER_TASKS,
 LOAD_ORDER_TASKS_PAGED,
 MUTATE_IS_LOADING_ORDER_TASKS,
 MUTATE_ORDER_TASK,
 MUTATE_ORDER_TASKS,
 ORDER_TASK,
 ORDER_TASKS,
 PAUSE_ORDER_TASK,
 SET_ORDER_TASKS_LOADING,
 START_ORDER_TASK,
} from "../types";

const state = {
 orderTasks: [],
 orderTask: null,
 isLoadingOrderTasks: false,
};

let orderTasksController = null; // вне метода, чтобы хранить контроллер между вызовами

const mutations = {
 [MUTATE_IS_LOADING_ORDER_TASKS]: (state, isLoadingOrderTasks) =>
  (state.isLoadingOrderTasks = isLoadingOrderTasks),
 [MUTATE_ORDER_TASKS]: (state, tasks) => (state.orderTasks = tasks),
 [MUTATE_ORDER_TASK]: (state, task) => (state.orderTask = task),
};

const actions = {
 [SET_ORDER_TASKS_LOADING]: ({ commit }, isLoading) => {
  commit(MUTATE_IS_LOADING_ORDER_TASKS, isLoading);
 },

 [LOAD_ORDER_TASKS_PAGED]: async ({ commit }, params) => {
  if (orderTasksController) {
   orderTasksController.abort();
  }

  const controller = new AbortController();
  orderTasksController = controller;
  commit(MUTATE_IS_LOADING_ORDER_TASKS, true);

  try {
   if (params.page === 1) {
    await commit(MUTATE_ORDER_TASKS, []);
   }
   const response = await api.get(`/order-tasks/page/${params.page}`, {
    params,
    signal: controller.signal,
   });

   if (orderTasksController === controller) {
    // commit(types.MUTATE_ORDERS, response.data.items);
    return response.data; // ⚡ важно — вернём в компонент
   }
  } catch (err) {
   if (err.name !== "CanceledError") console.error(err);
   throw err;
  } finally {
   if (orderTasksController === controller) {
    commit(MUTATE_IS_LOADING_ORDER_TASKS, false);
    orderTasksController = null;
   }
  }
 },

 [START_ORDER_TASK]: async ({ commit }, params) => {
  try {
   const response = await api.put(`/order-tasks/${params.orderTaskId}/start`);
   
   await commit(MUTATE_ORDER_TASK, response.data);
   if (params.callback) {
    params.callback(response.data);
   }
   return response.data;
  } catch (e) {
   console.error(e);
  }
 },

 [PAUSE_ORDER_TASK]: async ({ commit }, params) => {
  try {
   const response = await api.put(`/order-tasks/${params.orderTaskId}/pause`);
   await commit(MUTATE_ORDER_TASK, response.data);
if (params.callback) {
    params.callback(response.data);
   }
   return response.data;
  } catch (e) {
   console.error(e);
  }
 },

 [FINISH_ORDER_TASK]: async ({ commit }, params) => {
  try {
   const response = await api.put(`/order-tasks/${params.orderTaskId}/finish`);
   await commit(MUTATE_ORDER_TASK, response.data);
   if (params.callback) {
    params.callback(response.data);
   }
   return response.data;
  } catch (e) {
   console.error(e);
  }
 },
};

const getters = {
 [IS_LOADING_ORDER_TASKS]: (state) => state.isLoadingOrderTasks,
 [ORDER_TASKS]: (state) => state.orderTasks,
 [ORDER_TASK]: (state) => state.orderTask,
};

export default {
 state,
 mutations,
 actions,
 getters,
};

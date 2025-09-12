// Getters
export const DATE_FORMAT = "DD.MM.YYYY";
export const DATE_TIME_FORMAT = "DD.MM.YYYY HH:mm";
export const LOGIN = "auth/LOGIN";
export const CURRENT_USER = "auth/CURRENT_USER";
export const ACCESS_TOKEN = "auth/ACCESS_TOKEN";
export const MUTATE_CURRENT_USER = "auth/MUTATE_CURRENT_USER";
export const MUTATE_WEBSOCKET_TOKEN = "auth/MUTATE_WEBSOCKET_TOKEN";
export const MUTATE_ACCESS_TOKEN = "auth/MUTATE_ACCESS_TOKEN";
export const MUTATE_ACCESS_TOKEN_EXPIRES = "auth/MUTATE_ACCESS_TOKEN_EXPIRES";
export const AUTO_RELOGIN = "auth/AUTO_RELOGIN";
export const LOGOUT = "auth/LOGOUT";
export const SET_CURRENT_USER = "auth/SET_CURRENT_USER";
export const SET_WEBSOCKET_TOKEN = "auth/SET_WEBSOCKET_TOKEN";
export const SET_ACCESS_TOKEN = "auth/SET_ACCESS_TOKEN";
export const SET_ACCESS_TOKEN_EXPIRES = "auth/SET_ACCESS_TOKEN_EXPIRES";
export const INITIALIZE_AUTH_STATE = "auth/INITIALIZE_AUTH_STATE";

// Ошибки
export const ADD_ERROR = "errors/ADD_ERROR";
export const TOGGLE_ERRORS = "errors/TOGGLE_ERRORS";
export const SHOW_ERRORS = "errors/SHOW_ERRORS";
export const HIDE_ERRORS = "errors/HIDE_ERRORS";
export const MUTATE_ADD_ERROR = "errors/MUTATE_ADD_ERROR";
export const MUTATE_SHOWED = "errors/MUTATE_SHOWED";
export const ERRORS = "errors/ERRORS";
export const ERRORS_SHOWED = "errors/ERRORS_SHOWED";

// Пользователи и роли
export const IS_LAB_DIRECTOR = "users/IS_LAB_DIRECTOR";
export const IS_LAB_ADMIN = "users/IS_LAB_ADMIN";
export const ADD_USER = "users/ADD_USER";
export const ROLES = "users/ROLES";
export const MUTATE_ROLES = "users/MUTATE_ROLES";
export const LOAD_ROLES = "users/ROLES";
export const LOAD_USERS = "users/LOAD_USERS";
export const LOAD_USER = "users/LOAD_USER";

export const LOAD_REQUESTS = "requests/LOAD_REQUESTS";
export const INVOKE_USER_REQUEST = "requests/INVOKE_USER_REQUEST";

// Типы работ
export const WORK_TYPES = "workTypes/WORK_TYPES";
export const MUTATE_WORK_TYPES = "workTypes/MUTATE_WORK_TYPES";
export const LOAD_WORK_TYPES = "workTypes/LOAD_WORK_TYPES";
export const LOAD_WORK_TYPE = "workTypes/LOAD_WORK_TYPE";
export const SAVE_WORK_TYPE = "workTypes/SAVE_WORK_TYPE";
export const UPDATE_WORK_TYPE = "workTypes/UPDATE_WORK_TYPE";
export const DELETE_WORK_TYPE = "workTypes/DELETE_WORK_TYPE";
export const SELECTED_WORK_TYPE_STEPS = "workTypes/SELECTED_WORK_TYPE_STEPS";
export const MUTATE_SELECTED_WORK_TYPE_STEPS = "workTypes/MUTATE_SELECTED_WORK_TYPE_STEPS";
export const SET_SELECTED_WORK_TYPE_STEPS = "workTypes/SET_SELECTED_WORK_TYPE_STEPS";

// Этапы работ
export const SAVE_WORK_STEP = "workSteps/SAVE_WORK_STEP";
export const SAVE_WORK_STEP_PRIORITY = "workSteps/SAVE_WORK_STEP_PRIORITY";
export const UPDATE_WORK_STEP = "workSteps/UPDATE_WORK_STEP";
export const DELETE_WORK_STEP = "workSteps/DELETE_WORK_STEP";
export const LOAD_WORK_STEPS = "workSteps/LOAD_WORK_STEPS";
export const LOAD_WORK_STEP = "workSteps/LOAD_WORK_STEP";

// Заказы
export const LOAD_ORDERS = "orders/LOAD_ORDERS";
export const MUTATE_ORDERS = "orders/MUTATE_ORDERS";
export const ORDERS = "orders/ORDERS";
export const CREATE_ORDER = "orders/CREATE_ORDER";
export const UPDATE_ORDER = "orders/UPDATE_ORDER";

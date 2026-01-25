// Getters
export const DATE_FORMAT = "DD.MM.YYYY";
export const DATE_TIME_FORMAT = "DD.MM.YYYY HH:mm";
export const LOGIN = "auth/LOGIN";
export const CURRENT_USER = "auth/CURRENT_USER";
export const IS_SYSTEM_ADMIN = "auth/IS_SYSTEM_ADMIN";
export const IS_CUSTOMER = "auth/IS_CUSTOMER";
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
export const IS_LAB_DIRECTOR = "auth/IS_LAB_DIRECTOR";
export const IS_LAB_ADMIN = "auth/IS_LAB_ADMIN";
export const ADD_USER = "users/ADD_USER";
export const UPDATE_USER = "users/UPDATE_USER";
export const DELETE_USER = "users/DELETE_USER";
export const MAIN_ROLES = "users/MAIN_ROLES";
export const MUTATE_MAIN_ROLES = "users/MUTATE_MAIN_ROLES";
export const LOAD_MAIN_ROLES = "users/MAIN_ROLES";
export const LOAD_USERS = "users/LOAD_USERS";
export const LOAD_USER = "users/LOAD_USER";
export const MUTATE_LOADED_USER = "users/MUTATE_LOADED_USER";
export const LOADED_USER = "users/LOADED_USER";

export const LOAD_REQUESTS = "requests/LOAD_REQUESTS";
export const LOAD_ACTIVE_REQUEST_BY_TYPE = "requests/LOAD_ACTIVE_REQUEST_BY_TYPE";
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
export const WORK_STEPS = "workSteps/WORK_STEPS";
export const MUTATE_WORK_STEPS = "workSteps/MUTATE_WORK_STEPS";

// Заказы
export const LOAD_ORDERS = "orders/LOAD_ORDERS";
export const LOAD_ORDERS_PAGED = "orders/LOAD_ORDERS_PAGED";
export const MUTATE_ORDERS = "orders/MUTATE_ORDERS";
export const ORDERS = "orders/ORDERS";
export const IS_ORDER_LOADING = "orders/IS_ORDER_LOADING";
export const SET_ORDER_LOADING = "orders/SET_ORDER_LOADING";
export const MUTATE_IS_ORDER_LOADING = "orders/MUTATE_IS_ORDER_LOADING";
export const LOAD_ORDER = "orders/LOAD_ORDER";
export const MUTATE_ORDER = "orders/MUTATE_ORDER";
export const ORDER = "orders/ORDER";
export const CREATE_ORDER = "orders/CREATE_ORDER";
export const UPDATE_ORDER = "orders/UPDATE_ORDER";
export const DELETE_ORDER = "orders/DELETE_ORDER";
export const START_ORDER = "orders/START_ORDER";
export const FINISH_ORDER = "orders/FINISH_ORDER";

// Фильтр по заказу
export const ORDER_FILTERS = "orders/ORDER_FILTERS";
export const MUTATE_ORDER_FILTERS = "orders/MUTATE_ORDER_FILTERS";
export const SET_ORDER_FILTERS = "orders/MUTATE_ORDER_FILTERS";

// Создание заказа
export const SELECTED_TOOTH = "order_wizard/SELECTED_TOOTH";
export const MUTATE_SELECTED_TOOTH = "order_wizard/MUTATE_SELECTED_TOOTH";
export const SET_SELECTED_TOOTH = "order_wizard/SET_SELECTED_TOOTH";
export const ORDER_SELECTED_TEETH = "order_wizard/ORDER_SELECTED_TEETH"; // выбранные зубы при создании задачи. У каждого зуба свои типы работ
export const MUTATE_ORDER_SELECTED_TEETH = "order_wizard/MUTATE_ORDER_SELECTED_TEETH";
export const SET_ORDER_SELECTED_TEETH = "order_wizard/SET_ORDER_SELECTED_TEETH";

// Создание лаборатории
export const SAVE_LAB = "labs/SAVE_LAB";
export const UPDATE_LAB = "labs/UPDATE_LAB";
export const LOAD_LABS = "labs/LOAD_LABS";
export const LOAD_LAB = "labs/LOAD_LAB";
export const LABS = "labs/LABS";
export const MUTATE_LABS = "labs/MUTATE_LABS";

// РОЛИ
export const LOAD_ROLES = "roles/LOAD_ROLES";
export const LOAD_ROLE = "roles/LOAD_ROLE";
export const ROLES = "roles/ROLES";
export const MUTATE_ROLES = "roles/MUTATE_ROLES";
export const MUTATE_ROLE = "roles/MUTATE_ROLE";
export const SAVE_ROLE = "roles/SAVE_ROLE";
export const UPDATE_ROLE = "roles/UPDATE_ROLE";
export const DELETE_ROLE = "roles/DELETE_ROLE";
export const IS_ROLES_LOADING = "roles/IS_ROLES_LOADING";
export const MUTATE_IS_ROLES_LOADING = "roles/MUTATE_IS_ROLES_LOADING";
export const SET_IS_ROLES_LOADING = "roles/SET_IS_ROLES_LOADING";

// Задачи заказов
export const ORDER_TASKS = "orderTasks/ORDER_TASKS"; // Все задачи по заказу
export const MUTATE_ORDER_TASKS = "orderTasks/MUTATE_ORDER_TASKS"; // Все задачи по заказу
export const IS_LOADING_ORDER_TASKS = "orderTasks/IS_LOADING_ORDER_TASKS"; // Флаг загрузки задач по заказу
export const MUTATE_IS_LOADING_ORDER_TASKS = "orderTasks/IS_LOADING_ORDER_TASKS"; // Флаг загрузки задач по заказу
export const SET_ORDER_TASKS_LOADING = "orderTasks/SET_ORDER_TASKS_LOADING"; // Установка флага загрузки задач по заказу
export const LOAD_ORDER_TASKS_PAGED = "orderTasks/LOAD_ORDER_TASKS_PAGED"; // Загрузка задач по заказу
export const ORDER_TASK = "orderTasks/ORDER_TASK"; // Одна задача заказа
export const MUTATE_ORDER_TASK = "orderTasks/MUTATE_ORDER_TASK"; // Мутация одной задачи заказа
export const START_ORDER_TASK = "orderTasks/START_ORDER_TASK"; // Запуск задачи заказа
export const PAUSE_ORDER_TASK = "orderTasks/PAUSE_ORDER_TASK"; // Пауза задачи заказа
export const FINISH_ORDER_TASK = "orderTasks/FINISH_ORDER_TASK"; // Завершение задачи заказа
export const RESET_ORDER_TASK_FILTERS = "orderTasks/RESET_ORDER_TASK_FILTERS";

// Фильтр по задачам
export const ORDER_TASK_FILTERS = "orderTasks/ORDER_TASK_FILTERS";
export const MUTATE_ORDER_TASK_FILTERS = "orderTasks/MUTATE_ORDER_TASK_FILTERS";
export const SET_ORDER_TASK_FILTERS = "orderTasks/SET_ORDER_TASK_FILTERS";

// Статистика
export const LOAD_USER_STAT = "stats/LOAD_USER_STAT";
export const MUTATE_IS_STATS_LOADING = "stats/MUTATE_IS_STATS_LOADING";
export const IS_STATS_LOADING = "stats/IS_STATS_LOADING";
export const USER_STAT = "stats/USER_STAT";
export const MUTATE_USER_STAT = "stats/MUTATE_USER_STAT";

// Заказчики
export const LOAD_CUSTOMERS = "customers/LOAD_CUSTOMERS";
export const MUTATE_IS_CUSTOMERS_LOADING = "customers/MUTATE_IS_CUSTOMERS_LOADING";
export const IS_CUSTOMERS_LOADING = "customers/IS_CUSTOMERS_LOADING";
export const LOAD_CUSTOMER = "customers/LOAD_CUSTOMER";
export const CUSTOMER = "customers/CUSTOMER";
export const CUSTOMERS = "customers/CUSTOMERS";
export const SET_CUSTOMER = "customers/SET_CUSTOMER";
export const MUTATE_CUSTOMER = "customers/MUTATE_CUSTOMER";
export const MUTATE_CUSTOMERS = "customers/MUTATE_CUSTOMERS";
export const SET_CUSTOMERS_IS_LOADING = "customers/SET_CUSTOMERS_IS_LOADING";
export const SAVE_CUSTOMER = "customers/SAVE_CUSTOMER";
export const UPDATE_CUSTOMER = "customers/UPDATE_CUSTOMER";
export const DELETE_CUSTOMER = "customers/DELETE_CUSTOMER";

// Расходные материалы
export const LOAD_MATERIALS = "materials/LOAD_MATERIALS";
export const MUTATE_MATERIALS = "materials/MUTATE_MATERIALS";
export const MATERIALS = "materials/MATERIALS";
export const LOAD_MATERIAL = "materials/LOAD_MATERIAL";
export const MATERIAL = "materials/MATERIAL";
export const MUTATE_MATERIAL = "materials/MUTATE_MATERIAL";
export const SAVE_MATERIAL = "materials/SAVE_MATERIAL";
export const UPDATE_MATERIAL = "materials/UPDATE_MATERIAL";
export const DELETE_MATERIAL = "materials/DELETE_MATERIAL";
export const IS_MATERIALS_LOADING = "materials/IS_MATERIALS_LOADING";
export const MUTATE_IS_MATERIALS_LOADING = "materials/MUTATE_IS_MATERIALS_LOADING";
export const SET_IS_MATERIALS_LOADING = "materials/SET_IS_MATERIALS_LOADING";

// Расходные материалы по типам работ и себестоимость работ
export const LOAD_WORK_TYPE_MATERIALS = "workTypeMaterials/LOAD_WORK_TYPE_MATERIALS";
export const MUTATE_WORK_TYPE_MATERIALS = "workTypeMaterials/MUTATE_WORK_TYPE_MATERIALS";
export const WORK_TYPE_MATERIALS = "workTypeMaterials/WORK_TYPE_MATERIALS";
export const LOAD_WORK_TYPE_MATERIAL = "workTypeMaterials/LOAD_WORK_TYPE_MATERIAL";
export const WORK_TYPE_MATERIAL = "workTypeMaterials/WORK_TYPE_MATERIAL";
export const MUTATE_WORK_TYPE_MATERIAL = "workTypeMaterials/MUTATE_WORK_TYPE_MATERIAL";
export const SAVE_WORK_TYPE_MATERIAL = "workTypeMaterials/SAVE_WORK_TYPE_MATERIAL";
export const IS_WORK_TYPE_MATERIALS_LOADING = "workTypeMaterials/IS_WORK_TYPE_MATERIALS_LOADING";
export const MUTATE_IS_WORK_TYPE_MATERIALS_LOADING = "workTypeMaterials/MUTATE_IS_WORK_TYPE_MATERIALS_LOADING";
export const SET_IS_WORK_TYPE_MATERIALS_LOADING = "workTypeMaterials/SET_IS_WORK_TYPE_MATERIALS_LOADING";

// Цены заказчиков на типы работ
export const LOAD_CUSTOMERS_WORK_TYPE_PRICES = "customersWorkTypePrices/LOAD_CUSTOMERS_WORK_TYPE_PRICES";
export const MUTATE_CUSTOMERS_WORK_TYPE_PRICES = "customersWorkTypePrices/MUTATE_CUSTOMERS_WORK_TYPE_PRICES";
export const MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES = "customersWorkTypePrices/MUTATE_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES";
export const IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES = "customersWorkTypePrices/IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES";
export const SET_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES = "customersWorkTypePrices/SET_IS_LOADING_CUSTOMERS_WORK_TYPE_PRICES";
export const CUSTOMERS_WORK_TYPE_PRICES = "customersWorkTypePrices/CUSTOMERS_WORK_TYPE_PRICES";
export const SAVE_CUSTOMERS_WORK_TYPE_PRICES = "customersWorkTypePrices/SAVE_CUSTOMERS_WORK_TYPE_PRICES";

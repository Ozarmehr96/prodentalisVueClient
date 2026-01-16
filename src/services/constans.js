//export const baseHost = "http://192.168.1.122:5000";
// export const baseHost = "http://0.0.0.0:5000";
const originWithoutPort = `${window.location.protocol}//${window.location.hostname}`; // при условии, что бэк и клиент на одном серваке
// export const baseHost =`${originWithoutPort}:5000`;
export const baseHost =`${originWithoutPort}`; // НА ПРОДЕ УБИРАЕМ ПОРТ, ТАК КАК НАСТРОЙКИ УПРАВЛЯЮТСЯ nginx

export const baseURL = `${baseHost}/api/v1`;

export const intervalValue = 5000;
export const toastLifetime = 5000;

export const VITA_COLORS = [
  { name: "1M1", color: "#f0ead6" },
  { name: "1M2", color: "#e6e0c8" },
  { name: "1M3", color: "#ded3b6" },
  { name: "2L1.5", color: "#f1e8d1" },
  { name: "2M1", color: "#e8dfc6" },
  { name: "2M2", color: "#dfd3b3" },
  { name: "2M3", color: "#d6c7a0" },
  { name: "2R1.5", color: "#f2e3cd" },
  { name: "3L1.5", color: "#ece2d1" },
  { name: "3M1", color: "#e3d8c4" },
  { name: "3M2", color: "#d9cbb3" },
  { name: "3M3", color: "#cfc0a2" },
  { name: "3R1", color: "#f1dccb" },
  { name: "3R2", color: "#e6cdb6" },
  { name: "3R3", color: "#d9bfa2" },
  { name: "4L1.5", color: "#e7dcca" },
  { name: "4M1", color: "#dbcfb3" },
  { name: "4M2", color: "#cfc29a" },
  { name: "4M3", color: "#c3b38a" },
  { name: "4R1", color: "#e7d3c2" },
  { name: "4R2", color: "#d9bfa8" },
  { name: "4R3", color: "#cbb38f" },
  { name: "5L1.5", color: "#e3dccb" },
  { name: "5M1", color: "#d6cdb3" },
  { name: "5M2", color: "#c9b999" },
  { name: "5M3", color: "#bcae8a" },
  { name: "5R1", color: "#e3d1be" },
  { name: "5R2", color: "#d4b99f" },
  { name: "5R3", color: "#c4aa8a" },
];

export const userRoles = new Map([
  ["AdminLab", "/orders"],
  ["LabDirector", "/orders"],
]);

export const taskStatuses = {
  created: { id: "created", label: "Создана" },
  started: { id: "started", label: "В работе" },
  stopped: { id: "stopped", label: "Приостановлена" },
  finished: { id: "finished", label: "Закрыта" },
  "finished-with-remnant": {
    id: "finished-with-remnant",
    label: "Закрыта с остатком",
  },
  cancelled: { id: "cancelled", label: "Удалена" },
};

let headerMenuItemsArray = [
  {
    label: "Лаборатории",
    link: "/labs",
    includedRoles: ["SystemAdmin"],
    svg: "#table",
    path: null,
  },
  {
    label: "Заказы",
    link: "/orders",
    includedRoles: ["allRoles"],
    svg: "#table",
    path: null,
  },
  {
    label: "Задачи",
    link: "/tasks",
    includedRoles: ["SystemAdmin", "LabDirector", "AdminLab", "Worker"],
    svg: null,
    path: "/images/tasks.svg",
  },
  {
    label: "Запросы",
    link: "/requests",
    includedRoles: ["allRoles"],
    svg: "#requests",
    path: null,
  },
  {
    label: "Сотрудники",
    link: "/users",
    includedRoles: ["SystemAdmin", "LabDirector", "AdminLab"],
    svg: "#people-circle",
    path: null,
  },
  {
    label: "Заказчики",
    link: "/customers",
    includedRoles: ["SystemAdmin", "LabDirector", "AdminLab"],
    svg: null,
    path: "/images/client-svgrepo-com.svg",
  },
  {
    label: "Роли",
    link: "/roles",
    includedRoles: ["SystemAdmin", "LabDirector", "AdminLab"],
    svg: "#roles",
    path: null,
  },
  {
    label: "Типы работ",
    link: "/work-types",
    includedRoles: ["SystemAdmin", "LabDirector", "AdminLab"],
    svg: null,
    path: "/images/work-type.svg",
  },
  {
    label: "Этапы работ",
    link: "/work-steps",
    includedRoles: ["SystemAdmin", "LabDirector", "AdminLab"],
    svg: null,
    path: "/images/work-steps.svg",
  },
  // {
  //   label: "Приоритеты этапов",
  //   link: "/work-steps/priorities",
  //   includedRoles: ["SystemAdmin", "LabDirector", "AdminLab"],
  //   svg: null,
  //   path: "/images/priority.svg",
  // },
];

export const headerMenuItems = headerMenuItemsArray;

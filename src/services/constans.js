export const baseHost = "http://192.168.100.6:5000";
export const baseURL = `${baseHost}/api/v1`;

export const intervalValue = 5000;
export const toastLifetime = 5000;

export const userRoles = new Map([
  ["AdminLab", "/users"],
  ["LabDirector", "/users"],
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
    label: "Заказы",
    link: "/orders",
    includedRoles: ["LabDirector", "AdminLab"],
    svg: "#table",
  },
  {
    label: "Сотрудники",
    link: "/users",
    includedRoles: ["LabDirector", "AdminLab"],
    svg: "#people-circle",
  },
  {
    label: "Запросы",
    link: "/requests",
    includedRoles: ["LabDirector", "AdminLab"],
    svg: "#requests",
  },
  {
    label: "Типы работ",
    link: "/work-types",
    includedRoles: ["LabDirector", "AdminLab"],
    svg: "#",
  },
  {
    label: "Этапы работ",
    link: "/work-steps",
    includedRoles: ["LabDirector", "AdminLab"],
    svg: "#",
  },
];

export const headerMenuItems = headerMenuItemsArray;

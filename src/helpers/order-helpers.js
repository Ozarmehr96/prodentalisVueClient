/**
 * Конвертирует выбранные зубы в типы работ с привязкой к зубам
 * @param {*} orderSelectedTeeth 
 * @returns 
 */
export function convertOrderTeethToWorkTypes(orderSelectedTeeth) {
      let workTypes = [];

      orderSelectedTeeth.forEach((tooth) => {
        let orderWorkTypes = tooth.hasOwnProperty("work_types") ? tooth.work_types : tooth.workTypes;
        // перебираем все типы работ у зуба
        orderWorkTypes.forEach((workType) => {
          // ищем, есть ли уже такой тип работы в result
          let existing = workTypes.find((x) => x.id === workType.id);

          if (!existing) {
            // если такого типа работы ещё нет — добавляем новый объект
            existing = {
              ...workType,
              teeth: [],
            };
            existing.isSelected = false;
            workTypes.push(existing);
          }

          // добавляем зуб в список
          existing.teeth.push(tooth.hasOwnProperty("toothId") ? tooth.toothId : tooth.tooth_id);
          existing.teeth.sort((a, b) => a - b);
        });
      });
      return workTypes;
  }

export function getOrderStatusClass(statusCode) {
  switch (statusCode) {
    case "Created":
      return "bg-primary";
    case "Started":
      return "bg-success text-white";
    case "Stopped":
      return "bg-warning";
    case "Finished":
      return "bg-secondary";
    case "Canceled":
    case "PendingDeletion":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

/**
 * Получить класс или HEX цвет статуса задачи
 * @param {string} statusCode — код статуса
 * @param {string} returnHex — если true, вернуть HEX, иначе CSS-класс
 * @returns {string} если returnHex true, вернуть HEX, иначе CSS-класс
 */
export function getTaskStatusClass(statusCode, returnHex = false) {
  console.log("statusCode", statusCode);

  const map = {
    NotStarted: {
      class: "bg-secondary",
      hex: "#6c757d",
    },
    Pending: {
      class: "bg-secondary",
      hex: "#6c757d",
    },
    Started: {
      class: "bg-success",
      hex: "#198754",
    },
    Paused: {
      class: "bg-warning",
      hex: "#ffc107",
    },
    Finished: {
      class: "bg-secondary",
      hex: "#adb5bd",
    },
    Canceled: {
      class: "bg-danger",
      hex: "#dc3545",
    },
  };

  const status = map[statusCode];

  if (!status) {
    // Значение по умолчанию
    return returnHex ? "#6c757d" : "bg-secondary";
  }

  return returnHex ? status.hex : status.class;
}

/**
 * Конвертирует миллисекунды в строку формата ЧЧ:ММ:СС
 * @param {number} ms — время в миллисекундах
 * @returns {string} время в формате ЧЧ:ММ:СС
 */
export  function msToTime(ms) {
  if (!ms || ms < 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}
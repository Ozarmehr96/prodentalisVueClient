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
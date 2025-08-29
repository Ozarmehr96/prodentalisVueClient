/**
 * Получить значение из Session Storage
 *
 * @param {string} key - Ключ получаемого значения
 *
 * @returns {any} - Значение из Session Storage
 */
export function getValueFromSessionStorage(key) {
    if (sessionStorage && sessionStorage.getItem(key)) {
      return sessionStorage.getItem(key);
    }
  
    return undefined;
  }
  
  /**
   * Установить значение в Session Storage
   *
   * @param {string} key - Имя устанавливаемого значения
   * @param {any} value - Значение
   */
  export function setValueToSessionStorage(key, value) {
    if (sessionStorage) {
      sessionStorage.setItem(key, value);
    }
  }
  
  /**
   * Получить объект из Session Storage
   *
   * @param {string} key - Имя получаемого объекта
   *
   * @returns {object} - Объект из Session Storage
   */
  export function getObjectFromSessionStorage(key) {
    const value = getValueFromSessionStorage(key);
  
    if (value) {
      return JSON.parse(value);
    }
  
    return {};
  }
  
  /**
   * Установить объект в Session Storage
   *
   * @param {string} key - Имя устанавливаемого объекта
   * @param {object} obj - Объект
   */
  export function setObjectToSessionStorage(key, obj) {
    if (obj) {
      setValueToSessionStorage(key, JSON.stringify(obj));
    } else {
      deleteValueFromSessionStorage(key);
    }
  }
  
  /**
   * Удалить значение из Session Storage
   *
   * @param {string} key - Ключ удаляемого значения
   */
  export function deleteValueFromSessionStorage(key) {
    if (sessionStorage && sessionStorage.getItem(key) !== undefined) {
      sessionStorage.removeItem(key);
    }
  }
  
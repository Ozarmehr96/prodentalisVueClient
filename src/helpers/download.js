import dayjs from "dayjs";
/**
 * Загрузка файла с сервера.
 * @param {Object} response ответ http
 * @param {string} fileName - название файла
 */
export function downloadFile(response, fileName) {
    if (!response.data)
        return;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.click();
    window.URL.revokeObjectURL(url);
}

export function getFinanceReportFileName(dateFrom, dateTo) {
    // Формируем дату в формате дд_мм_ггг
    const from = dayjs(dateFrom).format("DD-MM-YYYY");
    const to = dayjs(dateTo).format("DD-MM-YYYY");

    // Формируем текущее время в формате hh.mm.ss
    const time = dayjs().format("HH_mm_ss");

    // Итоговое имя файла
    const fileName = `Финансовый отчет c ${from} по ${to} ${time}.xlsx`;
    return fileName;
}
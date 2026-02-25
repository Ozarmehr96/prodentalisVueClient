import { convertOrderTeethToWorkTypes } from "./order-helpers";

/**
 * Печать заказа с чистым JS
 * @param {Object} order - объект заказа
 * @param {string} orderBlockId - ID блока заказа с QR canvas
 */
export function printOrder(order, created_at_formatted, expired_at_formatted) {
    const orderBlock =document.getElementById(`order-${order.id}-body`);
    if (!orderBlock) return console.log("Блок заказа не найден!");

    const qrCanvas = orderBlock.querySelector("canvas");
    if (!qrCanvas) return console.log("QR canvas не найден!");

    // Создаем iframe для печати
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();

    // Формируем квадранты зубов
    const quadrants = [[11,18],[21,28],[31,38],[41,48]].map(range => {
        let html = '<div class="quadrant">';
        for (let i = range[0]; i <= range[1]; i++) {
            const tooth = order.teeth.find(t => t.tooth_id === i);
            if (!tooth) {
                continue; // если зуб не найден, пропускаем его
            }
            const color = tooth?.work_types?.[0]?.background_color || "#f0f0f0";
            html += `<div class="tooth-ongrid" style="background-color:${color}">${i}</div>`;
        }
        html += '</div>';
        return html;
    }).join('');

// Формируем список работ с квадратиками цветов
    const worksHtml = convertOrderTeethToWorkTypes(order.teeth.slice())
    .map(w => `<span class="work-row-inline"><span class="work-color" style="background-color:${w.background_color}"></span><span class="work-name">${w.name}</span></span>`)
    .join('') || '';

    doc.write(`
        <html>
        <head>
            <title>Печать заказа №${order.number}</title>
            <style>
                @page { size: A4; margin: 15mm; }
                body { margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #000; }
                h3 { font-size: 20px; font-weight: bold; margin-bottom: 12px; }
                .container { display: flex; gap: 20px; }
                .info { flex: 1; }
                .info div { margin-bottom: 6px; }
                .info .label { display: inline-block; width: 100px; font-weight: 600; color: #555; }
                .info .value { font-weight: 600; }
                .qr { min-width: 150px; }
                .qr img { width: 150px; height: 150px; display: block; }
                .quadrant { min-height: 50px !important; display: grid; grid-template-columns: repeat(4, 27px); grid-auto-rows: 27px; gap: 4px; border: 0.1px solid #000; padding: 8px; }
                .tooth-ongrid { display: flex; align-items: center; justify-content: center; width: 27px; height: 27px; font-weight: 400; font-size: 14px; border-radius: 1px; color: #000; }
                
                .tooth-grid {
                padding-right: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin: 0;
    align-self: start; /* вот эта строчка фиксирует высоту по контенту */
}
                .works-list { margin-top: 10px; }
                .work-row { display: flex; align-items: center; margin-bottom: 4px; }
                
                .work-row-inline {
    display: inline-flex;
    align-items: center;
    margin-right: 10px; /* расстояние между работами */
    padding: 4px 0; /* вертикальные отступы для кликабельности */
}
.work-color {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    margin-top: -4px;
    border: 1px solid #000;
}
                .work-name { font-weight: 400; }
                </style>
        </head>
        <body>
            <h3>Заказ №${order.number}</h3>
            <div class="container" style="padding-bottom: 5px;">
                <!-- Инфо о заказе -->
                <div class="info">
                    <div><span class="label">Заказчик:</span><span class="value">${order.customer_name}</span></div>
                    <div><span class="label">Пациент:</span><span class="value">${order.patient_name}</span></div>
                    <div><span class="label">Создан:</span><span class="value">${created_at_formatted}</span></div>
                    <div><span class="label">Срок:</span><span class="value">${expired_at_formatted}</span></div>
                    <div><span class="label">Комментарии:</span></div>
                    <span style="padding-bottom: 20px;">${order.description || ""}</span>
                </div>

                <!-- QR -->
                <div class="qr">
                    <img src="${qrCanvas.toDataURL('image/png')}" alt="QR Code" />
                </div>

                <!-- Квадрант зубов -->
                <div class="tooth-grid">
                    ${quadrants}
                </div>
            </div>
   
            <strong>Типы работ:</strong>
            <div class="works-list">
                        ${worksHtml}
                    </div>
        </body>
        </html>
    `);

    doc.close();

    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
        console.log("Печать завершена");
    }, 300);
}
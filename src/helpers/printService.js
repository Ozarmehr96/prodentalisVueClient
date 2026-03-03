import { convertOrderTeethToWorkTypes } from "./order-helpers";

/**
 * Печать заказа с чистым JS
 * @param {Object} order - объект заказа
 * @param {string} orderBlockId - ID блока заказа с QR canvas
 */
export function printOrder(order, created_at_formatted, expired_at_formatted) {
    const orderBlock = document.getElementById(`order-${order.id}-body`);
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
    const quadrants = [[11,18],[21,28],[31,38],[41,48]].map((range, index) => {
    let html = '<div class="quadrant">';

    const isReverse = index === 0 || index === 2; // 1 и 3 квадрант

    if (isReverse) {
        for (let i = range[1]; i >= range[0]; i--) {
            const tooth = order.teeth.find(t => t.tooth_id === i);
            if (!tooth) continue;

            const color = tooth?.work_types?.[0]?.background_color || "#000000";
            html += `<span class="tooth-number" style="color:${color};">${i % 10}</span>`;
        }
    } else {
        for (let i = range[0]; i <= range[1]; i++) {
            const tooth = order.teeth.find(t => t.tooth_id === i);
            if (!tooth) continue;

            const color = tooth?.work_types?.[0]?.background_color || "#000000";
            html += `<span class="tooth-number" style="color:${color};">${i % 10}</span>`;
        }
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
                .qr { min-width: 150px; margin-top:-10px;}
                .qr img { width: 150px; height: 150px; display: block; }
                .tooth-ongrid { display: flex; align-items: center; justify-content: center; width: 27px; height: 27px; font-weight: 400; font-size: 14px; border-radius: 1px; color: #000; }
.quadrant {
    display: flex;
    flex-direction: row;
    gap: 4px; /* можно оставить или заменить на margin у span */
    border: 0.01px solid #000;
    padding: 8px;
    min-height:18px !important;
    min-width:100px !important;
}
                .tooth-grid {
                padding-right: 10px;
    display: grid;
    max-width: 245px !important;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin: 0;
    align-self: start; /* вот эта строчка фиксирует высоту по контенту */
}
                .works-list { margin-top: 10px; display:inline-flex; }
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
                <div class="qr" id="qr">
                    <img src="${qrCanvas.toDataURL('image/png')}" alt="QR Code" />
                </div>

                <!-- Квадрант зубов -->
                <div style="max-width: 350px">
                <div style="margin-top:-55px;"><h3>Типы работ:</h3></div>
                <div class="tooth-grid" id="tooth-grid">
                    ${quadrants}
                </div>
                 
                 <div style="margin-top:5px;">
                        ${worksHtml}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);

    doc.close();

    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        console.log("Печать завершена");

        const qrDiv = iframe.contentDocument.getElementById("qr");
        if (qrDiv) {
        const rect1 = qrDiv.getBoundingClientRect();
        console.log("QR Ширина:", rect1.width, "px");
        console.log("QR Высота:", rect1.height, "px");
    } else {
        console.log("QR не найден в iframe!");
    }
        const quadrantDiv = iframe.contentDocument.getElementById("tooth-grid");
    if (quadrantDiv) {
        const rect = quadrantDiv.getBoundingClientRect();
        console.log("Ширина:", rect.width, "px");
        console.log("Высота:", rect.height, "px");
    } else {
        console.log("Квадрант не найден в iframe!");
    }
    }, 300);
}
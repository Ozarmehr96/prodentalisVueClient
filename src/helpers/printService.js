/**
 * Печать заказа.
 * @param {*} order 
 * @returns 
 */
export function printOrder(order) {
    let orderId = order.id;
    console.log("--- Печать заказа ---", orderId);

    // Находим основной блок заказа
    const orderBody = document.getElementById(`order-${orderId}-body`);
    if (!orderBody) return console.log("Блок заказа не найден!");

    // Клонируем весь блок
    const clone = orderBody.cloneNode(true);

    // Заменяем canvas QR на img
    const originalCanvas = orderBody.querySelector("canvas");
    if (originalCanvas) {
    console.log("QR canvas найден, заменяем на img");
    const img = document.createElement("img");
    img.src = originalCanvas.toDataURL("image/png");
    img.alt = "QR Code";
    img.style.width = originalCanvas.style.width || "150px";
    img.style.height = originalCanvas.style.height || "150px";
    const clonedCanvas = clone.querySelector("canvas");
    if (clonedCanvas) clonedCanvas.replaceWith(img);
    }

    // Создаём iframe для печати
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Печать заказа №${order.number}</title>
            <link rel="stylesheet" href="/path-to-your-bootstrap.css">
            <style>
            @page { size: A4; margin: 15mm; }
            body {
                margin: 0;
                font-family: Arial, sans-serif;
                font-size: 16px; /* увеличен стандартный шрифт */
                color: #000;
            }
            h3 {
                font-size: 20px; /* заголовок ещё крупнее */
                font-weight: bold;
                margin-bottom: 12px;
            }
            .card-body {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 25px;
            }
            .main-data {
                flex: 1;
            }
            .qr-code img {
                display: block;
                margin-left: auto;
            }
            ul {
                padding-left: 15px;
                margin: 0;
            }
            .orderKey {
                width: 120px;
                display: inline-block;
                color: #555;
                font-weight: 600;
            }
            .fw-semibold {
                font-weight: 600;
            }
            [style*="cursor"] {
                cursor: default !important;
            }
            button, .btn, .icon {
                display: none !important;
            }
            .teeth {
                gap: 3px;
                flex-wrap: wrap;
            }
            .tooth {
                display: inline-block;
                min-width: 16px;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 3px 6px;
                font-size: 14px; /* крупнее для зубов */
            }
            </style>
        </head>
        <body>
            <h3>Заказ №${order.number}</h3>
            ${clone.outerHTML}
            <p style="padding-top:10px;">Создано пользователем: ${order.created_user_name}</p>
        </body>
        </html>
    `);
    doc.close();

    setTimeout(() => {
     iframe.contentWindow.focus();
     iframe.contentWindow.print();
     document.body.removeChild(iframe);
     console.log("Печать завершена, iframe удалён");
    }, 300);
}

<template>
  <div class="card h-100 shadow-sm mb-3">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span class="fw-bold">Заказ №{{ order.id }}</span>
      <span class="badge" :class="getStatusClass(order.status.code)">
        {{ order.status.name }}
      </span>
    </div>

    <div
      class="card-body d-flex justify-content-between align-items-start"
      style="padding-bottom: 0 !important; margin-bottom: -15px"
    >
      <!-- Левая колонка: данные заказа -->
      <div class="main-data me-3" style="flex: 1 1 auto">
        <!-- Заказчик и пациент -->
        <p class="mb-1">
          <i class="bi bi-person"></i>
          Заказчик: {{ order.customer_name }}
        </p>
        <p class="mb-1">
          <i class="bi bi-person-fill"></i>
          Пациент: {{ order.patient_name }}
        </p>

        <!-- Дата создания -->
        <p class="mb-1">
          <i class="bi bi-calendar"></i>
          Создан: {{ $toDateTimeFormat(order.created_at) }}
        </p>

        <!-- Срок исполнения -->
        <p class="mb-1 text-danger fw-bold">
          <i class="bi bi-hourglass-split"></i>
          Срок: {{ $toDateFormat(order.expired_at) }}
        </p>

        <!-- Комментарий -->
        <p v-if="order.description" class="mb-1">
          <i class="bi bi-chat-left-text"></i>
          {{ order.description }}
        </p>

        <!-- Типы работ -->
        <div>
          <strong>Типы работ:</strong>
          <ul class="list-unstyled ms-2">
            <li
              v-for="wt in workTypes"
              :key="wt.id"
              class="mb-1 d-flex align-items-center"
            >
              <div
                class="workTypeBlock me-2"
                :style="`background-color:${wt.background_color};`"
              ></div>
              <span class="me-2">{{ wt.name }} :</span>
              <span class="text-muted">
                <div class="teeth d-inline-flex">
                  <span v-for="tooth in wt.teeth" :key="tooth" class="tooth">
                    {{ tooth }}
                  </span>
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Правая колонка: QR код -->
      <div class="qr-code" style="flex: 0 0 auto; min-width: 120px">
        <QrCode :link="host" :maxSize="150" :id="`order-qr-${order.id}`" />
      </div>
    </div>

    <div
      class="card-footer text-muted small d-flex align-items-center"
      style="max-height: 38px; padding: 0.25rem 0.5rem; overflow: hidden"
    >
      <!-- Текст слева -->
      <span class="text-truncate">
        Создано пользователем: {{ order.created_user_name }}
      </span>
      <!-- Кнопка справа -->
      <button
        class="btn btn-sm btn-outline-primary ms-auto"
        @click="printOrder(order.id)"
        title="Печать заказа"
        style="height: 28px; font-size: 0.75rem"
      >
        Печать
      </button>
    </div>
  </div>
</template>

<script>
import { convertOrderTeethToWorkTypes } from "../helpers/order-helpers";
import QrCode from "./QrCode.vue";
export default {
  name: "OrderCard",
  components: { QrCode },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // преобразование зубов в типы работ
    workTypes() {
      return convertOrderTeethToWorkTypes(this.order.teeth.slice());
    },
    host() {
      return `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? ":" + window.location.port : ""
      }/orders/${this.order.id}`;
    },
  },
  methods: {
    // парсинг зубов (они приходят строкой)
    parseTeeth(teethStr) {
      try {
        return JSON.parse(teethStr);
      } catch {
        return [];
      }
    },
    // стили для статуса
    getStatusClass(statusCode) {
      switch (statusCode) {
        case "Created":
          return "bg-primary";
        case "InProgress":
          return "bg-warning text-dark";
        case "Done":
          return "bg-success";
        case "Canceled":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    },

    printOrder(orderId) {
      console.log("--- Печать заказа ---", orderId);

      const orderBlock = document.getElementById(`order-qr-${orderId}`);
      if (!orderBlock) return console.log("Блок заказа не найден!");

      // клонируем блок
      const clone = orderBlock.cloneNode(true);

      // ищем canvas QR в оригинальном блоке, берём его dataURL
      const originalCanvas = orderBlock.querySelector("canvas");
      if (originalCanvas) {
        console.log("QR canvas найден, заменяем на img");
        const img = document.createElement("img");
        img.src = originalCanvas.toDataURL("image/png");

        // сохраняем размеры canvas
        img.style.width = originalCanvas.style.width || "150px";
        img.style.height = originalCanvas.style.height || "150px";

        // заменяем canvas в клоне на img
        const clonedCanvas = clone.querySelector("canvas");
        if (clonedCanvas) clonedCanvas.replaceWith(img);
      } else {
        console.log("QR canvas не найден, печатаем без QR");
      }

      // создаём скрытый iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`
      <html>
        <head>
          <title>Печать заказа</title>
          <link rel="stylesheet" href="/path-to-your-bootstrap.css">
          <style>
            @page { size: A4; margin: 10mm; }
            body {
              margin: 0;
              padding: 0;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <h3>Заказ №${orderId}</h3>
          ${clone.outerHTML}
          </body>
      </html>
    `);
      doc.close();

      setTimeout(() => {
        console.log("Вызов print()");
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
        console.log("Печать завершена, iframe удалён");
      }, 200);
    },
  },
};
</script>

<style scoped>
.workTypeBlock {
  width: 20px;
  height: 20px;
  display: inline-flex;
}
.card {
  border-radius: 1rem;
}
.teeth {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tooth {
  font-size: 14px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>

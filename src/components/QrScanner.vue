<template>
  <div v-if="show" class="qr-wrapper">
    <!-- Видео камеры -->
    <div id="qr-reader" v-if="!isIosPwa()"></div>

    <!-- Затемнение вокруг квадрата -->
    <div class="overlay">
      <div class="overlay-top"></div>
      <div class="overlay-bottom"></div>
      <div class="overlay-left"></div>
      <div class="overlay-right"></div>
    </div>

    <!-- Квадрат сканирования -->
    <div class="scan-area">
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>
    </div>

    <!-- Кнопка закрытия -->
    <button class="btn btn-danger close-btn" @click="close">✕</button>

    <!-- Кнопка для iOS PWA live / фото -->
    <button
      v-if="needsUserGesture && !scanning"
      class="btn btn-primary start-btn"
      @click="isIosPwa() ? pickImage() : start()"
    >
      {{ isIosPwa() ? "Сделать фото QR" : "Открыть камеру" }}
    </button>

    <!-- Текст подсказки для iOS -->
    <div v-if="needsUserGesture && !scanning" class="text-ios">
      {{
        isIosPwa()
          ? "Сделайте фото QR-кода"
          : "Нажмите 'Открыть камеру', чтобы начать сканирование QR"
      }}
    </div>

    <!-- Скрытый input для фото iOS -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      style="display: none"
      @change="decodeImage"
    />
  </div>
</template>

<script>
import { Html5Qrcode } from "html5-qrcode";

export default {
  name: "QRScanner",
  props: { show: { type: Boolean, required: true } },
  data() {
    return {
      scanner: null,
      scanning: false,
      needsUserGesture: false,
    };
  },
  watch: {
    async show(val) {
      if (val) {
        await this.$nextTick();
        this.needsUserGesture = this.isIosPwa();
        if (!this.needsUserGesture) this.start();
      } else {
        this.stop();
      }
    },
  },
  methods: {
    isIosPwa() {
      const ua = window.navigator.userAgent;
      const isIos = /iPhone|iPad|iPod/i.test(ua);
      const standalone = window.matchMedia("(display-mode: standalone)").matches;
      return isIos && standalone;
    },

    async start() {
      if (this.scanning) return;

      const el = document.getElementById("qr-reader");
      if (!el) return;

      this.scanner = new Html5Qrcode("qr-reader");

      try {
        await this.scanner.start(
          { facingMode: "environment" },
          { fps: 10, disableFlip: false },
          (decodedText) => {
            this.decodeUrlAndGoToView(decodedText);
            this.close();
          }
        );

        this.scanning = true;

        // Растягиваем видео и canvas на весь контейнер
        const videos = el.getElementsByTagName("video");
        const canvases = el.getElementsByTagName("canvas");
        [...videos, ...canvases].forEach((el) => {
          el.style.width = "100%";
          el.style.height = "100%";
          el.style.objectFit = "cover";
          el.style.position = "absolute";
          el.style.top = "0";
          el.style.left = "0";
        });
      } catch (e) {
        alert(
          "Не удалось получить доступ к камере. Попробуйте открыть через Safari или нажмите 'Открыть камеру'."
        );
        console.error(e);
        this.scanner = null;
        this.scanning = false;
      }
    },

    async pickImage() {
      this.$refs.fileInput.click();
    },

    async decodeImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const result = await Html5Qrcode.scanFile(file, true);
        if (result) {
          this.close();
          this.decodeUrlAndGoToView(result);
        }
      } catch (e) {
        alert("QR-код не распознан, попробуйте еще раз.");
        console.error(e);
      } finally {
        event.target.value = null; // очистка input
      }
    },

    async stop() {
      if (this.scanner && this.scanning) {
        try {
          await this.scanner.stop();
          await this.scanner.clear();
        } catch (e) {
          console.warn("Stop scanner error", e);
        } finally {
          this.scanner = null;
          this.scanning = false;
        }
      }
    },

    decodeUrlAndGoToView(url) {
      if (!url) {
        return;
      }

      try {
        // Создаем объект URL (безопаснее, чем просто split)
        const parsed = new URL(url);

        // Берем путь после домена
        const path = parsed.pathname; // "/orders/view/486"

        // Проверяем формат: /orders/view/<id>, где id = цифры, буквы или дефисы
        const regex = /^\/orders\/view\/[\w-]+$/;
        if (regex.test(path)) {
          // Всё ок, переходим
        } else {
          alert("QR-код содержит недопустимый путь");
          return;
        }

        // Переходим через router
        this.$router.push(path);
      } catch (e) {
        console.error("QR не содержит корректного URL", e);
        alert("QR-код некорректный или не поддерживается");
      }
    },

    close() {
      this.stop();
      this.$emit("update:show", false);
    },
  },
  beforeUnmount() {
    this.stop();
  },
};
</script>

<style scoped>
.qr-wrapper {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 100000;
}

/* Видео на весь контейнер */
#qr-reader,
#qr-reader > div,
#qr-reader video,
#qr-reader canvas {
  position: absolute !important;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: 0;
}

/* Overlay затемнение вокруг квадрата */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

/* Четыре блока вокруг квадрата */
.overlay-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(50% - 130px);
  background: rgba(0, 0, 0, 0.6);
}
.overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(50% - 130px);
  background: rgba(0, 0, 0, 0.6);
}
.overlay-left {
  position: absolute;
  top: calc(50% - 130px);
  left: 0;
  width: calc(50% - 130px);
  height: 260px;
  background: rgba(0, 0, 0, 0.6);
}
.overlay-right {
  position: absolute;
  top: calc(50% - 130px);
  right: 0;
  width: calc(50% - 130px);
  height: 260px;
  background: rgba(0, 0, 0, 0.6);
}

/* Квадрат сканирования */
.scan-area {
  position: absolute;
  width: 260px;
  height: 260px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-sizing: border-box;
}

/* Углы квадрата */
.corner {
  position: absolute;
  width: 32px;
  height: 32px;
  border: 4px solid #00ff99;
}
.tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}
.tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}
.bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}
.br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

/* Кнопки */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
}
.start-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}
.text-ios {
  position: absolute;
  bottom: 100px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 16px;
  z-index: 20;
}

/* Адаптив */
@media (max-width: 480px) {
  .scan-area {
    width: 220px;
    height: 220px;
  }
}
</style>

<template>
  <div v-if="show" class="qr-wrapper">
    <!-- Видео камеры всегда в DOM -->
    <div id="qr-reader"></div>

    <div class="overlay"></div>

    <div class="scan-area">
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>
    </div>

    <button class="btn btn-danger close-btn" @click="close">✕</button>

    <!-- Кнопка для iOS PWA -->
    <button
      v-if="needsUserGesture && !scanning"
      class="btn btn-primary start-btn"
      @click="start"
    >
      Открыть камеру
    </button>

    <!-- Текст подсказки -->
    <div v-if="needsUserGesture && !scanning" class="text-ios">
      Нажмите "Открыть камеру", чтобы начать сканирование QR
    </div>
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

        // Автостарт только если не iOS PWA
        if (!this.needsUserGesture) {
          this.start();
        }
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
            alert(`QR: ${decodedText}`);
            this.close();
          }
        );

        this.scanning = true;
      } catch (e) {
        alert(
          "Не удалось получить доступ к камере. Попробуйте открыть через Safari или нажмите 'Открыть камеру'."
        );
        console.error(e);
        this.scanner = null;
        this.scanning = false;
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
  z-index: 9999;
}

#qr-reader {
  width: 100%;
  height: 100%;
}

#qr-reader video,
#qr-reader canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

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

@media (max-width: 480px) {
  .scan-area {
    width: 220px;
    height: 220px;
  }
}
</style>

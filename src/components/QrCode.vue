<template>
  <div class="qr-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  name: "QrCodeAdaptive",
  props: {
    link: {
      type: String,
      required: true,
    },
    maxSize: {
      type: Number,
      default: 150, // максимальный размер QR
    },
  },
  mounted() {
    this.generateQr(this.link);
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    link(newLink) {
      this.generateQr(newLink);
    },
  },
  methods: {
    async generateQr(link) {
      if (!link) return;
      const canvas = this.$refs.canvasRef;

      // размер под ширину родителя, но не больше maxSize
      const parentWidth = canvas.parentElement.clientWidth;
      const size = Math.min(this.maxSize, parentWidth);

      try {
        await QRCode.toCanvas(canvas, link, {
          width: size,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        });
      } catch (err) {
        console.error("Ошибка генерации QR:", err);
      }
    },
    handleResize() {
      // пересоздаём QR при изменении ширины родителя
      this.generateQr(this.link);
    },
  },
};
</script>

<style scoped>
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>

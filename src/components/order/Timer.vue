<template>
  <span class="pt-1">
    {{ timerDisplay }}
  </span>
</template>

<script>
export default {
  name: "TimerBadge",
  props: {
    // Начальное значение таймера в миллисекундах
    elapsedTime: {
      type: Number,
      default: 0,
    },
    // Если true, таймер запускается
    running: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timer: this.elapsedTime,
      timerInterval: null,
    };
  },
  computed: {
    timerDisplay() {
      const totalSeconds = Math.floor(this.timer / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  watch: {
    running(newVal) {
      if (newVal) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    },
  },
  methods: {
    startTimer() {
      if (this.timerInterval) return;
      this.timerInterval = setInterval(() => {
        this.timer += 1000;
      }, 1000);
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    resetTimer(ms = 0) {
      this.stopTimer();
      this.timer = ms;
    },
  },
  mounted() {
    if (this.running) {
      this.startTimer();
    }
  },
  beforeUnmount() {
    this.stopTimer();
  },
};
</script>

<style scoped>
/* Можно добавить стили при желании, например увеличить шрифт таймера */
</style>

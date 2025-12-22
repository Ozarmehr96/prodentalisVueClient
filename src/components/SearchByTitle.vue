<template>
  <!-- Обёртка на всю ширину -->
  <div class="w-100">
    <div class="input-group position-relative">
      <!-- Поле ввода -->
      <input
        type="text"
        class="form-control form-control-lg"
        placeholder="Введите название для поиска..."
        aria-label="Поиск по названию"
        v-model="searchQuery"
        @input="handleInput"
      />

      <!-- Кнопка очистки (появляется только если есть текст) -->
      <button
        v-if="searchQuery"
        class="btn btn-outline-secondary border-start-0"
        type="button"
        @click="clearSearch"
        title="Очистить"
      >
        <!-- Иконка крестика из Bootstrap Icons -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-x-lg"
          viewBox="0 0 16 16"
        >
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>

      <!-- Кнопка поиска (опционально, если захотите) -->
      <!-- <button class="btn btn-primary" type="button">
        <i class="bi bi-search"></i>
      </button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "SerachByTitle",
  data() {
    return {
      searchQuery: "", // Текущее значение в поле ввода
      debounceTimer: null, // Таймер для debounce
    };
  },
  methods: {
    // Обрабатываем ввод с debounce (чтобы не спамить событиями)
    handleInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        // Эмитируем событие search с текущим значением
        this.$emit("search", this.searchQuery.trim());
      }, 300);
    },
    // Очистка поля и отправка пустого запроса
    clearSearch() {
      this.searchQuery = "";
      clearTimeout(this.debounceTimer);
      // Сразу отправляем пустую строку, чтобы сбросить результаты
      this.$emit("search", "");
    },
  },
};
</script>

<style scoped>
/* Делаем кнопку очистки аккуратной внутри input-group */
.input-group .btn {
  z-index: 3;
}

.form-control-lg {
  font-size: 1rem;
}
</style>

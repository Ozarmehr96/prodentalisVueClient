<template>
  <!-- Спиннер -->
  <div class="spinner-wrapper">
    <div class="spinner-border text-primary spinner" role="status">
      <span class="visually-hidden">Загрузка...</span>
    </div>
  </div>
</template>
<style scoped>
.spinner-wrapper {
  position: relative;
  left: 50%;
  /* по центру */
  z-index: 99910;
  /* чтобы был поверх контента */
}
</style>

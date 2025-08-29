<template>
  <button
    type="button"
    class="btn-lg plus-button ms-auto"
    @click="() => $emit(`onClickEvent`)"
  />
</template>

<style>
.plus-button {
  background-image: url("@/assets/plus.svg");
  background-repeat: no-repeat !important; /* отключаем повтор */
  background-position: center !important; /* центрируем */
  background-size: contain !important; /* масштабируем по размеру кнопки */
  width: 40px; /* правильные единицы */
  height: 40px;
  display: inline-block;
  border: none; /* опционально: убрать границу */
  padding: 0; /* убрать внутренние отступы */
  background-color: #3dd2cc;
  border-radius: 25px;
}
.plus-button:hover {
  background-color: #36bfba;
}
</style>

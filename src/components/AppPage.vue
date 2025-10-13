<template>
  <!-- Main content -->
  <div class="content flex-grow-1 me-3">
    <div
      class="content-header d-flex align-items-center"
      style="margin-bottom: 16px"
    >
      <!-- Кнопка назад с иконкой -->
      <span
        v-if="showBackButton"
        @click="() => $router.back()"
        class="back-link d-flex align-items-center me-3"
        title="Назад"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          class="bi bi-arrow-left me-1"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </span>

      <i class="bi bi-arrow-left"></i>
      <!-- Заголовок -->
      <span class="fs-4">{{ title }}</span>

      <!-- Кнопка добавить -->
      <add-button
        v-if="isShowAddButton"
        @onClickEvent="() => $emit('onAddButtonClickEvent')"
        class="ms-auto"
      />
      <slot name="headerline"></slot>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import AddButton from "./AddButton.vue";
export default {
  name: "AppPage",
  components: {
    AddButton,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    showBackButton: {
      type: Boolean,
      default: false,
    },
    isShowAddButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style>
.content-header {
  border-bottom: var(--bs-border-width) solid;
  padding-top: 10px;
  height: 58px;
  max-height: 58px;
  border-bottom-color: rgb(194 196 197);
}
.back-link:hover {
  cursor: pointer;
  color: #3dd2cc !important;
}
</style>

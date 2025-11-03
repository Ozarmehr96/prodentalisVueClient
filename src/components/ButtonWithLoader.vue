<template>
  <template v-if="!isLoading">
    <button
      :type="type"
      :class="['btn', ...customClasses]"
      :disabled="isLoading || !isValid"
    >
      {{ title }}
    </button>
  </template>
  <template v-else>
    <button :class="['btn', ...customClasses]" type="button" disabled>
      <span
        class="spinner-border spinner-border-sm"
        style="border-right-color: white !important"
        role="status"
        aria-hidden="true"
      ></span>
      {{ loadingText }}
    </button>
  </template>
</template>

<script>
import Spinner from "./Spinner.vue";

export default {
  name: "ButtonWithLoader",
  components: {
    Spinner,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    customClasses: {
      type: Array,
      default: () => ["btn-primary", "w-100", "brand-style"],
    },
    loadingText: {
      type: String,
      default: "Сохраняем...",
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "button",
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style scoped>
.btn:disabled {
  color: black !important;
  border-color: #6c757d !important;
  background-color: transparent !important;
}
.brand-style {
  color: white !important;
}
</style>

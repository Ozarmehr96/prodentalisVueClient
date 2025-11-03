<template>
  <div class="multi-select w-100">
    <label v-if="label" class="form-label">{{ label }}</label>

    <!-- Область выбора -->
    <div
      class="form-select d-flex flex-wrap align-items-center p-2"
      :class="{ 'is-invalid': error }"
      @click="toggleDropdown"
    >
      <!-- Выбранные элементы -->
      <span
        v-for="option in selectedOptions"
        :key="option.value"
        class="badge bg-primary me-1 mb-1 d-flex align-items-center"
      >
        {{ option.label }}
        <button
          type="button"
          class="btn-close btn-close-white ms-1"
          style="font-size: 0.6rem"
          @click.stop="removeOption(option.value)"
        ></button>
      </span>

      <!-- Плейсхолдер -->
      <span v-if="selectedOptions.length === 0" class="text-muted">
        {{ placeholder }}
      </span>
    </div>

    <!-- Выпадающий список -->
    <div
      v-if="isOpen"
      class="border rounded mt-1 bg-white shadow-sm position-absolute w-100"
      style="z-index: 1000; max-height: 200px; overflow-y: auto"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item d-flex align-items-center"
        @click="toggleOption(option.value)"
      >
        <input
          class="form-check-input me-2"
          type="checkbox"
          :checked="modelValue.includes(option.value)"
        />
        <span>{{ option.label }}</span>
      </div>
    </div>

    <!-- Ошибка -->
    <div v-if="error" class="invalid-feedback d-block">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: "MultiSelect",
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
      // пример: [{ value: 1, label: 'Админ' }]
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Выберите значение",
    },
    error: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    selectedOptions() {
      return this.options.filter((o) => this.modelValue.includes(o.value));
    },
  },
  mounted() {
    // Закрывать выпадашку при клике вне
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    toggleOption(value) {
      const newValue = [...this.modelValue];
      const index = newValue.indexOf(value);

      if (index === -1) newValue.push(value);
      else newValue.splice(index, 1);

      this.$emit("update:modelValue", newValue);
    },
    removeOption(value) {
      const newValue = this.modelValue.filter((v) => v !== value);
      this.$emit("update:modelValue", newValue);
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    },
  },
};
</script>

<style scoped>
.multi-select {
  position: relative;
}

.dropdown-item {
  cursor: pointer;
  padding: 6px 12px;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>

<template>
  <div 
    class="color-picker-wrapper position-relative" 
    @click="handleClick"
    ref="pickerWrapper"
    :style="{ width: width + 'px', height: height + 'px', backgroundColor: color }"
  >
    <input 
      ref="colorInput"
      type="color"
      v-model="color"
      class="d-none"
      @input="onColorChange"
    />
  </div>
</template>

<script>
export default {
  name: "ColorPicker",
  props: {
    modelValue: {
      type: String,
      default: "#ffffff",
    },
    width: {
      type: Number,
      default: 150
    },
    height: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      color: this.modelValue
    };
  },
  watch: {
    modelValue(newVal) {
      this.color = newVal;
    }
  },
  methods: {
    handleClick(event) {
      // Получаем позицию клика относительно блока
      const rect = this.$refs.pickerWrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Сохраняем координаты
      this.$emit('click-position', { x, y });

      // Открываем системный color picker
      this.$refs.colorInput.click();
    },
    onColorChange() {
      // Всегда возвращаем HEX
      this.$emit('update:modelValue', this.color);
    }
  }
};
</script>

<style scoped>
.color-picker-wrapper {
  border: 2px solid #ccc;
  cursor: pointer;
  border-radius: 6px;
  transition: border-color 0.2s;
}
.color-picker-wrapper:hover {
  border-color: #007bff;
}
</style>

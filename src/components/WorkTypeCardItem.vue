<template>
  <div
    class="work-type-card d-flex align-items-center p-2 rounded"
    :style="{
      backgroundColor: workType.background_color,
      selectedCard: workType.isSelected,
    }"
    :class="{ selectedCard: workType.isSelected }"
    :title="isEditMode ? 'Нажмите, чтобы изменить цвет' : null"
    @click="$emit('click')"
  >
    <!-- Картинка слева фиксированного размера -->
    <img
      :src="imageSrc ?? imagePath"
      :title="isEditMode ? 'Нажмите, чтобы изменить картинку' : null"
      class="work-type-image me-2"
    />
    <!-- Название по центру вертикально -->
    <div
      class="flex-grow-1 work-type-name"
      :style="workType.background_color ? 'color:white !important' : ''"
    >
      {{ workType.name }}
      <div class="teeth" v-if="workType.teeth && workType.teeth.length > 0">
        <span v-for="tooth in workType.teeth" :key="tooth" class="tooth">
          {{ tooth }}
        </span>
      </div>
    </div>

    <span v-if="workType.isSelected" class="selected-check">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#007bff"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  </div>
</template>

<script>
import { baseHost } from "../services/constans";

export default {
  name: "WorkTypeCard",
  props: {
    workType: {
      type: Object,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      required: false,
    },
    imageSrc: {
      type: String,
      default: null,
    },
  },
  computed: {
    imagePath() {
      return this.workType.image_url
        ? `${baseHost}/${this.workType.image_url}`
        : this.workType.imageSrc;
    },
  },
};
</script>

<style scoped>
.tooth {
  font-size: 12px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
.teeth {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  color: black;
}
.work-type-card {
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid #ccc;
  height: 70px; /* фиксированная высота блока */
}

.work-type-card:hover {
  border-color: #007bff;
}

.work-type-image {
  width: 50px; /* фиксированная ширина картинки */
  height: 50px; /* фиксированная высота картинки */
  object-fit: cover;
}

.work-type-name {
  font-size: 16px;
  font-weight: 500;
}

.selected-check {
  position: absolute;
  top: 4px;
  right: 10px;
  color: #007bff;
  width: 18px;
  height: 18px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  pointer-events: none;
}

.selectedCard {
  border: 1px solid #007bff !important; /* синий цвет выделения */
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3) !important;
}
.work-type-card {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: 0.2s;
}
</style>

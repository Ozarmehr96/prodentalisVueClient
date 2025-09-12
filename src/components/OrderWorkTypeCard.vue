<template>
  <div
    class="work-type-card"
    @click="toggleSelect"
  >
    <!-- Иконка типа работы -->
    <div v-if="icon" class="icon">
      <img :src="icon || defaultIcon" alt="icon" />
    </div>

    <!-- Основные данные -->
    <div class="info">
      <!-- Заголовок + цвет -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="card-title mb-0">{{ name }}</h6>
      </div>

      <div class="teeth">
        <span v-for="tooth in teeth" :key="tooth" class="tooth">
          {{ tooth }}
        </span>
      </div>
    </div>

    <!-- Кнопка удаления -->
    <button class="delete-btn" @click.stop="deleteCard">✕</button>
  </div>
</template>

<script>
import { VITA_COLORS } from "../services/constans";
export default {
  name: "WorkTypeCard",
  props: {
    name: { type: String, required: true },
    color: { type: String, default: null },
    colorName: { type: String, default: "" },
    teeth: { type: Array, default: () => [] },
    icon: { type: String, default: null },
    selected: { type: Boolean, default: false },
  },
  data() {
    return {
      defaultIcon: "/default-work-icon.svg",
      isSelected: this.selected,
    };
  },
  methods: {
    toggleSelect() {
      this.isSelected = !this.isSelected;
      this.$emit("onUpdateSelected", this.isSelected);
    },
    deleteCard() {
      this.$emit("delete");
    },
    getColorByName(name) {
      return VITA_COLORS[name] || "#ccc"; // по умолчанию серый
    },
    getTextColor(bgColor) {
      if (!bgColor) return "#000";
      const c = bgColor.substring(1);
      const rgb = parseInt(c, 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? "#000" : "#fff";
    },
  },
};
</script>

<style scoped>
.work-type-card {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
  background: #fff;
  transition: box-shadow 0.2s ease;
}
.work-type-card.selected {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
  border-color: #999;
}
.icon img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.info {
  flex: 1;
}
.name {
  font-weight: bold;
  margin-bottom: 5px;
}
.color-badge {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 5px;
}
.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 5px;
  border: 1px solid #ccc;
}
.teeth {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tooth {
  font-size: 12px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
.delete-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  color: #999;
}
.delete-btn:hover {
  color: #f00;
}
</style>

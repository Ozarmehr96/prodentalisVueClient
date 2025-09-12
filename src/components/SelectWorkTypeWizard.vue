<template>
  <SidePanel title="Типы работ" :is-open="isOpen" @close="closePanel">
    <div class="work-type-grid">
      <div
        v-for="workType in availableWorkTypes"
        :key="workType.id"
        class="work-type-card"
        @click="selectWorkType(workType)"
      >
        <img
          v-if="workType.image_url"
          :src="workType.image_url"
          alt=""
          class="work-type-image"
        />
        <div class="work-type-name">{{ workType.name }}</div>
      </div>

      <span v-if="availableWorkTypes.length === 0" class="text-muted">Нет доступных типов работ</span>
    </div>
  </SidePanel>
</template>

<script>
import SidePanel from "./SidePanel.vue";

/**
 * Компонент выбора типов работ
 *
 * @vue-prop {Boolean} isOpen - видимость панели
 * @vue-prop {Array} availableWorkTypes - массив доступных типов работ [{id, name, image}]
 * @vue-event select - выбранный тип работы
 * @vue-event close - закрытие панели
 */
export default {
  name: "WorkTypeSelector",
  components: {
    SidePanel,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    availableWorkTypes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    selectWorkType(workType) {
      // Отправляем выбранный тип наружу
      this.$emit("select", workType);
    },
    closePanel() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.work-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.work-type-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.work-type-card:hover {
  border-color: #007bff;
  background-color: #e6f0ff;
}

.work-type-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-bottom: 4px;
}

.work-type-name {
  font-size: 14px;
  font-weight: 500;
}
</style>

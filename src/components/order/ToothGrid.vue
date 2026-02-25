<template>
  <div class="tooth-grid">
    <!-- Квадрант 1 (11–18) -->
    <div class="quadrant">
      <div
        v-for="tooth in quadrant1"
        :key="tooth.toothId"
        class="tooth-ongrid"
        :style="`background-color: ${tooth.background_color}`"
      >
        {{ tooth.toothId }}
      </div>
    </div>

    <!-- Квадрант 2 (21–28) -->
    <div class="quadrant">
      <div
        v-for="tooth in quadrant2"
        :key="tooth.toothId"
        class="tooth-ongrid"
        :style="`background-color: ${tooth.background_color}`"
      >
        {{ tooth.toothId }}
      </div>
    </div>

    <!-- Квадрант 3 (31–38) -->
    <div class="quadrant">
      <div
        v-for="tooth in quadrant3"
        :key="tooth.toothId"
        class="tooth-ongrid"
        :style="`background-color: ${tooth.background_color}`"
      >
        {{ tooth.toothId }}
      </div>
    </div>

    <!-- Квадрант 4 (41–48) -->
    <div class="quadrant">
      <div
        v-for="tooth in quadrant4"
        :key="tooth.toothId"
        class="tooth-ongrid"
        :style="`background-color: ${tooth.background_color}`"
      >
        {{ tooth.toothId }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    teeth: {
      type: Array,
      required: true,
    },
  },
  computed: {
    quadrant1() {
      return this.teeth.filter((t) => t.toothId >= 11 && t.toothId <= 18);
    },
    quadrant2() {
      return this.teeth.filter((t) => t.toothId >= 21 && t.toothId <= 28);
    },
    quadrant3() {
      return this.teeth.filter((t) => t.toothId >= 31 && t.toothId <= 38);
    },
    quadrant4() {
      return this.teeth.filter((t) => t.toothId >= 41 && t.toothId <= 48);
    },
  },
  methods: {
    getToothColor(id) {
      const tooth = this.teeth.find((t) => t.toothId === id);
      return tooth?.work_types?.[0]?.background_color || "#f0f0f0";
    },
  },
};
</script>

<style scoped>
.tooth-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: auto !important;
}

.quadrant {
  display: grid;
  grid-template-columns: repeat(4, 27px);
  grid-auto-rows: 27px;
  gap: 4px;
  border: 1px solid;
  padding: 16px;
  min-height: 92px !important;
}

.tooth-ongrid {
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #000;
}
</style>

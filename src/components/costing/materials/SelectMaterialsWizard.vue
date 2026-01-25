<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" ref="offcanvasRef">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Выбор расходного материала</h5>
      <button type="button" class="btn-close" @click="closeOffcanvas"></button>
    </div>

    <!-- Кнопка добавления нового расходника -->
    <button
      type="button"
      class="btn btn-primary me-3 ms-3 brand-style"
      @click="showMaterialModal = true"
    >
      Добавить новый расходный материал
    </button>

    <div class="offcanvas-body">
      <!-- Поиск -->
      <input
        type="text"
        class="form-control mb-3"
        placeholder="Поиск расходного материала..."
        v-model="searchQuery"
      />

      <!-- Список -->
      <div class="list-group">
        <button
          v-for="material in filteredMaterials"
          :key="material.id"
          type="button"
          class="list-group-item list-group-item-action"
          @click="selectMaterial(material)"
        >
          <div class="fw-bold" style="color: black">
            {{ material.name }}
          </div>
          <small class="text-muted">
            {{ material.unit_name }}
          </small>
        </button>

        <div v-if="filteredMaterials.length === 0" class="text-muted mt-2">
          Расходные материалы не найдены
        </div>
      </div>
    </div>

    <!-- Модалка добавления расходника -->
    <MaterialModal v-model:show="showMaterialModal" />
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";
import { mapGetters, mapActions } from "vuex";
import { MATERIAL, MATERIALS, LOAD_MATERIALS } from "../../../store/types";
import MaterialModal from "./MaterialModal.vue";

export default {
  name: "MaterialSelectOffcanvas",
  components: {
    MaterialModal,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: "",
      bsOffcanvas: null,
      showMaterialModal: false,
    };
  },
  computed: {
    ...mapGetters({
      materials: MATERIALS,
      material: MATERIAL,
    }),
    filteredMaterials() {
      return this.materials
        .filter(
          (m) => m.name && m.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        .sort((a, b) => a.name?.localeCompare(b.name));
    },
  },
  watch: {
    visible(val) {
      if (!this.bsOffcanvas) return;
      if (val) this.bsOffcanvas.show();
    },
  },
  async mounted() {
    // Загружаем материалы, если еще не загружены
    if (this.materials.length === 0) {
      await this.loadMaterials();
    }

    this.bsOffcanvas = new bootstrap.Offcanvas(this.$refs.offcanvasRef);

    // Закрытие
    this.$refs.offcanvasRef.addEventListener("hide.bs.offcanvas", () => {
      this.$emit("update:visible", false);
    });

    // Открытие
    this.$refs.offcanvasRef.addEventListener("show.bs.offcanvas", () => {
      this.$emit("update:visible", true);
    });

    if (this.visible) this.bsOffcanvas.show();
  },
  methods: {
    ...mapActions({
      loadMaterials: LOAD_MATERIALS,
    }),
    closeOffcanvas() {
      this.bsOffcanvas.hide();
    },
    selectMaterial(material) {
      // Отдаем выбранный материал наружу
      this.$emit("select-material", material);

      this.closeOffcanvas();
    },
  },
};
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>

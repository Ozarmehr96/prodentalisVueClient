<template>
  <app-page
    title="Расходные материалы"
    :isShowAddButton="canControl"
    @onAddButtonClickEvent="openMaterialModal"
  >
    <!-- Таблица расходных материалов -->
    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>Название</th>
            <th>Тип</th>
            <th>Комментарий</th>
            <th v-if="canControl">Действия</th>
          </tr>
        </thead>

        <tbody>
          <!-- Перебор расходных материалов -->
          <tr v-for="material in materials" :key="material.id">
            <td>{{ material.name }}</td>

            <!-- Тип расходника -->
            <td>
              {{ material.type.code === "material" ? "Материальный" : "Накладной" }}
            </td>

            <!-- Комментарий -->
            <td>{{ material.comment }}</td>

            <!-- Действия -->
            <td v-if="canControl">
              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <button
                  class="btn btn-sm btn-warning"
                  @click="openMaterialModal(material)"
                >
                  Редактировать
                </button>

                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteMaterial(material.id)"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>

          <!-- Если список пуст -->
          <tr v-if="!materials || materials.length === 0">
            <td colspan="8" class="text-muted py-3">Нет данных</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модалка добавления / редактирования -->
    <MaterialModal
      v-model:show="showMaterialModal"
      :material="selectedMaterial"
      :isEdit="!!selectedMaterial"
    />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";

import {
  MATERIALS,
  LOAD_MATERIALS,
  DELETE_MATERIAL,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
} from "../../../store/types";
import MaterialModal from "../../../components/costing/materials/MaterialModal.vue";
import WorkTypeMaterials from "../../../components/costing/work-type-materials/WorkTypeMaterialsTable.vue";

/**
 * Страница управления расходными материалами
 */
export default {
  components: {
    AppPage,
    MaterialModal,
    WorkTypeMaterials,
  },

  data() {
    return {
      showMaterialModal: false,
      selectedMaterial: null,
    };
  },

  computed: {
    ...mapGetters({
      materials: MATERIALS,
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
    }),

    myWorkTypeData() {
      return {
        name: "Циркон",
        items: [
          { name: "Аломинол", unit: 1, price: 120, quantity: 500 },
          { name: "Супергипс", unit: 1, price: 250, quantity: 400 },
          { name: "Штирь", unit: 3, price: 400, quantity: 1000 },
          // остальные позиции...
        ],
      };
    },
    /**
     * Может ли пользователь управлять данными
     */
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },

  async beforeMount() {
    // Загрузка расходных материалов
    await this.loadMaterials();
  },

  methods: {
    ...mapActions({
      loadMaterials: LOAD_MATERIALS,
      deleteMaterialAction: DELETE_MATERIAL,
    }),

    /**
     * Удаление расходника
     */
    deleteMaterial(materialId) {
      if (!confirm("Вы уверены, что хотите удалить расходный материал?")) {
        return;
      }

      this.deleteMaterialAction({
        id: materialId,
        callback: () => this.$toast("Расходный материал удалён"),
      });
    },

    /**
     * Открытие модального окна
     */
    openMaterialModal(material = null) {
      console.log(material);
      let m = JSON.parse(JSON.stringify(material));
      if (material) {
        m.type = m.type.code;
      }
      this.selectedMaterial = m;
      this.showMaterialModal = true;
    },
  },
};
</script>

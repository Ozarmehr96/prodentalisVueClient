<template>
  <app-page title="Себестоимость типов работ">
    <SearchByTitle @search="(n) => (searchName = n)" class="mb-3" />
    <template
      v-for="workTypeMaterials in filtredWorkTypeMaterials"
      :key="workTypeMaterials.id"
    >
      <WorkTypeMaterials :work-type="workTypeMaterials" />
    </template>
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../../components/AppPage.vue";

import {
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  WORK_TYPE_MATERIALS,
  LOAD_WORK_TYPE_MATERIALS,
} from "../../../store/types";
import WorkTypeMaterials from "../../../components/costing/work-type-materials/WorkTypeMaterialsTable.vue";
import SearchByTitle from "../../../components/SearchByTitle.vue";

/**
 * Страница управления расходными материалами
 */
export default {
  components: {
    AppPage,
    WorkTypeMaterials,
    SearchByTitle,
  },

  data() {
    return {
      showMaterialModal: false,
      selectedMaterial: null,
      searchName: "",
    };
  },

  computed: {
    ...mapGetters({
      workTypesMaterials: WORK_TYPE_MATERIALS,
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
    }),

    filtredWorkTypeMaterials() {
      if (this.searchName) {
        return this.workTypesMaterials
          .filter((type) =>
            type.name.toLowerCase().includes(this.searchName.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name));
      }

      return this.workTypesMaterials.sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * Может ли пользователь управлять данными
     */
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },

  async beforeMount() {
    // Загрузка расходных материалов типов работ
    await this.loadWorkTypeMaterials();
  },

  methods: {
    ...mapActions({
      loadWorkTypeMaterials: LOAD_WORK_TYPE_MATERIALS,
    }),

    /**
     * Открытие модального окна
     */
    openMaterialModal(material = null) {
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

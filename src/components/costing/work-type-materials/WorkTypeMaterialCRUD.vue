<template>
  <div class="card shadow-sm mb-4">
    <div
      class="p-3 d-flex justify-content-between align-items-center text-white"
      :style="`background: ${workType.background_color}`"
    >
      <router-link
        :to="`/work-types/${workType.id}`"
        class="nav-link link-dark"
        :title="`Перейти на карточку '${workType.name}'`"
      >
        <h2
          class="fw-bold mb-0"
          style="font-size: 1.5rem; color: white; text-decoration: underline"
        >
          {{ workType.name }}
        </h2>
      </router-link>
    </div>
    <div class="card-body">
      <table class="table table-bordered mb-3">
        <thead class="table-light">
          <tr>
            <th>№</th>
            <th>Название</th>
            <th>Норма расхода (ед.)</th>
            <th>Цена</th>
            <th>Количество</th>
            <th>Общ. сумма</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in materialsList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="item.name"
                :readonly="true"
              />
            </td>
            <td>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="item.norma"
                min="1"
              />
            </td>
            <td>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="item.price"
                :step="0.01"
                min="0"
              />
            </td>
            <td>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="item.quantity"
                min="1"
              />
            </td>
            <td>{{ ((item.norma * item.price) / item.quantity).toFixed(3) }}</td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="removeMaterial(item.id, index)"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-outline-primary" @click="openSelectMaterialWizard">
          Добавить материал
        </button>
        <ButtonWithLoader
          type="submit"
          :isLoading="isLoading"
          :title="'Сохранить'"
          loadingText=""
          :isValid="isValid"
          :customClasses="['btn', isValid ? 'brand-style' : 'btn-outline-secondary']"
          @click="saveMaterials"
        />
      </div>
    </div>

    <SelectMaterialsWizard
      v-model:visible="showSelectMaterialWizard"
      @select-material="onMaterialSelected"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex/dist/vuex.cjs.js";
import ButtonWithLoader from "../../ButtonWithLoader.vue";
import SelectMaterialsWizard from "../materials/SelectMaterialsWizard.vue";
import {
  IS_WORK_TYPE_MATERIALS_LOADING,
  SAVE_WORK_TYPE_MATERIAL,
} from "../../../store/types";
import { mapActions } from "vuex";

export default {
  name: "WorkTypeMaterialsForm",
  components: {
    SelectMaterialsWizard,
    ButtonWithLoader,
  },
  props: {
    workType: {
      type: Object,
      required: true,
      // структура:
      // {
      //   id: 1,
      //   name: "Металокерамика",
      //   steps: [],
      //   materials: [],
      //   final_price: 0.0
      // }
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      materialsList: [],
      showSelectMaterialWizard: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: IS_WORK_TYPE_MATERIALS_LOADING,
    }),
    isValid() {
      return (
        this.materialsList.length > 0 &&
        this.materialsList.every(
          (item) =>
            item.name &&
            item.norma > 0 &&
            item.price !== "" &&
            item.price >= 0 &&
            item.quantity > 0
        )
      );
    },
  },
  watch: {
    workType: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (!newVal || !newVal.materials) return;

        const materials = JSON.parse(JSON.stringify(newVal.materials));
        materials.forEach((item) => {
          item.material_id = item.material?.id ?? item.material_id;
          item.name = item.material?.name ?? item.name;
        });

        this.materialsList = this.sortedData(materials);
      },
    },
  },
  beforeDestroy() {
    this.materialsList.length = 0;
  },
  methods: {
    ...mapActions({
      saveWorkTypeMaterial: SAVE_WORK_TYPE_MATERIAL,
    }),
    openSelectMaterialWizard() {
      this.showSelectMaterialWizard = true;
    },
    onMaterialSelected(material) {
      if (this.$data.materialsList.find((m) => m.material_id === material.id)) {
        alert("Этот материал уже добавлен.");
        return;
      }

      this.materialsList.push({
        material_id: material.id,
        name: material.name,
        norma: 1,
        price: 0,
        quantity: 1,
        comment: "",
      });
      this.showSelectMaterialWizard = false;
    },
    addMaterial() {
      this.materialsList.push({
        name: "",
        material_id: null,
        norma: 1,
        price: 0,
        quantity: 1,
      });
    },
    removeMaterial(id, index) {
      if (this.workType.materials.some((m) => m.id === id)) {
        if (!confirm("Вы уверены, что хотите удалить этот материал?")) {
          return;
        }
      }
      this.materialsList.splice(index, 1);
    },
    async saveMaterials() {
      if (!confirm("Сохранить изменения в расходных материалах?")) {
        return;
      }

      await this.saveWorkTypeMaterial({
        workTypeId: this.workType.id,
        materials: this.materialsList,
        callback: () => {
          this.$toast("Расходные материалы сохранены");
          this.$router.push("/management/work-type-materials");
        },
      });
    },
    sortedData(materials) {
      materials.sort((a, b) => {
        // Сначала по типу: material.type.code
        if (a.material.type.code < b.material.type.code) return -1;
        if (a.material.type.code > b.material.type.code) return 1;

        // Если тип одинаковый, сортируем по названию: material.name
        if (a.material.name < b.material.name) return -1;
        if (a.material.name > b.material.name) return 1;

        return 0;
      });

      return materials;
    },
  },
};
</script>

<style scoped>
.table input {
  max-width: 120px;
}
</style>

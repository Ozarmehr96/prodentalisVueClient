<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content p-3 position-relative">
        <button
          v-if="!showSelectMaterialWizard"
          type="button"
          class="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          @click="close"
        ></button>

        <h5 class="mb-3">
          {{ isEdit ? "Редактирование закупки" : "Добавление закупки" }}
        </h5>

        <form @submit.prevent="savePurchase">
          <div class="row g-3">
            <!-- Материал -->
            <div class="col-12">
              <div class="form-floating">
                <input
                  @click="showSelectMaterialWizard = true"
                  :disabled="isEdit"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': !isNameValid && materialName }"
                  v-model.trim="materialName"
                  placeholder="Наименование"
                  readonly
                  required
                />
                <div class="invalid-feedback">Введите наименование закупки</div>
                <label>Материал</label>
              </div>
            </div>

            <!-- Количество -->
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control"
                  v-model.number="localItem.quantity"
                  placeholder="Количество"
                  required
                />
                <label>Количество</label>
              </div>
            </div>

            <!-- Единица измерения -->
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" v-model="localItem.unit">
                  <option value="шт">шт</option>
                  <option value="г">г</option>
                  <option value="кг">кг</option>
                  <option value="мл">мл</option>
                  <option value="л">л</option>
                  <option value="уп">уп</option>
                </select>
                <label>Единица</label>
              </div>
            </div>

            <!-- Цена за единицу -->
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control"
                  v-model.number="localItem.price"
                  placeholder="Цена за единицу"
                  required
                />
                <label>Цена за единицу</label>
              </div>
            </div>

            <!-- Итог -->
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <input
                  type="number"
                  class="form-control"
                  :value="totalAmount"
                  readonly
                  placeholder="Итого"
                />
                <label>Итого</label>
              </div>
            </div>

            <!-- Дата -->
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input
                  type="date"
                  class="form-control"
                  v-model="localItem.purchase_date"
                  placeholder="Дата закупки"
                  required
                />
                <label>Дата закупки</label>
              </div>
            </div>

            <!-- Комментарий -->
            <div class="col-12">
              <div class="form-floating">
                <textarea
                  class="form-control"
                  style="height: 100px"
                  v-model.trim="localItem.comment"
                  placeholder="Комментарий"
                ></textarea>
                <label>Комментарий</label>
              </div>
            </div>

            <!-- Кнопка -->
            <div class="col-12 d-flex justify-content-end mt-2">
              <ButtonWithLoader
                type="submit"
                :isLoading="isLoading"
                title="Сохранить"
                loadingText=""
                :isValid="isValid"
                :customClasses="[
                  'btn',
                  isValid ? 'brand-style' : 'btn-outline-secondary',
                ]"
              />
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>

    <SelectMaterialWizard
      v-model:visible="showSelectMaterialWizard"
      @select-material="onMaterialSelected"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ButtonWithLoader from "../../ButtonWithLoader.vue";
import SelectMaterialWizard from "../../../components/costing/materials/SelectMaterialsWizard.vue";

import {
  IS_PURCHASE_JOURNALS_LOADING,
  LOAD_MATERIALS,
  MATERIALS,
  SAVE_PURCHASE_JOURNAL,
  UPDATE_PURCHASE_JOURNAL,
} from "../../../store/types";

/* Пустой объект закупки */
const emptyItem = () => ({
  id: null,
  material_id: null,
  material_name: null,

  quantity: 0,
  unit: "шт",
  price: 0,

  amount: 0,

  purchase_date: new Date().toISOString().slice(0, 10), // сегодняшняя дата,
  comment: "",
});

export default {
  name: "PurchaseJournalModal",

  components: {
    ButtonWithLoader,
    SelectMaterialWizard,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      localItem: emptyItem(),
      showSelectMaterialWizard: false,
    };
  },

  watch: {
    item: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.setVal(val);
        } else {
          this.localItem = emptyItem();
        }
      },
    },

    show: {
      immediate: true,
      handler(val) {
        if (!this.isEdit && val === true) {
          this.localItem = emptyItem();
        }

        if (this.isEdit && val === true && this.item) {
          this.setVal(this.item);
          this.localItem.material_name =
            this.materials.find((m) => m.id === this.localItem.material_id)?.name || null;
          this.localItem.material_id =
            this.materials.find((m) => m.id === this.localItem.material_id)?.id || null;
        }
      },
    },

    /* Пересчёт суммы */
    "localItem.quantity": "updateAmount",
    "localItem.price": "updateAmount",
  },

  beforeMount() {
    if (this.materials.length === 0) {
      this.loadMaterials();
    }
  },

  computed: {
    ...mapGetters({
      isLoading: IS_PURCHASE_JOURNALS_LOADING,
      materials: MATERIALS,
    }),

    materialName() {
      return this.materials.find((m) => m.id === this.localItem.material_id)?.name || "";
    },

    totalAmount() {
      return (this.localItem.quantity || 0) * (this.localItem.price || 0);
    },

    isValid() {
      return (
        this.isNameValid && this.isQuantityValid && this.isPriceValid && this.isDateValid
      );
    },

    isNameValid() {
      return !!this.materialName?.trim();
    },

    isQuantityValid() {
      return this.localItem.quantity > 0;
    },

    isPriceValid() {
      return this.localItem.price > 0;
    },

    isDateValid() {
      return !!this.localItem.purchase_date;
    },
  },

  methods: {
    ...mapActions({
      savePurchaseAction: SAVE_PURCHASE_JOURNAL,
      updatePurchaseAction: UPDATE_PURCHASE_JOURNAL,
      loadMaterials: LOAD_MATERIALS,
    }),

    close() {
      this.showSelectMaterialWizard = false;
      this.$emit("update:show", false);
    },

    /* Установка значений при редактировании */
    setVal(val) {
      this.localItem = {
        id: val.id,
        material_id: val.material_id,
        material_name: val.material?.name?.trim(),

        quantity: val.quantity || 0,
        unit: val.unit || "шт",
        price: val.price || 0,

        amount: val.amount || 0,

        purchase_date: this.$toDateFormat(val.purchase_date, "YYYY-MM-DD") || "",
        comment: val.comment || "",
      };
    },

    /* Пересчет суммы */
    updateAmount() {
      this.localItem.amount =
        (this.localItem.quantity || 0) * (this.localItem.price || 0);
    },

    /* Сохранение */
    async savePurchase() {
      if (!this.isValid) return;

      const payload = {
        ...this.localItem,
      };

      if (this.isEdit) {
        await this.updatePurchaseAction({
          ...payload,
          callback: () => {
            this.close();
            this.$toast("Закупка успешно обновлена");
            this.$emit("saved");
          },
        });
      } else {
        await this.savePurchaseAction({
          ...payload,
          callback: () => {
            this.close();
            this.$toast("Закупка успешно создана");
            this.$emit("saved");
          },
        });
      }
    },

    /* Выбор материала */
    onMaterialSelected(material) {
      this.localItem.material_id = material.id;
      this.localItem.material_name = material.name;
    },
  },
};
</script>

<style scoped>
.modal {
  display: block;
  background: transparent;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal-dialog {
  z-index: 1050;
}
</style>

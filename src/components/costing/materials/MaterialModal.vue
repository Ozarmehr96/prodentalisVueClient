<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content p-3 position-relative">
        <!-- Кнопка закрытия -->
        <button
          type="button"
          class="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          @click="close"
        ></button>

        <h5 class="mb-3">
          {{
            isEdit
              ? "Редактирование расходного материала"
              : "Добавление расходного материала"
          }}
        </h5>

        <form @submit.prevent="saveMaterial">
          <div class="row g-3">
            <!-- Название расходника -->
            <div class="col-12">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  v-model.trim="localMaterial.name"
                  placeholder="Название расходника"
                  required
                />
                <label>Название расходника</label>
              </div>
            </div>

            <!-- Тип расходника -->
            <div class="col-12">
              <div class="form-floating">
                <select class="form-select" v-model="localMaterial.type" required>
                  <option value="" disabled>Выберите тип</option>
                  <option value="material">Материальный</option>
                  <option value="overhead">Накладной</option>
                </select>
                <label>Тип расходника</label>
              </div>
            </div>

            <!-- Комментарий -->
            <div class="col-12">
              <div class="form-floating">
                <textarea
                  class="form-control"
                  style="height: 100px"
                  v-model.trim="localMaterial.comment"
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
                :title="isEdit ? 'Сохранить' : 'Добавить'"
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  IS_MATERIALS_LOADING,
  SAVE_MATERIAL,
  UPDATE_MATERIAL,
} from "../../../store/types";
import ButtonWithLoader from "../../ButtonWithLoader.vue";

const emptyMaterial = () => ({
  id: null,
  name: "",
  type: "",
  comment: "",
});

export default {
  name: "MaterialModal",
  components: {
    ButtonWithLoader,
  },
  props: {
    material: {
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
      localMaterial: emptyMaterial(),
      /**
       * Справочник единиц измерения
       * key — то, что уходит на backend
       * name — то, что видит пользователь
       */
      materialUnits: [
        { key: "procent", name: "%" },
        { key: "g", name: "грамм" },
        { key: "ml", name: "миллилитр" },
        { key: "pcs", name: "штука" },
        { key: "m3", name: "куб. метр" },
        { key: "kwh", name: "кВт·ч" },
      ],
    };
  },
  watch: {
    material: {
      immediate: true,
      deep: true,
      handler(val) {
        this.localMaterial = val ? { ...val } : emptyMaterial();
      },
    },
    show: {
      immediate: true,
      handler(val) {
        if (!this.isEdit && val) this.localMaterial = emptyMaterial();
      },
    },
  },
  computed: {
    ...mapGetters({
      isLoading: IS_MATERIALS_LOADING,
    }),
    isValidName() {
      const regex = /^[A-Za-zА-Яа-я0-9]+( [A-Za-zА-Яа-я0-9]+)*$/;

      if (!regex.test(this.localMaterial.name)) {
        return false;
      }
      return true;
    },
    /**
     * Валидна ли форма
     */
    isValid() {
      return this.isValidName && this.localMaterial.type.trim() !== "";
    },
  },
  methods: {
    ...mapActions({
      saveMaterialAction: SAVE_MATERIAL,
      updateMaterialAction: UPDATE_MATERIAL,
    }),
    close() {
      this.$emit("update:show", false);
    },
    async saveMaterial() {
      if (!this.isValid) return;

      if (this.isEdit) {
        await this.updateMaterialAction({
          ...this.localMaterial,
          callback: () => {
            this.close();
            this.$toast("Расходный материал успешно обновлён");
          },
        });
      } else {
        await this.saveMaterialAction({
          ...this.localMaterial,
          callback: () => {
            this.close();
            this.$toast(`Расходный материал "${this.localMaterial.name}" успешно создан`);
          },
        });
      }
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

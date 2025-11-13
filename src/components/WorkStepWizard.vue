<template>
  <div class="mt-3">
    <div class="row">
      <div class="col-12" style="max-width: 720px">
        <form @submit.prevent="() => (isEditMode ? update() : save())" novalidate>
          <!-- Название -->
          <div class="mb-3">
            <label for="nameInput" class="form-label">Название этапа работы</label>
            <input
              type="text"
              id="nameInput"
              class="form-control"
              v-model="workStep.name"
              placeholder="Введите название этапа"
              required
            />
            <div class="invalid-feedback">Название обязательно для заполнения.</div>
          </div>

          <!-- Цена по умолчанию -->
          <div class="mb-3">
            <label for="priceInput" class="form-label">Цена по умолчанию</label>
            <input
              type="number"
              id="priceInput"
              class="form-control"
              v-model.number="workStep.price"
              min="0"
              max="10000"
              step="1"
              placeholder="Цена по умолчанию (≥ 0)"
              required
            />
            <div class="invalid-feedback">Цена должна быть неотрицательным числом.</div>
          </div>
          <!-- Основная роль -->
          <div class="mb-3">
            <label class="form-label">Исполнители этапа</label>
            <MultiSelect
              v-model="workStep.roles"
              :options="roles.map((r) => ({ value: r.id, label: r.name }))"
              placeholder="Выберите роль"
            />
          </div>

          <!-- Комментарии -->
          <div class="mb-3">
            <label for="descriptionInput" class="form-label">Комментарии</label>
            <textarea
              id="descriptionInput"
              class="form-control"
              v-model="workStep.description"
              rows="3"
              placeholder="Введите комментарии (не обязательно)"
            ></textarea>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 brand-style"
            :disabled="!isValid"
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { LOAD_ROLES, ROLES, SAVE_WORK_STEP, UPDATE_WORK_STEP } from "../store/types";
import MultiSelect from "./MultiSelect.vue";

export default {
  components: {
    MultiSelect,
  },
  props: {
    workStepData: {
      type: Object,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      workStep: {
        name: "",
        priority: null,
        price: null,
        description: "",
        roles: [],
      },
    };
  },
  async beforeMount() {
    await this.loadRoles();
    if (this.isEditMode && this.workStepData) {
      this.workStep = this.workStepData;
    }
  },
  computed: {
    ...mapGetters({
      roles: ROLES,
    }),
    isNameValid() {
      return this.workStep.name.trim() !== "";
    },
    isPriceValid() {
      return this.workStep.price !== null && this.workStep.price >= 0;
    },
    isValid() {
      return this.isNameValid && this.isPriceValid && this.workStep.roles.length > 0;
    },
  },
  methods: {
    ...mapActions({
      saveWorkStep: SAVE_WORK_STEP,
      updateWorkStep: UPDATE_WORK_STEP,
      loadRoles: LOAD_ROLES,
    }),
    async save() {
      let params = {
        ...this.workStep,
        callback: (newWorkStep) => {
          this.$toast(`Этап ${newWorkStep.name} добавлен.`, 5000);
          this.$router.go(-1);
        },
      };

      await this.saveWorkStep(params);
    },
    async update() {
      let params = {
        ...this.workStep,
        id: this.workStep.id,
        callback: (updatedWorkStep) => {
          this.$toast(`Этап ${updatedWorkStep.name} обновлен.`, 5000);
          this.$router.go(-1);
        },
      };
      await this.updateWorkStep(params);
    },
  },
};
</script>

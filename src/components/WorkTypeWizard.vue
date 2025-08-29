<template>
  <div class="mt-3">
    <div class="row">
      <div class="col-12" style="max-width: 720px">
        <form
          @submit.prevent="isEditMode ? updateWorkType() : createWorkType()"
        >
          <!-- Название -->
          <div class="mb-3">
            <label for="name" class="form-label">Название</label>
            <input
              type="text"
              id="name"
              class="form-control"
              v-model="workType.name"
              placeholder="Введите название"
            />
          </div>
          <!-- Комментарии -->
          <div class="mb-3">
            <label for="description" class="form-label">Комментарии</label>
            <textarea
              id="description"
              class="form-control"
              v-model="workType.description"
              rows="3"
              placeholder="Введите комментарии"
            ></textarea>
          </div>

          <!-- Тип работы -->
          <div class="mb-3">
            <SelectWorkStepWizard
              @onUpdateSelectedSteps="
                (newSteps) => {
                  this.selectedWorkSteps = newSteps;
                }
              "
            />
          </div>

          <!-- Логотип -->
          <div class="mb-3">
            <label for="image" class="form-label">Логотип</label>
            <input
              type="file"
              class="form-control"
              id="image"
              @change="onFileChange"
              accept="image/*"
            />
            <div class="mt-2" v-if="imagePreview">
              <img
                :src="imagePreview"
                alt="Preview"
                class="img-thumbnail"
                style="max-height: 200px"
              />
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 brand-style"
            :disabled="!isValid"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import SelectWorkStepWizard from "./SelectWorkStepWizard.vue";
import {
  LOAD_WORK_STEPS,
  SAVE_WORK_TYPE,
  SELECTED_WORK_TYPE_STEPS,
  SET_SELECTED_WORK_TYPE_STEPS,
  UPDATE_WORK_TYPE,
} from "../store/types";

export default {
  components: {
    SelectWorkStepWizard,
  },
  props: {
    workTypeData: {
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
      workType: {
        name: "",
        description: "",
        image: null,
      },
      imagePreview: null,
      selectedWorkSteps: [],
      isSaving: false,
    };
  },
  computed: {
    ...mapGetters({
      selectedWorkTypeSteps: SELECTED_WORK_TYPE_STEPS,
    }),
    isValid() {
      return (
        this.workType.name.trim() !== "" && this.selectedWorkSteps.length > 0
      );
    },
  },
  async beforeMount() {
    if (this.isEditMode && this.workTypeData) {
      this.workType = { ...this.workTypeData };
      let steps = [];
      await this.loadWorkSteps().then((s) => {
        steps = s;
      });

      this.selectedWorkSteps = this.workTypeData.steps;
      this.selectedWorkSteps.forEach((step) => {
        const foundStep = steps.find((s) => s.id === step.work_step_id);
        if (foundStep) {
          step.name = foundStep.name;
        }
      });
      this.setSelectedWorkTypeStep(this.selectedWorkSteps);
    }
  },
  async beforeMount() {
    // Проверяем, что мы в режиме редактирования и что данные типа работы существуют
    if (this.isEditMode && this.workTypeData) {
      // Создаём копию данных типа работы
      this.workType = { ...this.workTypeData };

      let steps = [];
      // Загружаем шаги работы асинхронно
      await this.loadWorkSteps().then((s) => {
        steps = s;
      });

      // Присваиваем выбранные этапы из данных типа работы
      this.selectedWorkSteps = this.workTypeData.steps;

      // Обрабатываем каждый этап, чтобы обновить его имя, если оно найдено в загруженных этапах
      this.selectedWorkSteps.forEach((step) => {
        const foundStep = steps.find((s) => s.id === step.work_step_id);
        if (foundStep) {
          step.name = foundStep.name;
        }
      });

      // Обновляем выбранные шаги в состоянии компонента
      this.setSelectedWorkTypeStep(this.selectedWorkSteps);
    }
  },

  methods: {
    ...mapActions({
      saveWorkType: SAVE_WORK_TYPE,
      updateWorkTypeAction: UPDATE_WORK_TYPE,
      loadWorkSteps: LOAD_WORK_STEPS,
      setSelectedWorkTypeStep: SET_SELECTED_WORK_TYPE_STEPS,
    }),
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.workType.image = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.workType.image = null;
        this.imagePreview = null;
      }
    },
    async createWorkType() {
      if (!this.workType.name.trim() || this.selectedWorkSteps.length === 0) {
        alert("Пожалуйста, заполните все обязательные поля");
        return;
      }
      this.isSaving = true;
      await this.saveWorkType({
        ...this.workType,
        steps: this.selectedWorkSteps,
        callback: (newWorkStep) => {
          this.$toast(`Тип работы ${newWorkStep.name} добавлен`, 7000);
          this.$router.go(-1);
        },
      });
      this.isSaving = false;
    },

    async updateWorkType() {
      if (!this.workType.name.trim() || this.selectedWorkSteps.length === 0) {
        alert("Пожалуйста, заполните все обязательные поля");
        return;
      }
      this.isSaving = true;
      await this.updateWorkTypeAction({
        ...this.workType,
        id: this.workType.id,
        steps: this.selectedWorkSteps,
        callback: (newWorkStep) => {
          this.$toast(`Тип работы обновлён`, 5000);
          this.$router.go(-1);
        },
      });
      this.isSaving = false;
    },
  },
};
</script>

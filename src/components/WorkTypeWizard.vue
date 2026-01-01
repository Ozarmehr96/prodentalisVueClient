<template>
  <div class="mt-3">
    <div class="row">
      <div class="col-12" style="max-width: 720px">
        <form @submit.prevent="isEditMode ? updateWorkType() : createWorkType()">
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

          <!-- Логотип -->
          <div class="mb-3" @click="(e) => clickWorkTypeItemCard(e)">
            <!-- Выбор цвет фона-->
            <ColorPalette
              v-model="workType.background_color"
              ref="colorPalette"
              class="form-control d-none"
            />
            <!-- Выбор картинки-->
            <input
              ref="fileInput"
              type="file"
              class="form-control d-none"
              id="image"
              @change="onFileChange"
              accept="image/*"
            />

            <div class="mt-2">
              <WorkTypeCardItem
                :workType="workType"
                :imageSrc="workType.imageSrc"
                isEditMode
                :backgroundColor="workType.background_color"
              />
            </div>
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

          <!-- Этапы работы -->
          <div class="mb-3">
            <label class="form-label">Этапы типа работы</label>
            <div class="form-text mb-2">
              Выберите последовательность этапов для этого типа работы
            </div>
            <SelectWorkStepWizard
              @onUpdateSelectedSteps="
                (newSteps) => {
                  this.selectedWorkSteps = newSteps;
                }
              "
            />
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
import SelectWorkStepWizard from "./SelectWorkStepWizard.vue";
import {
  LOAD_WORK_STEPS,
  SAVE_WORK_TYPE,
  SELECTED_WORK_TYPE_STEPS,
  SET_SELECTED_WORK_TYPE_STEPS,
  UPDATE_WORK_TYPE,
} from "../store/types";
import WorkTypeCardItem from "./WorkTypeCardItem.vue";
import ColorPalette from "./ColorPalette.vue";

export default {
  components: {
    SelectWorkStepWizard,
    WorkTypeCardItem,
    ColorPalette,
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
      selectedWorkSteps: [],
      isSaving: false,
    };
  },
  computed: {
    ...mapGetters({
      selectedWorkTypeSteps: SELECTED_WORK_TYPE_STEPS,
    }),
    isValid() {
      return this.workType.name.trim() !== "";
    },
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
    } else {
      this.setSelectedWorkTypeStep([]);
    }
  },

  methods: {
    ...mapActions({
      saveWorkType: SAVE_WORK_TYPE,
      updateWorkTypeAction: UPDATE_WORK_TYPE,
      loadWorkSteps: LOAD_WORK_STEPS,
      setSelectedWorkTypeStep: SET_SELECTED_WORK_TYPE_STEPS,
    }),
    /**
     * Выбор цвета или картинки
     * @param e
     */
    clickWorkTypeItemCard(e) {
      if (e.srcElement.localName === "img") {
        this.$refs.fileInput.click();
      } else {
        this.$refs.colorPalette.handleClick(e);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.workType.image = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.workType.imageSrc = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.workType.image = null;
      }
    },
    async createWorkType() {
      if (this.selectedWorkSteps.length == 0) {
        if (!confirm("Вы не выбрали ни один этап работы. Продолжить?")) {
          return;
        }
      }

      if (!this.workType.name.trim()) {
        alert("Пожалуйста, заполните все обязательные поля");
        return;
      }
      this.isSaving = true;
      let params = {
        ...this.workType,
        steps: this.selectedWorkSteps,
      };
      params.imageSrc = null;
      let formData = this.objectToFormData(params);

      await this.saveWorkType({
        formData: formData,
        callback: (newWorkStep) => {
          this.$toast(`Тип работы ${newWorkStep.name} добавлен`, 7000);
          this.$router.go(-1);
        },
      });
      this.isSaving = false;
    },

    async updateWorkType() {
      if (!this.workType.name.trim()) {
        alert("Пожалуйста, заполните все обязательные поля");
        return;
      }
      this.isSaving = true;
      let params = {
        ...this.workType,
        id: this.workType.id,
        steps: this.selectedWorkSteps,
      };
      params.imageSrc = null;
      let formData = this.objectToFormData(params);
      await this.updateWorkTypeAction({
        formData: formData,
        id: this.workType.id,
        callback: (newWorkStep) => {
          this.$toast(`Тип работы обновлён`, 5000);
          // this.$router.go(-1); - пока нельзя использовать потому что картинка не обновляется, так как кэшируется и еще название картинки это иД тип работы
          window.location.href = "/work-types";
        },
      });

      this.isSaving = false;
    },
    objectToFormData(obj, form = new FormData(), namespace = "") {
      for (let property in obj) {
        if (!obj.hasOwnProperty(property) || obj[property] === undefined) continue;

        const formKey = namespace ? `${namespace}[${property}]` : property;

        if (obj[property] instanceof File || obj[property] instanceof Blob) {
          form.append(formKey, obj[property]);
        } else if (typeof obj[property] === "object" && !Array.isArray(obj[property])) {
          this.objectToFormData(obj[property], form, formKey);
        } else {
          form.append(
            formKey,
            typeof obj[property] === "object"
              ? JSON.stringify(obj[property])
              : obj[property]
          );
        }
      }
      return form;
    },
  },
};
</script>

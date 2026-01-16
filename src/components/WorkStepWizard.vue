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
              step="0.01"
              placeholder="Цена по умолчанию (≥ 0)"
              required
            />
            <div class="invalid-feedback">Цена должна быть неотрицательным числом.</div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <!-- Чекбокс -->
              <input
                class="form-check-input"
                type="checkbox"
                id="isPrimerka"
                v-model="workStep.is_primerka"
              />
              <label class="form-check-label" for="isPrimerka">
                Отметьте, если это примерка
              </label>
            </div>
          </div>

          <!-- Тип цены -->
          <div class="mb-3">
            <div>
              <label class="form-label">Тип цены</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="pricePerStep"
                value="PerStep"
                v-model="workStep.price_mode"
              />
              <label class="form-check-label" for="pricePerStep"> За весь этап </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="pricePerTooth"
                value="PerTooth"
                v-model="workStep.price_mode"
              />
              <label class="form-check-label" for="pricePerTooth"> За один зуб </label>
            </div>
          </div>

          <!-- Основная роль -->
          <div class="mb-3" v-if="!workStep.is_primerka">
            <label class="form-label">Исполнители этапа</label>
            <MultiSelect
              v-model="workStep.roles"
              :options="roles.map((r) => ({ value: r.id, label: r.name }))"
              placeholder="Выберите роль"
            />
          </div>

          <!-- Связанные этапы работ, которые должны одновременно запускаться вместе с этим этапом -->
          <div class="mb-3">
            <label class="form-label" :title="relatedTaskTitleInfo"
              >Связанные этапы</label
            >
            <div class="form-text mb-2">
              <span :title="relatedTaskTitleInfo">
                Выберите связанные этапы, которые будут запускаться одновременно с этим
                этапом (автоматически).
              </span>
              <p class="text-danger" title="Этап будет запущен автоматически.">
                За этапы, которые запускаются автоматически, взимается плата.
              </p>
            </div>
            <SelectWorkStepWizard
              isSelecteOnlyMode
              ignoreDuplicateSteps
              @onUpdateSelectedSteps="
                (newSteps) => {
                  this.workStep.related_steps = newSteps;
                }
              "
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
import {
  LOAD_ROLES,
  LOAD_WORK_STEPS,
  ROLES,
  SAVE_WORK_STEP,
  SET_SELECTED_WORK_TYPE_STEPS,
  UPDATE_WORK_STEP,
  WORK_STEPS,
} from "../store/types";
import MultiSelect from "./MultiSelect.vue";
import SelectWorkStepWizard from "./SelectWorkStepWizard.vue";

export default {
  components: {
    MultiSelect,
    SelectWorkStepWizard,
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
        price_mode: null,
        related_steps: [],
        is_primerka: false,
      },
      relatedTaskTitleInfo:
        "Связанные этапы помогут автоматизировать рабочий процесс, позволяя запускать несколько этапов одновременно без необходимости запуска их каждый раз вручную.",
    };
  },
  async beforeMount() {
    await this.loadRoles();

    // Проверяем, что мы в режиме редактирования и что данные этапа работы существуют
    if (this.isEditMode && this.workStepData) {
      // Создаём копию данных этапа работы
      this.workStep = { ...this.workStepData };

      // Загружаем шаги работы асинхронно
      if (this.steps.length === 0) {
        await this.loadWorkSteps();
      }

      // Присваиваем выбранные этапы из данных этапа работы
      this.workStep.related_steps = this.workStep.related_steps || [];

      var selectedSteps = [];
      let i = 1;
      // Обрабатываем каждый этап, чтобы обновить его имя, если оно найдено в загруженных этапах
      this.workStep.related_steps.forEach((step) => {
        const foundStep = this.steps.find((s) => s.id === step);
        if (foundStep) {
          selectedSteps.push({
            id: foundStep.id,
            name: foundStep.name,
            price: foundStep.price,
            order_in_step: i,
          });
          i++;
        }
      });

      // Обновляем выбранные шаги в состоянии компонента
      this.setSelectedWorkTypeStep(selectedSteps);
    } else {
      this.setSelectedWorkTypeStep([]);
    }
  },
  computed: {
    ...mapGetters({
      roles: ROLES,
      steps: WORK_STEPS,
    }),
    isNameValid() {
      return this.workStep.name.trim() !== "";
    },
    isPriceValid() {
      return this.workStep.price !== null && this.workStep.price >= 0;
    },
    isValid() {
      return (
        this.isNameValid &&
        this.isPriceValid &&
        (this.workStep.is_primerka ? true : this.workStep.roles.length > 0) &&
        this.workStep.price_mode !== null
      );
    },
  },
  methods: {
    ...mapActions({
      saveWorkStep: SAVE_WORK_STEP,
      updateWorkStep: UPDATE_WORK_STEP,
      loadRoles: LOAD_ROLES,
      loadWorkSteps: LOAD_WORK_STEPS,
      setSelectedWorkTypeStep: SET_SELECTED_WORK_TYPE_STEPS,
    }),
    async save() {
      let params = {
        ...this.workStep,
        related_steps: this.workStep.is_primerka
          ? []
          : this.workStep.related_steps.map((step) => step.id),
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
        related_steps: this.workStep.is_primerka ? [] : this.workStep.related_steps,
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

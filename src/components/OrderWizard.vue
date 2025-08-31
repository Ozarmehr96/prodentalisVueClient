<template>
  <div class="container-fluid" style="padding-left: 0">
    <div class="row">
      <!-- Левая часть -->
      <div class="col-md-4">
        <h5 class="mb-3">Пациент и заказ</h5>
        <form>
          <div class="form-floating mb-4">
            <input
              type="text"
              v-model="login"
              class="form-control"
              id="floatingInput"
              placeholder="342"
            />
            <label for="floatingInput">Заказчик</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="text"
              v-model="login"
              class="form-control"
              id="floatingInput"
              placeholder="342"
            />
            <label for="floatingInput">Пациент</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="date"
              v-model="login"
              class="form-control"
              id="floatingInput"
              placeholder="342"
            />
            <label for="floatingInput">Ожидаемая дата</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="text"
              v-model="login"
              class="form-control"
              id="floatingInput"
              placeholder="342"
            />
            <label for="floatingInput">Комментарий</label>
          </div>

          <div class="text-center">
            <button
              @click="auth"
              class="btn btn-primary fa-lg gradient-custom-2 mb-3 w-100"
              type="button"
            >
              Вход
            </button>
          </div>
        </form>
      </div>

      <div class="col-md-4">
        <h5 class="mb-3">Типы работ</h5>

        <OrderWorkTypeCard
          v-for="type in [1, 2, 3]"
          :key="type"
          :name="'Коронка ' + type"
          colorName="1M1"
          :teeth="['16', '26']"
          @remove="() => console.log('Удалить тип работы', type)"
        />

        <!-- Кнопка добавить -->
        <button class="btn btn-primary fa-lg gradient-custom-2 mb-3 w-100" @click="openSidePanel">
          Добавить
        </button>
      </div>

      <!-- Правая часть -->
      <div class="col-md-4 d-flex align-items-center justify-content-center">
        <ToothSelection
          @update:selected="updateSelected"
          :selected="selectedTeeth"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import OrderWorkTypeCard from "./OrderWorkTypeCard.vue";
import ToothSelection from "./ToothSelection.vue";
import { LOAD_WORK_TYPES, WORK_TYPES } from "../store/types";

export default {
  name: "OrderWizard",
  components: { ToothSelection, OrderWorkTypeCard },
  data() {
    return {
      selectedTeeth: [],
      selectedWorkTypes: [],
    };
  },
  async beforeCreate() {
    this.loadWorkTypes();
  },
  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES
    }),
    filteredTeeth() {
      return this.selectedTeeth;
    },
    filteredWorkTypes() {
      return this.selectedWorkTypes;
    },
  },
  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES
    }),
    updateSelected(selected) {
      console.log("Выбранные зубы:", selected);
    },
  },
};
</script>

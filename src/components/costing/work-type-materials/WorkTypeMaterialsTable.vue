<template>
  <div class="mb-4">
    <div class="card shadow border-0">
      <!-- Шапка карточки -->
      <!-- Шапка карточки -->
      <div
        class="p-3 d-flex justify-content-between align-items-center text-white rounded-top"
        :style="{ background: headerGradient }"
      >
        <h2 class="fw-bold mb-0" style="font-size: 1.5rem">
          {{ workType.name }}
        </h2>
        <button
          class="btn btn-sm btn-light text-dark"
          @click="() => $router.push('/management/work-type-materials/' + workType.id)"
        >
          Редактировать
        </button>
      </div>

      <!-- Таблица -->
      <div class="table-responsive">
        <table class="table table-bordered mb-0">
          <thead class="table-light">
            <tr>
              <th class="small text-secondary" style="width: 40px">№</th>
              <th class="small text-secondary">Этап</th>
              <th class="small text-secondary">Норма расхода (ед.)</th>
              <th class="small text-secondary">Цена</th>
              <th class="small text-secondary">Количество</th>
              <th class="small text-secondary">Общая сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in workType.materials" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.material.name }}</td>
              <td>{{ item.norma }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.final_price }}</td>
            </tr>
            <!-- Итоговая себестоимость -->
            <tr class="table-primary fw-bold">
              <td colspan="5" class="text-end">Итоговая себестоимость</td>
              <td class="text-end">{{ workType.final_price }} TJS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleWorkTypeTable",
  props: {
    workType: {
      type: Object,
      required: true,
      // Пример структуры:
      // {
      //   name: "Циркон",
      //   total: 1556.50,
      //   items: [
      //     { name: "Аломинол", unit: 1, price: 120, quantity: 500, total: 0.24 },
      //     ...
      //   ]
      // }
    },
  },
  data() {
    return {
      searchName: "",
    };
  },
  computed: {
    headerGradient() {
      return this.workType.background_color;
    },
  },
};
</script>

<style scoped>
.table {
  min-width: 600px;
}
</style>

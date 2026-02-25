<template>
  <div v-if="item" class="salary-view">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Информация о начислении</h5>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Сотрудник:</strong>
            <p class="mb-0">{{ item.user_name }}</p>
          </div>
          <div class="col-md-6">
            <strong>Сумма:</strong>
            <p class="mb-0">{{ formatAmount(item.amount) }}</p>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Дата выплаты:</strong>
            <p class="mb-0">{{ $toDateTimeFormat(item.payment_date) }}</p>
          </div>
          <div class="col-md-6">
            <strong>Дата создания:</strong>
            <p class="mb-0">{{ $toDateTimeFormat(item.created_at) }}</p>
          </div>
        </div>

        <div class="row mb-3" v-if="item.comment">
          <div class="col-12">
            <strong>Комментарий:</strong>
            <p class="mb-0">{{ item.comment }}</p>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Создал:</strong>
            <p class="mb-0">{{ item.created_by_name || "—" }}</p>
          </div>
        </div>

        <div class="d-flex gap-2 mt-4" v-if="canControl">
          <button class="btn btn-warning" @click="$emit('edit', item)">
            Редактировать
          </button>
          <button class="btn btn-danger" @click="deleteItem">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { IS_LAB_DIRECTOR, IS_SYSTEM_ADMIN } from "../../../store/types";

export default {
  name: "SalaryJournalView",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },
  methods: {
    formatAmount(amount) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "TJS",
        minimumFractionDigits: 0,
      }).format(amount);
    },
    deleteItem() {
      this.$emit("delete", this.item.id);
    },
  },
};
</script>

<style scoped>
.salary-view {
  max-width: 800px;
}
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
}
.card-body {
  padding: 1.5rem;
}
</style>

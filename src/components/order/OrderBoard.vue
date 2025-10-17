<template>
  <div class="row">
    <!-- Созданные заказы -->
    <div class="col-md-6 mb-3">
      <h4>В ожидании</h4>
      <div class="task-column p-2 border rounded" style="overflow-y: auto; max-height: 500px;">
        <OrderList status="Started"/>
      </div>
    </div>

    <!-- В работе -->
    <div class="col-md-6 mb-3">
      <h4>В работе</h4>
      <div class="task-column p-2 border rounded" style="overflow-y: auto; max-height: 500px;">
        <OrderList status="Started"/>
      </div>
    </div>
  </div>
</template>

<script>
import OrderList from './OrderList.vue';

export default {
  components: { OrderList },
  data() {
    return {
      pageSizeCreated: 10,
      pageSizeStarted: 10
    }
  },
  methods: {
    loadMoreCreated() {
      this.pageSizeCreated += 10
    },
    loadMoreStarted() {
      this.pageSizeStarted += 10
    }
  }
}
</script>

<style scoped>
.task-column {
  min-height: 300px;
  background-color: #f8f9fa;
}
</style>

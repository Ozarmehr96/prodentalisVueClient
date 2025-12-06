<template>
  <div>
    <template v-if="orderTasks && orderTasks.length > 0">
      <OrderTaskWizard
        v-for="task in orderTasks"
        :key="task.id"
        :orderTask="task"
        @refreshTasks="refreshTasks"
      />
    </template>
    <div
      v-if="!isLoading && orderTasks && orderTasks.length === 0"
      class="col-12 text-center py-2 text-muted"
    >
      <p class="text-muted fs-8">Нет данных</p>
    </div>
    <div v-if="isLoading" class="spinner-wrapper">
      <div class="spinner-border text-primary spinner" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <div v-if="!hasMore && orderTasks.length > 0" class="text-center py-2 text-muted">
      Все заказы загружены
    </div>
    <!-- Компонент бесконечной подгрузки -->
    <InfiniteLoading ref="infiniteLoading" @infinite="loadMore" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import OrderTaskWizard from "./OrderTaskWizard.vue";
import {
  IS_LOADING_ORDER_TASKS,
  LOAD_ORDER_TASKS_PAGED,
  ORDER_TASKS,
  SET_ORDER_TASKS_LOADING,
} from "../../store/types";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import orderTasks from "../../store/modules/orderTasks";

export default {
  name: "OrderTasksList",
  components: {
    OrderTaskWizard,
    InfiniteLoading,
  },
  data() {
    return {
      orderTasksLocal: [
        {
          id: "1",
          stageName: "Изготовление коронки",
          work_type: "Металлокерамическая коронка",
          order_number: "2024-1147",
          patientName: "Иванов А.П.",
          deadline: "20 ноября 2025",
          status: "waiting",
        },
      ],
      page: 1, // текущая страница
      pageSize: 10, // кол-во записей за раз
      hasMore: true, // флаг, есть ли ещё данные
    };
  },
  beforeMount() {
    this.orderTasks.length = 0;
  },
  mounted() {
    // как только компонент смонтирован — инициируем первую загрузку
    this.$nextTick(() => {
      if (this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.stateChanger.reset(); // сброс состояния
      }
    });
  },
  computed: {
    ...mapGetters({
      isLoading: IS_LOADING_ORDER_TASKS,
      orderTasks: ORDER_TASKS,
    }),
  },
  methods: {
    ...mapActions({
      loadOrderTasks: LOAD_ORDER_TASKS_PAGED,
      setOrderTaskLoading: SET_ORDER_TASKS_LOADING,
    }),

    async refreshTasks() {
      this.page = 1;
      this.hasMore = true;
      this.orderTasks.length = 0;
      await this.loadMore();
    },
    async loadMore($state) {
      if (this.isLoading || !this.hasMore) {
        console.log("[LOAD] Защита или больше данных нет", this.page);
        return;
      }

      await this.setOrderTaskLoading(true);
      console.log("[LOAD] Загружается страница:", this.page);

      try {
        const result = await this.loadOrderTasks({
          page: this.page,
          page_size: this.pageSize,
          ...this.orderFilters,
        });

        if (result?.items?.length > 0) {
          this.orderTasks.push(...result.items);
          this.page++;
          this.hasMore = result.has_more;

          console.log(
            "[LOAD] Получено задач:",
            result.items.length,
            "Текущая страница:",
            this.page - 1
          );

          // Вместо $state.loaded() можно вообще не вызывать, контролируем через hasMore
          if (!this.hasMore) console.log("[LOAD] Больше данных нет");
        } else {
          this.hasMore = false;
          console.log("[LOAD] Пустой ответ от сервера на странице", this.page);
        }
      } catch (err) {
        console.error("[LOAD] Ошибка при загрузке задач:", err);
        this.hasMore = false;
      } finally {
        await this.setOrderTaskLoading(false);
      }
    },
  },
};
</script>
<style>
.v3-infinite-loading > div {
  display: none !important;
}
.v3-infinite-loading > span {
  display: none !important;
}
.infinite-loading-no-more {
  display: none !important;
}
</style>
<style scoped>
.table td {
  vertical-align: middle;
}

.spinner {
  left: 50%;
  position: relative;
}
/* global.css или scoped <style> */
.infinite-loading-no-more {
  display: none !important;
}
.spinner-wrapper {
  position: relative;
  /* привязка к родителю */
  top: 10px;
  /* отступ от низа родителя */
  left: 50%;
  /* по центру */
  transform: translateX(-50%);
  z-index: 99910;
  /* чтобы был поверх контента */
}
</style>

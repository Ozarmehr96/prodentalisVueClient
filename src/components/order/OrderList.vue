<template>
  <div class="row parent-container">
    <!-- Фильтры -->
    <OrderFilters @search="searchByFilter" />
    <template v-if="orders && orders.length > 0">
      <div
        class="col-12 mb-3 clickable"
        v-for="order in orders"
        :key="order.id"
        :id="`order-${order.id}`"
      >
        <OrderCardItem
          :order="order"
          @statusChanged="searchByFilter"
          @onPrintOrder="printOrderEvent"
        />
      </div>
    </template>

    <!-- Нет данных -->
    <div v-if="!isLoading && orders && orders.length === 0" class="col-12">
      <p class="text-muted fs-8">Нет данных, попробуйте изменить фильтр</p>
    </div>

    <!-- Спиннер -->
    <div v-if="isLoading" class="spinner-wrapper">
      <div class="spinner-border text-primary spinner" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <!-- Кнопка загрузки -->
    <div v-if="hasMore && !isLoading" class="col-12 text-center py-2">
      <button class="btn btn-outline-primary w-100" @click="() => loadMore()">
        Загрузить ещё
      </button>
    </div>

    <!-- Конец списка -->
    <div v-if="!hasMore && orders.length > 0" class="text-center py-2 text-muted">
      Все заказы загружены
    </div>

    <!-- Infinite Loading -->
    <div
      class="infinite-wrapper flex-grow-1 me-3"
      infinite-wrapper
      style="overflow-y: auto"
    >
      <InfiniteLoading
        ref="infiniteLoading"
        @infinite="loadMore"
        spinner="default"
        :distance="100"
        :forceUseInfiniteWrapper="true"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import OrderCardItem from "../../components/OrderCardItem.vue";
import OrderFilters from "../../components/order/OrderFilters.vue";
import InfiniteLoading from "v3-infinite-loading";
import { printOrder } from "../../helpers/printService";
import {
  IS_ORDER_LOADING,
  LOAD_ORDERS_PAGED,
  SET_ORDER_LOADING,
  ORDER_FILTERS,
  ORDERS,
} from "../../store/types";

/**
 * Страница "Запросы"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    OrderCardItem,
    OrderFilters,
    InfiniteLoading,
  },
  data() {
    return {
      page: 1, // текущая страница
      pageSize: 10, // кол-во записей за раз
      hasMore: true, // флаг, есть ли ещё данные
    };
  },
  beforeMount() {
    this.orders.length = 0;
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
      orders: ORDERS,
      isLoading: IS_ORDER_LOADING,
      orderFilters: ORDER_FILTERS,
    }),
  },
  methods: {
    ...mapActions({
      loadOrdersPagedAction: LOAD_ORDERS_PAGED,
      setOrderLoading: SET_ORDER_LOADING,
    }),

    async searchByFilter() {
      console.log("[FILTER] Фильтр изменен");
      await new Promise((resolve) => setTimeout(resolve, 300)); // небольшая задержка для корректного фильтра
      // Сбрасываем все данные
      this.orders.length = 0;
      this.page = 1;
      this.hasMore = true;

      // Загружаем первую страницу напрямую
      this.loadMore({
        loaded: () => {
          console.log("[LOAD] Данные загружены");
        },
        complete: () => {
          console.log("[LOAD] Больше данных нет");
        },
      });
    },

    async loadMore($state) {
      if (this.isLoading || !this.hasMore) {
        console.log("[LOAD] Защита или больше данных нет", this.page);
        $state && $state.complete();
        return;
      }

      this.setOrderLoading(true);
      console.log("[LOAD] Загружается страница:", this.page);

      try {
        const result = await this.loadOrdersPagedAction({
          page: this.page,
          page_size: this.pageSize,
          ...this.orderFilters,
        });

        if (result?.items?.length > 0) {
          this.orders.push(...result.items);
          this.page++;
          this.hasMore = result.has_more;
          console.log(
            "[LOAD] Получено заказов:",
            result.items.length,
            "Страница:",
            this.page - 1
          );
          if ($state) $state.loaded();
          if (!this.hasMore && $state) $state.complete();
        } else {
          this.hasMore = false;
          console.log("[LOAD] Пустой ответ на странице", this.page);
          if ($state) $state.complete();
        }
      } catch (err) {
        console.error("[LOAD] Ошибка при загрузке заказов:", err);
        this.hasMore = false;
        if ($state) $state.complete();
      } finally {
        this.setOrderLoading(false);
      }
    },

    printOrderEvent(order) {
      printOrder(
        order,
        this.$toDateTimeFormat(order.created_at),
        this.$toDateFormat(order.expired_at)
      );
    },
  },
};
</script>

<style scoped>
.card:hover {
  border: 1px solid #007bff !important;
  /* синий цвет выделения */
  border-radius: 1rem;
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

.parent-container {
  position: relative;
  /* чтобы спиннер позиционировался относительно родителя */
  min-height: 70px;
  /* или высота контента */
}

.infinite-wrapper {
  width: 100%;
  flex: 1 0 0;
  overflow-y: auto;
}
</style>

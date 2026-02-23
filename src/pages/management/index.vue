<template>
  <div class="navigation-cards min-vh-100 py-3" v-if="canView">
    <div class="container">
      <FinanceExportModal v-model:show="showFinanceExportModal" />

      <!-- Заголовок страницы -->
      <div class="text-center mb-4">
        <h1 class="h2 mb-2 text-dark">Управление лабораторией</h1>
        <p class="text-muted">Выберите раздел для работы</p>
      </div>

      <!-- Перебираем группы карточек -->
      <div v-for="group in cardGroups" :key="group.groupTitle" class="mb-5">
        <!-- Заголовок группы -->
        <h4 class="mb-3 text-secondary">{{ group.groupTitle }}</h4>
        <div class="row g-4">
          <div
            v-for="card in group.cards.filter((c) => c.canShow)"
            :key="card.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <div
              class="navigation-card card h-100 border-0 shadow-sm"
              :class="{ 'card-active': hoveredCard === card.id }"
              @mouseenter="hoveredCard = card.id"
              @mouseleave="hoveredCard = null"
              @click="handleCardClick(card.action)"
            >
              <div class="card-body text-center p-4">
                <!-- Иконка через SVG путь -->
                <div
                  class="icon-wrapper d-inline-flex align-items-center justify-content-center mb-4"
                  :class="card.iconClass"
                >
                  <img
                    v-if="card.svgPath"
                    :src="card.svgPath"
                    alt="icon"
                    class="svg-icon"
                  />
                </div>

                <!-- Заголовок -->
                <h5 class="card-title mb-3 text-dark">{{ card.title }}</h5>

                <!-- Описание -->
                <p class="card-text text-muted small">{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  IS_CUSTOMER,
  IS_LAB_ADMIN,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
} from "../../store/types";
import FinanceExportModal from "../../components/costing/FinanceExportModal.vue";

export default {
  name: "NavigationCards",
  components: {
    FinanceExportModal,
  },
  data() {
    return {
      hoveredCard: null,
      showFinanceExportModal: false,
      // Группы карточек
    };
  },
  computed: {
    ...mapGetters({
      isLabAdmin: IS_LAB_ADMIN,
      isDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
    }),
    cardGroups() {
      return [
        {
          groupTitle: "Финансы",
          cards: [
            {
              id: "export-finance",
              iconClass: "brand-style",
              title: "Финансовый отчёт",
              description: "Доходы, расходы и чистая прибыль по заказчикам и типам работ",
              action: () => (this.showFinanceExportModal = true), // Открытие модального окна
              svgPath: "/images/finance-export.svg",
              canShow: this.canView,
            },
            {
              id: "payment-journal",
              iconClass: "brand-style",
              title: "Журнал платежей заказчиков",
              description: "Прайс-листы и расценки для различных клиник и заказчиков",
              action: "/management/payment-journal",
              // svgPath: "/images/users.svg",
              svgPath: "/images/payment-journal.svg",
              canShow: this.canView,
            },
            {
              id: "client-pricing",
              iconClass: "brand-style",
              title: "Стоимость работ по заказчикам",
              description: "Прайс-листы и расценки для различных клиник и заказчиков",
              action: "/management/customer-work-type-prices",
              // svgPath: "/images/users.svg",
              svgPath: "/images/price-price-tag-cost-svgrepo-com.svg",
              canShow: this.canView,
            },
            {
              id: "material-expenses",
              iconClass: "brand-style",
              title: "Расходные материалы",
              description: "Учёт и контроль расходных материалов в производстве",
              action: "/management/materials",
              svgPath: "/images/material.svg",
              canShow: this.canView,
            },
            {
              id: "cost-calculation",
              iconClass: "brand-style",
              title: "Себестоимость работ",
              description: "Расчёт затрат на материалы и накладные расходы",
              action: "/management/work-type-materials",
              svgPath: "/images/calculator.svg",
              canShow: this.canView,
            },
          ],
        },
        {
          groupTitle: "Сотрудники и заказчики",
          cards: [
            {
              id: "users",
              iconClass: "brand-style",
              title: "Сотрудники",
              description: "Управление информацией о сотрудниках",
              action: "/users",
              svgPath: "/images/users.svg",
              canShow: this.canView,
            },
            {
              id: "roles",
              iconClass: "brand-style",
              title: "Роли",
              description: "Управление информацией о ролях",
              action: "/roles",
              svgPath: "/images/roles.svg",
              canShow: this.canView,
            },
            {
              id: "customers",
              iconClass: "brand-style",
              title: "Заказчики",
              description: "Управление информацией о заказчиках",
              action: "/customers",
              svgPath: "/images/client-svgrepo-com.svg",
              canShow: this.canView,
            },
          ],
        },
      ];
    },
    canView() {
      // Логика для определения, может ли пользователь видеть страницу управления
      // Например, проверка ролей пользователя
      return this.isLabAdmin || this.isDirector || this.isSystemAdmin;
    },
  },
  methods: {
    handleCardClick(action) {
      if (typeof action === "function") {
        action();
        return;
      }

      // Отправляем событие родителю
      this.$emit("navigate", action);
      this.$router.push(action);
      console.log("Navigating to:", action);
    },
  },
};
</script>

<style scoped>
/* Основные стили */
.navigation-cards {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

.navigation-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 1rem;
}

.navigation-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

.navigation-card:active {
  transform: translateY(-4px) scale(0.98);
}

/* Иконка */
.icon-wrapper {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.navigation-card:hover .icon-wrapper {
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
  transform: scale(1.1);
}

.svg-icon {
  width: 2rem;
  height: 2rem;
}

/* Типографика */
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.card-text {
  line-height: 1.6;
}
</style>

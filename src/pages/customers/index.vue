<template>
  <app-page
    title="Заказчики"
    :isShowAddButton="canControl"
    @onAddButtonClickEvent="openCutomerModal"
    :showBackButton="true"
  >
    <!-- Здесь будет таблица ролей -->
    <div class="table-responsive">
      <!-- Таблица Bootstrap -->
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Логин</th>
            <th>Дата добавления</th>
            <th>Комментарии</th>
            <th v-if="canControl">Действия</th>
          </tr>
        </thead>
        <tbody>
          <!-- Перебор списка ролей -->
          <tr v-for="(customer, index) in customers" :key="customer.id">
            <td>{{ customer.full_name }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.login }}</td>
            <td>{{ $toDateTimeFormat(customer.created_at) }}</td>
            <td>{{ customer.comment }}</td>
            <td v-if="canControl">
              <!-- Кнопки действий -->
              <div class="d-flex justify-content-center gap-2">
                <!-- Кнопка редактирования -->
                <button
                  class="btn btn-sm btn-warning me-2"
                  @click="() => openCutomerModal(customer)"
                >
                  Редактировать
                </button>

                <!-- Кнопка удаления -->
                <button
                  class="btn btn-sm btn-danger me-2"
                  @click="deleteCustomer(customer.id)"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
          <!-- Если список пуст -->
          <tr v-if="!customers || customers.length === 0">
            <td colspan="6" class="text-muted py-3">Нет данных</td>
          </tr>
        </tbody>
      </table>
    </div>
    <CustomerModal
      v-model:show="showCustomerModal"
      :customer="selectedCustomer"
      :isEdit="selectedCustomer ? true : false"
    />
  </app-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppPage from "../../components/AppPage.vue";
import {
  CUSTOMERS,
  DELETE_CUSTOMER,
  IS_LAB_DIRECTOR,
  IS_SYSTEM_ADMIN,
  LOAD_CUSTOMERS,
  ROLES,
} from "../../store/types";
import CustomerModal from "../../components/customers/CustomerModal.vue";

/**
 * Страница "Заказчики"
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  components: {
    AppPage,
    CustomerModal,
  },
  data() {
    return {
      showCustomerModal: false,
      selectedCustomer: null,
    };
  },
  computed: {
    ...mapGetters({
      isLabDirector: IS_LAB_DIRECTOR,
      isSystemAdmin: IS_SYSTEM_ADMIN,
      customers: CUSTOMERS,
    }),
    canControl() {
      return this.isLabDirector || this.isSystemAdmin;
    },
  },
  async beforeMount() {
    await this.loadCutomers();
  },
  methods: {
    ...mapActions({
      loadCutomers: LOAD_CUSTOMERS,
      deleteCustomerAction: DELETE_CUSTOMER,
    }),
    deleteCustomer(roleId) {
      console.log("Удаление заказчика с ID:", roleId);
      if (!confirm("Вы уверены, что хотите удалить этого заказчика?")) {
        return;
      }

      this.deleteCustomerAction({
        id: roleId,
        callback: () => this.$toast("Заказчик успешно удален"),
      });
    },
    openCutomerModal(customer) {
      this.showCustomerModal = true;
      this.selectedCustomer = customer;
    },
  },
};
</script>

<template>
    <div>
        <div class="row">
            <!-- Левая колонка: данные заказа и стоимость -->
            <div class="col-md-4 mb-4">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Заказ №{{ order.id }}</h5>
                        <span class="badge bg-primary">{{ order.status.name }}</span>
                    </div>
                </div>

                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Пациент:</span>
                            <span class="fw-semibold">{{ order.patient_name }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Заказчик:</span>
                            <span class="fw-semibold">{{ order.customer_name }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Создал:</span>
                            <span class="fw-semibold">{{ order.created_user_name }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Дата создания:</span>
                            <span class="fw-semibold">{{ formatDate(order.created_at) }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted">Срок сдачи:</span>
                            <span class="fw-semibold">{{ formatDate(order.expired_at) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Комментарии:</span>
                            <span class="fw-semibold">{{ order.description }}</span>
                        </div>
                    </div>
                </div>

                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Стоимость</h5>
                        <p class="fs-3">{{ order.price }} TJS</p>
                    </div>
                </div>
            </div>

            <!-- Правая колонка: зубы по типам работ -->
            <div class="col-md-8" style="max-width: 700px;">
                <WorkTypeCardItem v-for="workType in filtredOrderSelectedTeethasWorktype" :workType="workType"
                    :key="workType.id" style="margin-bottom: 10px" />
            </div>
        </div>
    </div>
</template>

<script>
import { convertOrderTeethToWorkTypes } from "../helpers/order-helpers";
import WorkTypeCardItem from "./WorkTypeCardItem.vue";

export default {
    name: "OrderView",
    components: {
        WorkTypeCardItem,
    },
    props: {
        order: {
            type: Object,
            required: true,
        },
    },
    computed: {
        // Группировка зубов по типам работ
        filtredOrderSelectedTeethasWorktype() {
            return convertOrderTeethToWorkTypes(this.order.teeth);
        },
    },
    methods: {
        formatDate(dateStr) {
            if (!dateStr) return "-";
            const date = new Date(dateStr);
            return date.toLocaleDateString();
        },
    },
};
</script>

<style scoped>
.card-header {
    font-weight: bold;
}
</style>

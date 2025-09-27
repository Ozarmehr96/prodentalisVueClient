<template>
    <app-page title="Информация о заказе" :showBackButton="true">
        <OrderView :order="order"  v-if="order"/>
    </app-page>
</template>
<script>
import { mapActions } from 'vuex';
import AppPage from '../../../components/AppPage.vue';
import OrderView from '../../../components/OrderView.vue';
import { LOAD_ORDER } from '../../../store/types';
/**
* Страница "Редактирование заказа"
*
* @vue-computed {object} currentUser - Текущий пользователь
*/
export default {
    name: "OrderEditPage",
    components: {
        AppPage,
        OrderView,
    },
    data() {
        return {
            order: null,
        };
    },
    async beforeMount() {
        await this.loadOrder(this.$route.params.id).then((order) => {
            this.order = order;
        });
    },
    methods: {
        ...mapActions({
            loadOrder: LOAD_ORDER,
        }),
    },
};
</script>
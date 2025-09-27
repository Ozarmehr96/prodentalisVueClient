<template>
  <div>
    Выберите нужный раздел
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as types from "../store/types";

/**
 * Страница "Профиль"
 *
 * @module Page - Profile
 *
 * @vue-computed {object} currentUser - Текущий пользователь
 */
export default {
  computed: {
    ...mapGetters({
      currentUser: types.CURRENT_USER,
    }),
  },
};
</script>

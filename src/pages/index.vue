<template>
  <div>
    нужно добавить прелоадер пока идет запрос
    <hr />
    страницу запросы нужно доработать
    <hr />
    добавить прелоалер загрузки страницы
    <hr />
    нужно переписать форму редактирования использованием user.name и тд
    <hr />
    Нужно добавить router-link вместо href, то есть делать push переходы в sidebar
    <hr />
    при входк тоже прелоадер пока идет авторизация
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

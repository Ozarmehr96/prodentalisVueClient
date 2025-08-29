import { createRouter, createWebHistory } from 'vue-router'
import {
  getValueFromSessionStorage
} from '../helpers/session-storage';

const modules = import.meta.glob('../pages/**/*.vue')

// Функция преобразования пути файла в путь роутинга с динамическими сегментами
function pathToRoute(path) {
  // Пример: ../pages/users/_id/index.vue
  let route = path
    .replace('../pages', '')          // /users/_id/index.vue
    .replace('/index.vue', '/')       // /users/_id/
    .replace('.vue', '')              // /users/_id/
  
  // Заменяем сегменты, начинающиеся с "_" на динамические параметры ":"
  route = route
    .split('/')
    .map(segment => segment.startsWith('_') ? ':' + segment.slice(1) : segment)
    .join('/')
  
  // Корень сайта
  if (route === '') route = '/'
  return route
}

function pathToRouteNew(path) {
  // Пример: ../pages/users/_id/index.vue
  let route = path
    .replace('../pages', '')           // /users/_id/index.vue
    .replace(/\/index\.vue$/, '')      // /users/_id
    .replace(/\.vue$/, '')             // /users/_id

  // Разбиваем на сегменты
  const segments = route.split('/').filter(Boolean)

  // Преобразуем динамические сегменты
  const newSegments = segments.map(seg => {
    if (seg.startsWith('_')) {
      return ':' + seg.slice(1)  // _id → :id
    }
    return seg
  })

  // Собираем путь обратно
  route = '/' + newSegments.join('/')

  // Корень сайта
  if (route === '/') route = '/'

  return route
}

const routes = Object.keys(modules).map(path => ({
  path: pathToRouteNew(path),
  component: modules[path]
}))

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Навигационный guard для проверки токена
router.beforeEach((to, from, next) => {
  const isAuth = getValueFromSessionStorage('accessToken');

  // Пути, доступные без авторизации
  const publicPages = ['/login'];

  // Проверяем, требует ли страница авторизации
  const authRequired = !publicPages.includes(to.path)

  // если сотрудник авторизован, и пытается перейти на страницу login, то возвращаем его туда откуда пришел!
  if (publicPages.includes(to.path) && isAuth) {
    next(path.from)
  }
  if (authRequired && !isAuth) {
    next('/login')  // если не авторизован — редирект на login
  } else {
    next()          // иначе разрешаем переход
  }
})

export default router

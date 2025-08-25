import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    name: "home",
    path: "/",
    component: () => import("../views/Welcome.vue"),
    meta: { title: "Welcome to Farkle dice" },
  },
  {
    name: "game",
    path: "/game",
    component: () => import("../views/GamePage.vue"),
    meta: { title: "Playing Farkle dice" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || "Enjoy Frakle dice";
  next();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

export default router;

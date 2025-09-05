import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    name: "index",
    path: "/",
    component: () => import("../layouts/AppLayout.vue"),
    meta: { title: "Rolling dice game" },
    redirect: "home",
    children: [
      {
        name: "home",
        path: "/home",
        component: () => import("../views/Welcome.vue"),
        meta: { title: "Welcome to Farkle dice" },
      },
      {
        name: "register",
        path: "register",
        component: () => import("../views/Signup.vue"),
        meta: { title: "Create your FARKLE account" },
      },
      {
        name: "playerVs",
        path: "play-vs",
        component: () => import("../views/PlayerVS.vue"),
        meta: { title: "Farkle Initializing" },
      },
    ],
  },
  {
    name: "lobby-init",
    path: "/lobby",
    component: () => import("../layouts/LobbyLayout.vue"),
    redirect: 'lobby',
    children: [
      {
        name: "lobby",
        path: "/game-lobby",
        component: () => import("../views/GameLobby.vue"),
        meta: { title: "Farkle Lobby" },
      },
    ],
  },
  {
    name: "game",
    path: "/game",
    component: () => import("../views/GamePage.vue"),
    meta: { title: "Playing Farkle dice" },
  },
    {
    name: "test",
    path: "/test",
    component: () => import("../views/Farkle.vue"),
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

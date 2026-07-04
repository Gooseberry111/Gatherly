import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
import ReelsView from "../views/ReelsView.vue";
import PeopleView from "../views/PeopleView.vue";
import FriendRequestsView from "../views/FriendRequestsView.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/signup", component: SignupView },
  { path: "/home", component: HomeView },
  { path: "/reels", component: ReelsView },
  { path: "/profile", component: ProfileView },
  { path: "/people", component: PeopleView },
  { path: "/friend-requests", component: FriendRequestsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

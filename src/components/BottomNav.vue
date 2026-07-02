<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const activeNav = computed(() => {
  if (route.path === "/reels") return "reels";
  if (route.path === "/profile") return "profile";
  return "home";
});

const navItems = [
  { key: "home", icon: "fa-home", route: "/home" },
  { key: "reels", icon: "fa-film", route: "/reels" },
  { key: "friends", icon: "fa-user-friends", route: "/home" },
  { key: "profile", icon: "fa-user", route: "/profile" },
];
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center justify-around h-14 lg:hidden"
  >
    <button
      v-for="item in navItems"
      :key="item.key"
      @click="router.push(item.route)"
      :class="[
        'flex flex-col items-center justify-center flex-1 h-full gap-1',
        activeNav === item.key ? 'text-blue-600' : 'text-gray-500',
      ]"
    >
      <i :class="`fa ${item.icon} text-xl`"></i>
    </button>
  </div>
</template>

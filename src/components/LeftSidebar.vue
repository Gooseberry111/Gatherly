<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const menuItems = [
  { icon: "fa-user", label: "Profile", route: "/profile" },
  { icon: "fa-user-friends", label: "Friends", route: "/people" },
  { icon: "fa-users", label: "Groups" },
  { icon: "fa-store", label: "Marketplace" },
  { icon: "fa-tv", label: "Watch" },
  { icon: "fa-clock", label: "Memories" },
  { icon: "fa-film", label: "Reels", route: "/reels" },
  { icon: "fa-bookmark", label: "Saved" },
  { icon: "fa-calendar", label: "Events" },
  { icon: "fa-gamepad", label: "Gaming" },
  { icon: "fa-newspaper", label: "Feeds" },
];

const handleClick = (item) => {
  if (item.route) {
    router.push(item.route);
  }
};
</script>

<template>
  <div class="py-4 pr-2 space-y-1">
    <button
      v-for="item in menuItems"
      :key="item.label"
      @click="handleClick(item)"
      class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-200 transition text-left"
    >
      <span
        class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
      >
        <i :class="`fa ${item.icon} text-gray-700`"></i>
      </span>
      <span class="text-sm font-medium text-gray-800">{{ item.label }}</span>
    </button>

    <hr class="my-2 border-gray-200" />

    <button
      class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-200 transition text-left"
    >
      <span
        class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
      >
        <i class="fa fa-chevron-down text-gray-700"></i>
      </span>
      <span class="text-sm font-medium text-gray-800">See more</span>
    </button>

    <div class="pt-4 px-3 flex flex-wrap gap-x-2 gap-y-1">
      <span class="text-xs text-gray-400 hover:underline cursor-pointer"
        >Privacy</span
      >
      <span class="text-xs text-gray-400 hover:underline cursor-pointer"
        >Terms</span
      >
      <span class="text-xs text-gray-400 hover:underline cursor-pointer"
        >Advertising</span
      >
      <span class="text-xs text-gray-400 hover:underline cursor-pointer"
        >Cookies</span
      >
      <span class="text-xs text-gray-400 hover:underline cursor-pointer"
        >More</span
      >
      <span class="text-xs text-gray-400 mt-1 w-full">Gatherly © 2026</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import logo from "../assets/Gatherly.png";

const router = useRouter();
const route = useRoute();

const searchQuery = ref("");
const showResults = ref(false);

const navItems = [
  { key: "home", icon: "fa-home", route: "/home" },
  { key: "reels", icon: "fa-film", route: "/reels" },
  { key: "marketplace", icon: "fa-store", route: "/home" },
  { key: "friends", icon: "fa-user-friends", route: "/home" },
  { key: "gaming", icon: "fa-gamepad", route: "/home" },
];

const activeNav = computed(() => {
  if (route.path === "/reels") return "reels";
  return "home";
});

const searchData = [
  {
    name: "Emmanuella Ukata",
    type: "Profile",
    icon: "fa-user",
    route: "/profile",
  },
  { name: "Reels", type: "Page", icon: "fa-film", route: "/reels" },
  { name: "Home", type: "Page", icon: "fa-home", route: "/home" },
  { name: "Maryann", type: "Friend", icon: "fa-user", route: "/profile" },
  { name: "Dorcas", type: "Friend", icon: "fa-user", route: "/profile" },
  { name: "Faith", type: "Friend", icon: "fa-user", route: "/profile" },
  { name: "Mercy", type: "Friend", icon: "fa-user", route: "/profile" },
  { name: "Joel", type: "Friend", icon: "fa-user", route: "/profile" },
  { name: "Tony", type: "Friend", icon: "fa-user", route: "/profile" },
];

const filteredResults = computed(() => {
  if (searchQuery.value.trim() === "") return [];
  return searchData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const onFocus = () => {
  showResults.value = true;
};
const onBlur = () => {
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const goTo = (route) => {
  router.push(route);
  searchQuery.value = "";
  showResults.value = false;
};
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-14 flex items-center px-4"
  >
    <div
      class="max-w-7xl mx-auto w-full flex items-center justify-between gap-3"
    >
      <!-- Left: Logo + Search -->
      <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <!-- Mobile: show text instead of logo -->
        <span class="text-2xl font-bold text-blue-600 sm:hidden">Gatherly</span>

        <!-- Desktop: show logo -->
        <img
          :src="logo"
          alt="Gatherly"
          class="hidden sm:block w-10 h-10 md:w-16 md:h-16 cursor-pointer flex-shrink-0"
          @click="router.push('/home')"
        />

        <!-- Desktop search -->
        <div class="relative hidden sm:block">
          <div
            class="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2"
          >
            <i class="fa fa-search text-gray-400 text-sm"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search Gatherly"
              class="bg-transparent text-sm focus:outline-none w-20 md:w-40"
              @focus="onFocus"
              @blur="onBlur"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fa fa-times text-xs"></i>
            </button>
          </div>

          <!-- Search Results Dropdown -->
          <div
            v-if="showResults && filteredResults.length > 0"
            class="absolute top-12 left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div
              v-for="result in filteredResults"
              :key="result.name"
              @click="goTo(result.route)"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              <div
                class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <i :class="`fa ${result.icon} text-gray-600`"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">
                  {{ result.name }}
                </p>
                <p class="text-xs text-gray-400">{{ result.type }}</p>
              </div>
            </div>
          </div>

          <!-- No results -->
          <div
            v-if="showResults && searchQuery && filteredResults.length === 0"
            class="absolute top-12 left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 z-50"
          >
            <p class="text-sm text-gray-400">
              No results for "{{ searchQuery }}"
            </p>
          </div>
        </div>
      </div>

      <!-- Center: Nav Icons (desktop only) -->
      <div
        class="hidden sm:flex items-center flex-1 justify-center min-w-0 gap-2 sm:gap-4 md:gap-6"
      >
        <button
          v-for="item in navItems"
          :key="item.key"
          @click="router.push(item.route)"
          :class="[
            'px-2 sm:px-4 md:px-6 h-14 flex items-center justify-center border-b-4 transition-all flex-shrink-0',
            activeNav === item.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:bg-gray-100',
          ]"
        >
          <i :class="`fa ${item.icon} text-lg sm:text-xl`"></i>
        </button>
      </div>

      <!-- Right: Desktop actions -->
      <div class="hidden sm:flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          @click="router.push('/profile')"
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <i class="fa fa-user text-gray-600 text-sm sm:text-base"></i>
        </button>
        <button
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <i class="fa fa-comment text-gray-600 text-sm sm:text-base"></i>
        </button>
        <button
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <i class="fa fa-bell text-gray-600 text-sm sm:text-base"></i>
        </button>
        <button
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <i class="fa fa-th text-gray-600 text-sm sm:text-base"></i>
        </button>
      </div>

      <!-- Right: Mobile actions (plus, search, message) -->
      <div class="flex sm:hidden items-center gap-2 flex-shrink-0">
        <button
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center"
        >
          <i class="fa fa-plus text-gray-600"></i>
        </button>
        <button
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center"
        >
          <i class="fa fa-search text-gray-600"></i>
        </button>
        <button
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center"
        >
          <i class="fa fa-comment text-gray-600"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import logo from "../assets/Gatherly.png";
import { useFriends } from "../composables/useFriends";
import { logout, userProfile } from "../store/auth";

const showAccountMenu = ref(false);
const router = useRouter();
const route = useRoute();

const { getPendingRequests, pendingRequests } = useFriends();

onMounted(async () => {
  await getPendingRequests();
  document.addEventListener("click", closeMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});

const closeMenu = (e) => {
  if (!e.target.closest(".account-menu-wrapper")) {
    showAccountMenu.value = false;
  }
};

const searchQuery = ref("");
const showResults = ref(false);

const navItems = [
  { key: "home", icon: "fa-home", route: "/home" },
  { key: "reels", icon: "fa-film", route: "/reels" },
  { key: "marketplace", icon: "fa-store", route: "/home" },
  { key: "friends", icon: "fa-user-friends", route: "/people" },
  { key: "gaming", icon: "fa-gamepad", route: "/home" },
];

const activeNav = computed(() => {
  if (route.path === "/reels") return "reels";
  if (route.path === "/people") return "friends";
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

const goTo = (path) => {
  router.push(path);
  searchQuery.value = "";
  showResults.value = false;
};

const handleLogout = async () => {
  await logout();
  showAccountMenu.value = false;
  router.push("/");
};
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white h-14 flex items-center px-4"
  >
    <div
      class="max-w-7xl mx-auto w-full flex items-center justify-between gap-3"
    >
      <!-- Left: Logo + Search -->
      <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span class="text-2xl font-bold text-blue-600 sm:hidden">Gatherly</span>
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
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <i class="fa fa-comment text-gray-600 text-sm sm:text-base"></i>
        </button>

        <button
          @click="router.push('/friend-requests')"
          class="relative bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <i class="fa fa-bell text-gray-600 text-sm sm:text-base"></i>
          <span
            v-if="pendingRequests.length > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
          >
            {{ pendingRequests.length }}
          </span>
        </button>

        <button
          class="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
        >
          <i class="fa fa-th text-gray-600 text-sm sm:text-base"></i>
        </button>

        <!-- Account Menu -->
        <div class="relative account-menu-wrapper">
          <button
            @click="showAccountMenu = !showAccountMenu"
            class="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="userProfile?.avatar_url"
              :src="userProfile.avatar_url"
              class="w-full h-full object-cover rounded-full"
            />
            <i v-else class="fa fa-user text-gray-600 text-sm sm:text-base"></i>
          </button>

          <!-- Dropdown -->
          <div
            v-if="showAccountMenu"
            class="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            <!-- Profile info -->
            <div
              @click="
                router.push('/profile');
                showAccountMenu = false;
              "
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            >
              <div
                class="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0"
              >
                <img
                  v-if="userProfile?.avatar_url"
                  :src="userProfile.avatar_url"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <i class="fa fa-user text-gray-400"></i>
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800">
                  {{ userProfile?.full_name || "Your Name" }}
                </p>
                <p class="text-xs text-blue-500">See your profile</p>
              </div>
            </div>

            <!-- Settings -->
            <button
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
            >
              <div
                class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <i class="fa fa-cog text-gray-600"></i>
              </div>
              <span class="text-sm font-medium text-gray-800"
                >Settings & privacy</span
              >
            </button>

            <button
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
            >
              <div
                class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <i class="fa fa-question-circle text-gray-600"></i>
              </div>
              <span class="text-sm font-medium text-gray-800"
                >Help & support</span
              >
            </button>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-t border-gray-100"
            >
              <div
                class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <i class="fa fa-sign-out text-gray-600"></i>
              </div>
              <span class="text-sm font-medium text-gray-800">Log out</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Mobile actions -->
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

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import NavBar from "../components/NavBar.vue";
import BottomNav from "../components/BottomNav.vue";
import { useFriends } from "../composables/useFriends";
import { currentUser } from "../store/auth";

const router = useRouter();
const {
  searchUsers,
  sendFriendRequest,
  getSentRequests,
  sentRequests,
  getFriends,
  friends,
} = useFriends();

const query = ref("");
const results = ref([]);
const suggestions = ref([]);
const loading = ref(false);
const loadingSuggestions = ref(true);
const requestedIds = ref([]);

const friendIds = computed(() => new Set(friends.value.map((f) => f.id)));

const isSearching = () => query.value.trim().length > 0;

onMounted(async () => {
  await Promise.all([getSentRequests(), getFriends()]);
  requestedIds.value = sentRequests.value.map((r) => r.receiver_id);

  loadingSuggestions.value = true;
  const all = await searchUsers("");
  suggestions.value = (all || []).filter(
    (u) => u.id !== currentUser.value?.id && !friendIds.value.has(u.id),
  );
  loadingSuggestions.value = false;
});

let debounceTimer = null;

watch(query, (newQuery) => {
  clearTimeout(debounceTimer);

  if (!newQuery.trim()) {
    results.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  debounceTimer = setTimeout(async () => {
    const data = await searchUsers(newQuery);
    results.value = (data || []).filter((u) => u.id !== currentUser.value?.id);
    loading.value = false;
  }, 300);
});

const addFriend = async (userId) => {
  const { error } = await sendFriendRequest(userId);
  if (!error) requestedIds.value.push(userId);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />

    <div class="pt-14 pb-16 max-w-3xl mx-auto px-4">
      <!-- Header -->
      <div class="mt-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Find People</h1>
        <p class="text-sm text-gray-500 mt-1">
          Connect with people you may know on Gatherly
        </p>
      </div>

      <!-- Search Input -->
      <div
        class="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 mb-8 focus-within:ring-2 focus-within:ring-blue-500 transition"
      >
        <i class="fa fa-search text-gray-400"></i>
        <input
          v-model="query"
          type="text"
          placeholder="Search for people by name..."
          class="flex-1 text-sm focus:outline-none placeholder:text-gray-400"
        />
        <i v-if="loading" class="fa fa-spinner fa-spin text-gray-400"></i>
        <button
          v-if="query"
          @click="query = ''"
          class="text-gray-400 hover:text-gray-600"
        >
          <i class="fa fa-times-circle"></i>
        </button>
      </div>

      <!-- SEARCH RESULTS -->
      <div v-if="isSearching()">
        <h2
          class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3"
        >
          Results for "{{ query }}"
        </h2>

        <div
          v-if="!loading && results.length === 0"
          class="text-center text-gray-400 py-14"
        >
          <i class="fa fa-user-slash text-3xl mb-3 block"></i>
          No users found for "{{ query }}"
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div
            v-for="user in results"
            :key="user.id"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-white shadow"
              >
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <i class="fa fa-user text-gray-400 text-xl"></i>
                </div>
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 text-sm truncate">
                  {{ user.full_name }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                  {{ user.bio || "Gatherly member" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <span
                v-if="friendIds.has(user.id)"
                class="text-green-600 text-xs font-semibold flex items-center gap-1.5 px-3 py-2"
              >
                <i class="fa fa-user-check"></i> Friends
              </span>
              <button
                v-else-if="!requestedIds.includes(user.id)"
                @click="addFriend(user.id)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5"
              >
                <i class="fa fa-user-plus"></i> Add
              </button>
              <span
                v-else
                class="text-gray-400 text-xs flex items-center gap-1.5 px-3 py-2"
              >
                <i class="fa fa-check"></i> Sent
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- SUGGESTIONS (idle state) -->
      <div v-else>
        <h2
          class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3"
        >
          People you may know
        </h2>

        <div v-if="loadingSuggestions" class="text-center text-gray-400 py-14">
          <i class="fa fa-spinner fa-spin text-2xl"></i>
        </div>

        <div
          v-else-if="suggestions.length === 0"
          class="text-center text-gray-400 py-14"
        >
          No suggestions right now — try searching above.
        </div>

        <div v-else class="grid sm:grid-cols-2 gap-3">
          <div
            v-for="user in suggestions"
            :key="user.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0"
              >
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <i class="fa fa-user text-gray-400 text-xl"></i>
                </div>
              </div>
              <p class="font-semibold text-gray-900 text-sm truncate">
                {{ user.full_name }}
              </p>
            </div>

            <button
              v-if="!requestedIds.includes(user.id)"
              @click="addFriend(user.id)"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 flex-shrink-0"
            >
              <i class="fa fa-user-plus"></i> Add
            </button>
            <span
              v-else
              class="text-gray-400 text-xs flex items-center gap-1.5 px-3 py-2 flex-shrink-0"
            >
              <i class="fa fa-check"></i> Sent
            </span>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

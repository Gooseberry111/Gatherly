<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NavBar from "../components/NavBar.vue";
import BottomNav from "../components/BottomNav.vue";
import { useFriends } from "../composables/useFriends";

const router = useRouter();
const { searchUsers, sendFriendRequest, getSentRequests, sentRequests } =
  useFriends();

const query = ref("");
const results = ref([]);
const loading = ref(false);
const requestedIds = ref([]);

onMounted(async () => {
  await getSentRequests();
  requestedIds.value = sentRequests.value.map((r) => r.receiver_id);
});

const search = async () => {
  if (!query.value.trim()) return;
  loading.value = true;
  results.value = await searchUsers(query.value);
  loading.value = false;
};

const addFriend = async (userId) => {
  const { error } = await sendFriendRequest(userId);
  if (!error) requestedIds.value.push(userId);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />

    <div class="pt-14 pb-16 max-w-2xl mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-800 mt-6 mb-4">Find People</h1>

      <!-- Search Input -->
      <div
        class="flex items-center gap-3 bg-white rounded-xl shadow px-4 py-3 mb-6"
      >
        <i class="fa fa-search text-gray-400"></i>
        <input
          v-model="query"
          type="text"
          placeholder="Search for people..."
          class="flex-1 text-sm focus:outline-none"
          @keyup.enter="search"
        />
        <button
          @click="search"
          class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-400 py-10">
        <i class="fa fa-spinner fa-spin text-2xl"></i>
      </div>

      <!-- Results -->
      <div v-else class="space-y-3">
        <div
          v-for="user in results"
          :key="user.id"
          class="bg-white rounded-xl shadow p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0"
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
            <div>
              <p class="font-semibold text-gray-800 text-sm">
                {{ user.full_name }}
              </p>
            </div>
          </div>

          <button
            v-if="!requestedIds.includes(user.id)"
            @click="addFriend(user.id)"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <i class="fa fa-user-plus"></i> Add Friend
          </button>
          <span v-else class="text-gray-400 text-sm flex items-center gap-2">
            <i class="fa fa-check"></i> Requested
          </span>
        </div>

        <div
          v-if="results.length === 0 && query"
          class="text-center text-gray-400 py-10"
        >
          No users found for "{{ query }}"
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

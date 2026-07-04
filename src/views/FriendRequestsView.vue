<script setup>
import { onMounted } from "vue";
import NavBar from "../components/NavBar.vue";
import BottomNav from "../components/BottomNav.vue";
import { useFriends } from "../composables/useFriends";

const {
  pendingRequests,
  getPendingRequests,
  acceptFriendRequest,
  declineFriendRequest,
} = useFriends();

onMounted(async () => {
  await getPendingRequests();
});

const accept = async (requestId) => {
  await acceptFriendRequest(requestId);
};

const decline = async (requestId) => {
  await declineFriendRequest(requestId);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />

    <div class="pt-14 pb-16 max-w-2xl mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-800 mt-6 mb-4">
        Friend Requests
      </h1>

      <div
        v-if="pendingRequests.length === 0"
        class="text-center text-gray-400 py-10"
      >
        No pending friend requests
      </div>

      <div class="space-y-3">
        <div
          v-for="request in pendingRequests"
          :key="request.id"
          class="bg-white rounded-xl shadow p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0"
            >
              <img
                v-if="request.sender.avatar_url"
                :src="request.sender.avatar_url"
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
                {{ request.sender.full_name }}
              </p>
              <p class="text-xs text-gray-400">Wants to be your friend</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="accept(request.id)"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Accept
            </button>
            <button
              @click="decline(request.id)"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

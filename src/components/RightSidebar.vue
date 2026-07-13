<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";
import { usePresence } from "../composables/usePresence";

const { onlineUserIds } = usePresence();

const users = ref([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .neq("id", currentUser.value.id)
    .limit(20);

  if (!error) users.value = data;
  loading.value = false;
});

const contacts = computed(() =>
  users.value.map((u) => ({
    id: u.id,
    name: u.full_name,
    avatar: u.avatar_url,
    online: onlineUserIds.value.has(u.id),
  })),
);
</script>

<template>
  <div class="py-4 pl-2 space-y-4">
    <!-- Sponsored -->
    <div>
      <p class="text-gray-500 font-semibold text-sm px-2 mb-3">Sponsored</p>
      <div
        class="flex items-start gap-3 px-2 hover:bg-gray-200 rounded-xl p-2 cursor-pointer"
      >
        <img
          src="https://picsum.photos/seed/ad1/100/80"
          class="w-24 h-20 rounded-xl object-cover flex-shrink-0"
        />
        <div>
          <p class="text-sm font-medium text-gray-800">Gatherly Ads</p>
          <p class="text-xs text-gray-500">gatherly.com</p>
          <p class="text-xs text-gray-500 mt-1">
            Grow your business with Gatherly Ads.
          </p>
        </div>
      </div>
    </div>

    <hr class="border-gray-200" />

    <!-- Birthdays -->
    <div>
      <p class="text-gray-500 font-semibold text-sm px-2 mb-3">Birthdays</p>
      <div
        class="flex items-center gap-3 px-2 hover:bg-gray-200 rounded-xl p-2 cursor-pointer"
      >
        <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <i class="fa fa-birthday-cake text-2xl text-blue-500"></i>
        </div>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Amina Yusuf</span> and
          <span class="font-semibold">2 others</span> have birthdays today.
        </p>
      </div>
    </div>

    <hr class="border-gray-200" />

    <!-- Contacts -->
    <div>
      <div class="flex items-center justify-between px-2 mb-3">
        <p class="text-gray-500 font-semibold text-sm">Contacts</p>
        <div class="flex items-center gap-2 text-gray-500">
          <button
            class="hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <i class="fa fa-video text-sm"></i>
          </button>
          <button
            class="hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <i class="fa fa-search text-sm"></i>
          </button>
          <button
            class="hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <i class="fa fa-ellipsis-h text-sm"></i>
          </button>
        </div>
      </div>

      <p v-if="loading" class="text-sm text-gray-400 px-2 py-2">Loading...</p>
      <p
        v-else-if="contacts.length === 0"
        class="text-sm text-gray-400 px-2 py-2"
      >
        No users yet
      </p>

      <button
        v-for="contact in contacts"
        :key="contact.id"
        class="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-200 transition text-left"
      >
        <div class="relative flex-shrink-0">
          <div class="w-9 h-9 rounded-full overflow-hidden bg-gray-300">
            <img
              v-if="contact.avatar"
              :src="contact.avatar"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="fa fa-user text-gray-400 text-xs"></i>
            </div>
          </div>
          <span
            v-if="contact.online"
            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          ></span>
        </div>
        <span class="text-sm font-medium text-gray-800">{{
          contact.name
        }}</span>
      </button>
    </div>
  </div>
</template>

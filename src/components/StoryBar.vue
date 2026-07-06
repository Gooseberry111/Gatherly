<script setup>
import { ref, onMounted } from "vue";
import StoryViewer from "./StoryViewer.vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";
import { useRouter } from "vue-router";

const scrollContainer = ref(null);
const showLeftArrow = ref(false);
const showViewer = ref(false);
const selectedIndex = ref(0);
const stories = ref([]);
const uploading = ref(false);
const router = useRouter();

const scroll = (direction) => {
  const container = scrollContainer.value;
  container.scrollBy({
    left: direction === "right" ? 300 : -300,
    behavior: "smooth",
  });
};

const onScroll = () => {
  showLeftArrow.value = scrollContainer.value.scrollLeft > 0;
};

const openStory = (index) => {
  selectedIndex.value = index;
  showViewer.value = true;
};

const closeStory = () => {
  showViewer.value = false;
};

const loadStories = async () => {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (data) {
    const userIds = [...new Set(data.map((s) => s.user_id))];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds);

    const profileMap = {};
    if (profiles) {
      profiles.forEach((p) => {
        profileMap[p.id] = p;
      });
    }

    // Group stories by user - keep only the most recent per user
    const seenUsers = new Set();
    stories.value = data
      .filter((s) => {
        if (seenUsers.has(s.user_id)) return false;
        seenUsers.add(s.user_id);
        return true;
      })
      .map((s) => ({
        id: s.id,
        user_id: s.user_id,
        name: profileMap[s.user_id]?.full_name || "User",
        img: s.image_url || null,
        avatar: profileMap[s.user_id]?.avatar_url || null,
        textContent: s.text_content || null,
        textBg: s.text_bg || null,
      }));
  }
};
const onStoryImageSelected = async (e) => {
  const file = e.target.files[0];
  if (!file || !currentUser.value) return;

  uploading.value = true;

  const fileExt = file.name.split(".").pop();
  const fileName = `public/${currentUser.value.id}_${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("stories")
    .upload(fileName, file);

  if (uploadError) {
    alert(uploadError.message);
    uploading.value = false;
    return;
  }

  const { data: urlData } = supabase.storage
    .from("stories")
    .getPublicUrl(fileName);

  const { error: insertError } = await supabase.from("stories").insert({
    user_id: currentUser.value.id,
    image_url: urlData.publicUrl,
  });

  if (!insertError) await loadStories();
  uploading.value = false;
};

onMounted(loadStories);
</script>

<template>
  <div class="relative">
    <!-- Story Viewer -->
    <StoryViewer
      v-if="showViewer && stories.length > 0"
      :stories="stories"
      :startIndex="selectedIndex"
      @close="closeStory"
    />

    <!-- Left Arrow -->
    <button
      v-if="showLeftArrow"
      @click="scroll('left')"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
    >
      <i class="fa fa-chevron-left text-gray-600 text-sm"></i>
    </button>

    <!-- Scrollable Row -->
    <div
      ref="scrollContainer"
      @scroll="onScroll"
      class="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <!-- Create Story -->
      <!-- Create Story -->
      <div
        @click="router.push('/stories/create')"
        class="flex-shrink-0 w-28 h-44 rounded-xl overflow-hidden shadow cursor-pointer relative bg-white"
      >
        <div
          class="w-full h-32 bg-gray-200 overflow-hidden flex items-center justify-center"
        >
          <i class="fa fa-user text-4xl text-gray-400"></i>
        </div>
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div
            class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white"
          >
            <i class="fa fa-plus text-white text-sm"></i>
          </div>
        </div>
        <div class="absolute bottom-0 w-full bg-white text-center py-2">
          <p class="text-xs font-semibold text-gray-800">Create Story</p>
        </div>
      </div>

      <!-- Story Cards -->
      <div
        v-for="(story, index) in stories"
        :key="story.id"
        @click="openStory(index)"
        class="flex-shrink-0 w-28 h-44 rounded-xl overflow-hidden shadow cursor-pointer relative"
      >
        <img :src="story.img" class="w-full h-full object-cover" />

        <!-- Avatar -->
        <div
          class="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-blue-600 overflow-hidden"
        >
          <img
            v-if="story.avatar"
            :src="story.avatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gray-300 flex items-center justify-center"
          >
            <i class="fa fa-user text-white text-sm"></i>
          </div>
        </div>

        <!-- Name -->
        <div
          class="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent px-2 py-3"
        >
          <p class="text-xs font-semibold text-white leading-tight">
            {{ story.name }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right Arrow -->
    <button
      @click="scroll('right')"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
    >
      <i class="fa fa-chevron-right text-gray-600 text-sm"></i>
    </button>
  </div>
</template>

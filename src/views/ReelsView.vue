<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";
import CreateReel from "../components/CreateReel.vue";

const router = useRouter();
const goBack = () => router.push("/home");

const reels = ref([]);
const loading = ref(true);

const loadReels = async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from("reels")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("LOAD REELS ERROR:", error);
  } else {
    reels.value = data.map((r) => ({
      ...r,
      liked: false,
      likes_count: r.likes_count || 0,
      comments_count: r.comments_count || 0,
      comments: [],
      commentsLoaded: false,
    }));
    await checkLikedStatus();
  }
  loading.value = false;
};

const checkLikedStatus = async () => {
  if (!currentUser.value || reels.value.length === 0) return;
  const { data } = await supabase
    .from("reel_likes")
    .select("reel_id")
    .eq("user_id", currentUser.value.id)
    .in(
      "reel_id",
      reels.value.map((r) => r.id),
    );

  const likedIds = new Set((data || []).map((l) => l.reel_id));
  reels.value.forEach((r) => {
    r.liked = likedIds.has(r.id);
  });
};

const handleReelCreated = (reel) => {
  reels.value.unshift({
    ...reel,
    liked: false,
    likes_count: 0,
    comments_count: 0,
    comments: [],
    commentsLoaded: false,
  });
  currentIndex.value = 0;
};

onMounted(loadReels);

const currentIndex = ref(0);
const touchStartY = ref(0);
const isScrolling = ref(false);
const direction = ref("up");

const prev = () => {
  if (currentIndex.value > 0) {
    direction.value = "down";
    currentIndex.value--;
  }
};

const next = () => {
  if (currentIndex.value < reels.value.length - 1) {
    direction.value = "up";
    currentIndex.value++;
  }
};

const currentReel = computed(() => reels.value[currentIndex.value] || null);

const onWheel = (e) => {
  if (isScrolling.value) return;
  if (Math.abs(e.deltaY) < 50) return;
  isScrolling.value = true;
  if (e.deltaY > 0) next();
  else prev();
  setTimeout(() => {
    isScrolling.value = false;
  }, 500);
};

const onTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY;
};

const onTouchEnd = (e) => {
  const diff = touchStartY.value - e.changedTouches[0].clientY;
  if (diff > 50) next();
  else if (diff < -50) prev();
};

// Mute
const isMuted = ref(true);
const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

// Like
const toggleLike = async (reel) => {
  if (!currentUser.value) return;

  if (reel.liked) {
    reel.liked = false;
    reel.likes_count--;
    await supabase
      .from("reel_likes")
      .delete()
      .eq("reel_id", reel.id)
      .eq("user_id", currentUser.value.id);
  } else {
    reel.liked = true;
    reel.likes_count++;
    await supabase
      .from("reel_likes")
      .insert({ reel_id: reel.id, user_id: currentUser.value.id });
  }
};

// Comments
const showComments = ref(false);
const commentText = ref("");

const openComments = async (reel) => {
  showComments.value = true;
  if (!reel.commentsLoaded) {
    const { data, error } = await supabase
      .from("reel_comments")
      .select("*, profiles(full_name, avatar_url)")
      .eq("reel_id", reel.id)
      .order("created_at", { ascending: true });

    if (!error) {
      reel.comments = data;
      reel.commentsLoaded = true;
    }
  }
};

const submitComment = async () => {
  const reel = currentReel.value;
  if (!commentText.value.trim() || !currentUser.value || !reel) return;

  const { data, error } = await supabase
    .from("reel_comments")
    .insert({
      reel_id: reel.id,
      user_id: currentUser.value.id,
      content: commentText.value.trim(),
    })
    .select("*, profiles(full_name, avatar_url)")
    .single();

  if (error) {
    console.error("REEL COMMENT ERROR:", error);
    return;
  }

  reel.comments.push(data);
  reel.comments_count++;
  commentText.value = "";
};

// Delete reel
const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const deleteReel = async (reel) => {
  showMenu.value = false;
  const { error } = await supabase.from("reels").delete().eq("id", reel.id);

  if (error) {
    alert(error.message);
    return;
  }

  const idx = reels.value.findIndex((r) => r.id === reel.id);
  if (idx !== -1) {
    reels.value.splice(idx, 1);
    if (currentIndex.value >= reels.value.length) {
      currentIndex.value = Math.max(0, reels.value.length - 1);
    }
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black h-screen w-screen z-40 overflow-hidden">
    <!-- Back button -->
    <button
      @click="goBack"
      class="fixed top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
    >
      <i class="fa fa-arrow-left text-lg"></i>
    </button>

    <div class="flex h-full">
      <!-- Left Sidebar - desktop only -->
      <div
        class="hidden lg:flex flex-col w-64 px-4 py-6 pt-20 text-white flex-shrink-0"
      >
        <h2 class="text-xl font-bold mb-6">Reels</h2>
        <div class="space-y-2">
          <button
            class="w-full flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-xl text-left"
          >
            <i class="fa fa-star text-lg"></i>
            <span class="font-medium">For you</span>
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-xl text-left"
          >
            <i class="fa fa-user-friends text-lg"></i>
            <span class="font-medium">Following</span>
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-xl text-left"
          >
            <i class="fa fa-user text-lg"></i>
            <span class="font-medium">Profile</span>
          </button>
        </div>
      </div>

      <!-- Reel Viewer -->
      <div
        class="flex-1 overflow-hidden flex items-center justify-center relative"
        @wheel.prevent="onWheel"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div v-if="loading" class="text-white text-sm">Loading reels...</div>

        <div
          v-else-if="reels.length === 0"
          class="text-white text-sm text-center px-6"
        >
          No reels yet. Be the first to upload one!
        </div>

        <template v-else>
          <!-- Mobile: full screen video -->
          <div class="lg:hidden absolute inset-0">
            <Transition :name="direction === 'up' ? 'slide-up' : 'slide-down'">
              <div :key="currentIndex" class="absolute inset-0">
                <video
                  :src="currentReel.video_url"
                  autoplay
                  :muted="isMuted"
                  loop
                  playsinline
                  class="w-full h-full object-cover"
                ></video>

                <!-- Legibility gradient -->
                <div
                  class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
                ></div>

                <!-- Mute -->
                <button
                  @click="toggleMute"
                  class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center"
                >
                  <i
                    :class="isMuted ? 'fa fa-volume-mute' : 'fa fa-volume-up'"
                  ></i>
                </button>

                <!-- Overlay bottom info -->
                <div
                  class="absolute bottom-6 left-4 text-white space-y-2 max-w-[70%] z-10"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-9 h-9 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center overflow-hidden flex-shrink-0"
                    >
                      <img
                        v-if="currentReel.profiles?.avatar_url"
                        :src="currentReel.profiles.avatar_url"
                        class="w-full h-full object-cover"
                      />
                      <i v-else class="fa fa-user text-white text-sm"></i>
                    </div>
                    <span class="font-semibold text-sm">{{
                      currentReel.profiles?.full_name || "User"
                    }}</span>
                    <button
                      class="border border-white text-white text-xs px-3 py-1 rounded-full"
                    >
                      Follow
                    </button>
                  </div>
                  <p class="text-sm">{{ currentReel.description }}</p>
                </div>

                <!-- Mobile action buttons -->
                <div
                  class="absolute bottom-6 right-4 flex flex-col items-center gap-5 text-white z-10"
                >
                  <button
                    @click="toggleLike(currentReel)"
                    class="flex flex-col items-center gap-1"
                  >
                    <i
                      class="fa fa-thumbs-up text-2xl"
                      :class="
                        currentReel.liked ? 'text-blue-500' : 'text-white'
                      "
                    ></i>
                    <span class="text-xs">{{ currentReel.likes_count }}</span>
                  </button>
                  <button
                    @click="openComments(currentReel)"
                    class="flex flex-col items-center gap-1"
                  >
                    <i class="fa fa-comment text-2xl"></i>
                    <span class="text-xs">{{
                      currentReel.comments_count
                    }}</span>
                  </button>
                  <button class="flex flex-col items-center gap-1">
                    <i class="fa fa-share text-2xl"></i>
                    <span class="text-xs">{{
                      currentReel.shares_count || 0
                    }}</span>
                  </button>
                  <div class="relative">
                    <button @click="toggleMenu">
                      <i class="fa fa-ellipsis-h text-2xl"></i>
                    </button>
                    <div
                      v-if="showMenu"
                      class="absolute bottom-8 right-0 bg-white rounded-lg shadow-lg z-30 text-sm w-32"
                    >
                      <button
                        v-if="currentReel.user_id === currentUser?.id"
                        @click="deleteReel(currentReel)"
                        class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Desktop: centered card with actions beside -->
          <div class="hidden lg:flex items-end gap-4 mx-auto">
            <div
              class="relative w-80 h-[88vh] max-h-[820px] rounded-2xl overflow-hidden bg-black flex-shrink-0 shadow-2xl"
            >
              <Transition
                :name="direction === 'up' ? 'slide-up' : 'slide-down'"
              >
                <div :key="currentIndex" class="absolute inset-0">
                  <video
                    :src="currentReel.video_url"
                    autoplay
                    :muted="isMuted"
                    loop
                    playsinline
                    class="w-full h-full object-cover"
                  ></video>

                  <div
                    class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
                  ></div>

                  <button
                    @click="toggleMute"
                    class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center"
                  >
                    <i
                      :class="isMuted ? 'fa fa-volume-mute' : 'fa fa-volume-up'"
                    ></i>
                  </button>

                  <div
                    class="absolute bottom-6 left-4 text-white space-y-2 max-w-[80%] z-10"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-9 h-9 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center overflow-hidden flex-shrink-0"
                      >
                        <img
                          v-if="currentReel.profiles?.avatar_url"
                          :src="currentReel.profiles.avatar_url"
                          class="w-full h-full object-cover"
                        />
                        <i v-else class="fa fa-user text-white text-sm"></i>
                      </div>
                      <span class="font-semibold text-sm">{{
                        currentReel.profiles?.full_name || "User"
                      }}</span>
                      <button
                        class="border border-white text-white text-xs px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
                      >
                        Follow
                      </button>
                    </div>
                    <p class="text-sm">{{ currentReel.description }}</p>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Right Actions -->
            <div
              class="flex flex-col items-center justify-end gap-5 text-white h-[88vh] max-h-[820px] pb-6"
            >
              <button
                @click="toggleLike(currentReel)"
                class="flex flex-col items-center gap-1"
              >
                <i
                  class="fa fa-thumbs-up text-2xl"
                  :class="currentReel.liked ? 'text-blue-500' : 'text-white'"
                ></i>
                <span class="text-xs">{{ currentReel.likes_count }}</span>
              </button>
              <button
                @click="openComments(currentReel)"
                class="flex flex-col items-center gap-1"
              >
                <i class="fa fa-comment text-2xl"></i>
                <span class="text-xs">{{ currentReel.comments_count }}</span>
              </button>
              <button class="flex flex-col items-center gap-1">
                <i class="fa fa-share text-2xl"></i>
                <span class="text-xs">{{ currentReel.shares_count || 0 }}</span>
              </button>
              <div class="relative">
                <button @click="toggleMenu">
                  <i class="fa fa-ellipsis-h text-2xl"></i>
                </button>
                <div
                  v-if="showMenu"
                  class="absolute bottom-8 right-0 bg-white rounded-lg shadow-lg z-30 text-sm w-32"
                >
                  <button
                    v-if="currentReel.user_id === currentUser?.id"
                    @click="deleteReel(currentReel)"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Up/Down arrows -->
            <div
              class="flex flex-col gap-3 justify-end h-[88vh] max-h-[820px] pb-50 pl-30"
            >
              <button
                @click="prev"
                :disabled="currentIndex === 0"
                class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 disabled:opacity-30"
              >
                <i class="fa fa-chevron-up text-white text-lg"></i>
              </button>
              <button
                @click="next"
                :disabled="currentIndex === reels.length - 1"
                class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 disabled:opacity-30"
              >
                <i class="fa fa-chevron-down text-white text-lg"></i>
              </button>
            </div>
          </div>
        </template>

        <!-- Comments Drawer -->
        <Transition name="slide-panel">
          <div
            v-if="showComments"
            class="fixed inset-x-0 bottom-0 lg:right-0 lg:left-auto lg:top-0 lg:w-96 lg:inset-x-auto bg-white z-50 rounded-t-2xl lg:rounded-none max-h-[70vh] lg:max-h-none lg:h-full flex flex-col"
          >
            <div class="flex items-center justify-between px-4 py-3 border-b">
              <h3 class="font-semibold">Comments</h3>
              <button @click="showComments = false" class="text-gray-400">
                <i class="fa fa-times"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              <div
                v-for="comment in currentReel?.comments"
                :key="comment.id"
                class="flex items-start gap-2"
              >
                <div
                  class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-300"
                >
                  <img
                    v-if="comment.profiles?.avatar_url"
                    :src="comment.profiles.avatar_url"
                    class="w-full h-full object-cover"
                  />
                  <i v-else class="fa fa-user text-gray-400 text-xs"></i>
                </div>
                <div class="bg-gray-100 rounded-2xl px-3 py-2 flex-1">
                  <p class="text-xs font-semibold text-gray-800">
                    {{ comment.profiles?.full_name || "User" }}
                  </p>
                  <p class="text-sm text-gray-700">{{ comment.content }}</p>
                </div>
              </div>
              <p
                v-if="!currentReel?.comments?.length"
                class="text-sm text-gray-400 text-center pt-4"
              >
                No comments yet.
              </p>
            </div>

            <div class="flex items-center gap-2 px-4 py-3 border-t">
              <input
                v-model="commentText"
                type="text"
                placeholder="Write a comment..."
                class="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
                @keyup.enter="submitComment"
              />
              <button @click="submitComment" class="text-blue-500">
                <i class="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <CreateReel @reel-created="handleReelCreated" />
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
}
.slide-up-leave-to {
  transform: translateY(-100%);
}

.slide-down-enter-from {
  transform: translateY(-100%);
}
.slide-down-leave-to {
  transform: translateY(100%);
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s ease;
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateY(100%);
}
</style>

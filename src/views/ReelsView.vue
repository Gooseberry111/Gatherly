<script setup>
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import karissa from "../assets/videos/karissa.mp4";
import apochi from "../assets/videos/apochi.mov";
import gym from "../assets/videos/gym.mp4";
import lacecar from "../assets/videos/lacecar.mp4";
import mumsbirthday from "../assets/videos/mumsbirthday.mp4";
import beach from "../assets/videos/beach.mov";
import ghana from "../assets/videos/ghana.mov";
import ring from "../assets/videos/ring.mov";
import BottomNav from "../components/BottomNav.vue";

const reels = [
  {
    id: 1,
    name: "Emmanuella",
    description: "Fun moment 🎉",
    avatar: null,
    video: apochi,
    likes: 120,
    comments: 34,
    shares: 12,
  },
  {
    id: 2,
    name: "Emmanuella",
    description: "Another clip ✨",
    avatar: null,
    video: karissa,
    likes: 89,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    name: "Emmanuella",
    description: "Another clip ✨",
    avatar: null,
    video: ghana,
    likes: 89,
    comments: 12,
    shares: 5,
  },
  {
    id: 4,
    name: "Emmanuella",
    description: "Another clip ✨",
    avatar: null,
    video: mumsbirthday,
    likes: 89,
    comments: 12,
    shares: 5,
  },
  {
    id: 5,
    name: "Emmanuella",
    description: "Another clip ✨",
    avatar: null,
    video: beach,
    likes: 89,
    comments: 12,
    shares: 5,
  },
  {
    id: 6,
    name: "Emmanuella",
    description: "Another clip ✨",
    avatar: null,
    video: ring,
    likes: 89,
    comments: 12,
    shares: 5,
  },
  {
    id: 7,
    name: "Emmanuella",
    description: "Another clip ✨",
    avatar: null,
    video: gym,
    likes: 89,
    comments: 12,
    shares: 5,
  },
  {
    id: 8,
    name: "Emmanuella",
    description: "Another clip ✨",
    avatar: null,
    video: lacecar,
    likes: 89,
    comments: 12,
    shares: 5,
  },
];

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
  if (currentIndex.value < reels.length - 1) {
    direction.value = "up";
    currentIndex.value++;
  }
};

const currentReel = () => reels[currentIndex.value];

const onWheel = (e) => {
  if (isScrolling.value) return;
  if (Math.abs(e.deltaY) < 50) return;
  isScrolling.value = true;
  if (e.deltaY > 0) next();
  else prev();
  setTimeout(() => {
    isScrolling.value = false;
  }, 1000);
};

const onTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY;
};

const onTouchEnd = (e) => {
  const diff = touchStartY.value - e.changedTouches[0].clientY;
  if (diff > 50) next();
  else if (diff < -50) prev();
};
</script>

<template>
  <div class="min-h-screen bg-black">
    <NavBar />

    <div class="pt-14 flex h-[calc(100vh-0.5rem)]">
      <!-- Left Sidebar - desktop only -->
      <div
        class="hidden lg:flex flex-col w-64 px-4 py-6 text-white flex-shrink-0"
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
        <!-- Mobile: full screen video -->
        <div class="lg:hidden absolute inset-0">
          <Transition :name="direction === 'up' ? 'slide-up' : 'slide-down'">
            <div :key="currentIndex" class="absolute inset-0">
              <video
                :src="currentReel().video"
                autoplay
                muted
                loop
                class="w-full h-full object-cover"
              ></video>

              <!-- Overlay bottom info -->
              <div
                class="absolute bottom-16 left-4 text-white space-y-2 max-w-[70%]"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-9 h-9 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center overflow-hidden flex-shrink-0"
                  >
                    <i class="fa fa-user text-white text-sm"></i>
                  </div>
                  <span class="font-semibold text-sm">{{
                    currentReel().name
                  }}</span>
                  <button
                    class="border border-white text-white text-xs px-3 py-1 rounded-full"
                  >
                    Follow
                  </button>
                </div>
                <p class="text-sm">{{ currentReel().description }}</p>
              </div>

              <!-- Mobile action buttons -->
              <div
                class="absolute bottom-16 right-4 flex flex-col items-center gap-5 text-white"
              >
                <button class="flex flex-col items-center gap-1">
                  <i class="fa fa-thumbs-up text-2xl"></i>
                  <span class="text-xs">{{ currentReel().likes }}</span>
                </button>
                <button class="flex flex-col items-center gap-1">
                  <i class="fa fa-comment text-2xl"></i>
                  <span class="text-xs">{{ currentReel().comments }}</span>
                </button>
                <button class="flex flex-col items-center gap-1">
                  <i class="fa fa-share text-2xl"></i>
                  <span class="text-xs">{{ currentReel().shares }}</span>
                </button>
                <button>
                  <i class="fa fa-ellipsis-h text-2xl"></i>
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Desktop: centered card with actions beside -->
        <div class="hidden lg:flex items-end gap-4 mx-auto">
          <!-- Video Frame -->
          <div
            class="relative w-80 h-[88vh] max-h-[820px] rounded-2xl overflow-hidden bg-black flex-shrink-0 shadow-2xl"
          >
            <Transition :name="direction === 'up' ? 'slide-up' : 'slide-down'">
              <div :key="currentIndex" class="absolute inset-0">
                <video
                  :src="currentReel().video"
                  autoplay
                  muted
                  loop
                  class="w-full h-full object-cover"
                ></video>

                <div
                  class="absolute bottom-6 left-4 text-white space-y-2 max-w-[80%]"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-9 h-9 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center overflow-hidden flex-shrink-0"
                    >
                      <i class="fa fa-user text-white text-sm"></i>
                    </div>
                    <span class="font-semibold text-sm">{{
                      currentReel().name
                    }}</span>
                    <button
                      class="border border-white text-white text-xs px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
                    >
                      Follow
                    </button>
                  </div>
                  <p class="text-sm">{{ currentReel().description }}</p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Right Actions -->
          <div
            class="flex flex-col items-center justify-end gap-5 text-white h-[88vh] max-h-[820px] pb-6"
          >
            <button class="flex flex-col items-center gap-1">
              <i class="fa fa-thumbs-up text-2xl"></i>
              <span class="text-xs">{{ currentReel().likes }}</span>
            </button>
            <button class="flex flex-col items-center gap-1">
              <i class="fa fa-comment text-2xl"></i>
              <span class="text-xs">{{ currentReel().comments }}</span>
            </button>
            <button class="flex flex-col items-center gap-1">
              <i class="fa fa-share text-2xl"></i>
              <span class="text-xs">{{ currentReel().shares }}</span>
            </button>
            <button>
              <i class="fa fa-ellipsis-h text-2xl"></i>
            </button>
          </div>

          <!-- Up/Down arrows -->
          <div
            class="flex flex-col gap-3 justify-end h-[88vh] max-h-[820px] pb-50 pl"
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
      </div>
    </div>

    <BottomNav />
  </div>
</template>

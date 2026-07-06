<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  stories: Array,
  startIndex: Number,
});

const emit = defineEmits(["close"]);

const currentIndex = ref(props.startIndex || 0);
const progress = ref(0);
let timer = null;

const startProgress = () => {
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 100) {
      if (currentIndex.value < props.stories.length - 1) {
        currentIndex.value++;
      } else {
        emit("close");
      }
    }
  }, 50);
};

const next = () => {
  if (currentIndex.value < props.stories.length - 1) {
    currentIndex.value++;
  } else {
    emit("close");
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

watch(
  currentIndex,
  () => {
    startProgress();
  },
  { immediate: true },
);

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div
    class="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
  >
    <!-- Close button -->
    <button
      @click="emit('close')"
      class="absolute top-4 right-4 text-white text-2xl z-20 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center"
    >
      <i class="fa fa-times"></i>
    </button>

    <!-- Story Card -->
    <div class="relative w-full max-w-sm h-[90vh] rounded-2xl overflow-hidden">
      <!-- Progress Bars -->
      <div class="absolute top-3 left-3 right-3 z-10 flex gap-1">
        <div
          v-for="(story, i) in stories"
          :key="i"
          class="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-white rounded-full transition-none"
            :style="{
              width:
                i < currentIndex
                  ? '100%'
                  : i === currentIndex
                    ? `${progress}%`
                    : '0%',
            }"
          ></div>
        </div>
      </div>

      <!-- Story Author -->
      <div class="absolute top-8 left-4 flex items-center gap-2 z-10 mt-2">
        <div class="w-9 h-9 rounded-full border-2 border-white overflow-hidden">
          <img
            :src="stories[currentIndex].img"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="text-white font-semibold text-sm">{{
          stories[currentIndex].name
        }}</span>
      </div>

      <!-- Story Image or Text -->
      <img
        v-if="stories[currentIndex].img"
        :src="stories[currentIndex].img"
        class="w-full h-full object-cover"
      />
      <div
        v-else-if="stories[currentIndex].textContent"
        :class="`w-full h-full bg-gradient-to-br ${stories[currentIndex].textBg || 'from-blue-400 to-purple-600'} flex items-center justify-center p-8`"
      >
        <p class="text-white text-2xl font-bold text-center">
          {{ stories[currentIndex].textContent }}
        </p>
      </div>

      <!-- Desktop Left Arrow -->
      <button
        @click="prev"
        v-if="currentIndex > 0"
        class="hidden sm:flex absolute left-[-3rem] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-700 hover:bg-gray-100"
      >
        <i class="fa fa-chevron-left"></i>
      </button>

      <!-- Desktop Right Arrow -->
      <button
        @click="next"
        class="hidden sm:flex absolute right-[-3rem] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-700 hover:bg-gray-100"
      >
        <i class="fa fa-chevron-right"></i>
      </button>

      <!-- Mobile Tap Left/Right to navigate -->
      <button
        @click="prev"
        class="sm:hidden absolute left-0 top-0 w-1/2 h-full z-10 opacity-0"
      ></button>
      <button
        @click="next"
        class="sm:hidden absolute right-0 top-0 w-1/2 h-full z-10 opacity-0"
      ></button>

      <!-- Mobile: Message input at bottom -->
      <div
        class="sm:hidden absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Send message..."
          class="flex-1 bg-transparent border border-white/60 text-white placeholder-white/70 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button class="text-white text-xl">😂</button>
        <button class="text-white text-xl">😍</button>
        <button class="text-white text-xl">🔥</button>
        <button class="text-white text-xl">
          <i class="fa fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

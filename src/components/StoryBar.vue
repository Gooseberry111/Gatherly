<script setup>
import { ref } from "vue";
import StoryViewer from "./StoryViewer.vue";

const scrollContainer = ref(null);
const showLeftArrow = ref(false);
const showViewer = ref(false);
const selectedIndex = ref(0);

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

import story1 from "../assets/images/maryann.jpeg";
import story2 from "../assets/images/dorcas.jpeg";
import story3 from "../assets/images/faith.jpeg";
import story4 from "../assets/images/mercy.jpeg";
import story5 from "../assets/images/joel.jpeg";
import story6 from "../assets/images/tony.jpeg";

const stories = [
  { id: 1, name: "Joel", img: story5 },
  { id: 2, name: "Dorcas", img: story2 },
  { id: 3, name: "Faith", img: story3 },
  { id: 4, name: "Mercy", img: story4 },
  { id: 5, name: "Maryann", img: story1 },
  { id: 6, name: "Tony", img: story6 },
];
</script>

<template>
  <div class="relative">
    <!-- Story Viewer -->
    <StoryViewer
      v-if="showViewer"
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
      <div
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
          <img :src="story.img" class="w-full h-full object-cover" />
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

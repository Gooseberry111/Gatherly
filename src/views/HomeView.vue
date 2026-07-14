<script setup>
import NavBar from "../components/NavBar.vue";
import LeftSidebar from "../components/LeftSidebar.vue";
import FeedSection from "../components/FeedSection.vue";
import RightSidebar from "../components/RightSidebar.vue";
import BottomNav from "../components/BottomNav.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />

    <div
      class="max-w-7xl mx-auto pt-14 lg:pt-16 grid grid-cols-12 gap-4 lg:px-4"
    >
      <aside
        class="col-span-3 hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      >
        <LeftSidebar />
      </aside>

      <main class="col-span-12 lg:col-span-6 pb-16 lg:pb-0">
        <FeedSection />
      </main>

      <aside
        class="col-span-3 hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      >
        <RightSidebar />
      </aside>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import logo from "../assets/Gatherly.png";

const emit = defineEmits(["done"]);
const visible = ref(true);

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
    setTimeout(() => {
      emit("done");
    }, 800);
  }, 2500);
});
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
    >
      <img :src="logo" alt="Gatherly" class="w-24 h-24 mb-4 animate-bounce" />
      <h1 class="text-4xl font-bold text-blue-600">Gatherly</h1>
      <p class="text-gray-400 mt-2 text-sm">Connect. Share. Belong.</p>
    </div>
  </Transition>
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>

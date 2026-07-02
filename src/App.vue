<script setup>
import { ref } from "vue";
import SplashScreen from "./components/SplashScreen.vue";

const splashDone = ref(false);

const onSplashDone = () => {
  splashDone.value = true;
};
</script>

<template>
  <SplashScreen @done="onSplashDone" />
  <RouterView v-if="splashDone" />
</template>

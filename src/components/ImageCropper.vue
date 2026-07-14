<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const props = defineProps({
  imageSrc: { type: String, required: true },
  aspectRatio: { type: Number, default: 1 }, // 1 = square, 16/9 = wide, etc.
  circular: { type: Boolean, default: false }, // visual circle overlay (avatars)
});

const emit = defineEmits(["cropped", "cancel"]);

const imageEl = ref(null);
let cropper = null;

onMounted(() => {
  cropper = new Cropper(imageEl.value, {
    aspectRatio: props.aspectRatio,
    viewMode: 1,
    dragMode: "move",
    autoCropArea: 1,
    responsive: true,
    background: false,
  });
});

onBeforeUnmount(() => {
  cropper?.destroy();
});

const confirmCrop = () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({
    width: 800,
    height: props.aspectRatio ? 800 / props.aspectRatio : 800,
    imageSmoothingQuality: "high",
  });

  canvas.toBlob(
    (blob) => {
      emit("cropped", blob);
    },
    "image/jpeg",
    0.9,
  );
};
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-black/80 flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 text-white">
      <button
        @click="emit('cancel')"
        class="w-9 h-9 hover:bg-white/10 rounded-full flex items-center justify-center"
      >
        <i class="fa fa-times"></i>
      </button>
      <p class="font-semibold">Crop photo</p>
      <button
        @click="confirmCrop"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Done
      </button>
    </div>

    <!-- Cropper area -->
    <div class="flex-1 flex items-center justify-center overflow-hidden px-4">
      <div :class="['max-w-lg w-full', circular ? 'cropper-circle' : '']">
        <img ref="imageEl" :src="imageSrc" class="max-w-full block" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Renders the crop selection box as a circle for avatar use */
.cropper-circle :deep(.cropper-view-box),
.cropper-circle :deep(.cropper-face) {
  border-radius: 50%;
}
</style>

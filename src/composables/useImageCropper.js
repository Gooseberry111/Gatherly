import { ref } from "vue";

export const useImageCropper = () => {
  const showCropper = ref(false);
  const rawImageSrc = ref(null);
  const aspectRatio = ref(1);
  const circular = ref(false);
  let resolveCallback = null;

  // Call this from a file input's @change handler
  const openCropper = (file, options = {}) => {
    return new Promise((resolve) => {
      rawImageSrc.value = URL.createObjectURL(file);
      aspectRatio.value = options.aspectRatio ?? 1;
      circular.value = options.circular ?? false;
      showCropper.value = true;
      resolveCallback = resolve;
    });
  };

  const handleCropped = (blob) => {
    showCropper.value = false;
    URL.revokeObjectURL(rawImageSrc.value);
    resolveCallback?.(blob);
  };

  const handleCancel = () => {
    showCropper.value = false;
    URL.revokeObjectURL(rawImageSrc.value);
    resolveCallback?.(null);
  };

  return {
    showCropper,
    rawImageSrc,
    aspectRatio,
    circular,
    openCropper,
    handleCropped,
    handleCancel,
  };
};

<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";

const emit = defineEmits(["reelCreated"]);

const videoFile = ref(null);
const description = ref("");
const uploading = ref(false);
const error = ref("");
const showModal = ref(false);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("video/")) {
    error.value = "Please select a video file.";
    return;
  }

  // Optional: cap file size (e.g. 50MB)
  if (file.size > 50 * 1024 * 1024) {
    error.value = "Video must be under 50MB.";
    return;
  }

  error.value = "";
  videoFile.value = file;
};

const uploadReel = async () => {
  if (!videoFile.value || !currentUser.value) return;

  uploading.value = true;
  error.value = "";

  try {
    const fileExt = videoFile.value.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${currentUser.value.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("reel-videos")
      .upload(filePath, videoFile.value);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("reel-videos").getPublicUrl(filePath);

    const { data, error: insertError } = await supabase
      .from("reels")
      .insert({
        user_id: currentUser.value.id,
        video_url: publicUrl,
        description: description.value.trim(),
      })
      .select("*, profiles(full_name, avatar_url)")
      .single();

    if (insertError) throw insertError;

    emit("reelCreated", data);
    videoFile.value = null;
    description.value = "";
    showModal.value = false;
  } catch (err) {
    console.error("REEL UPLOAD ERROR:", err);
    error.value = err.message || "Failed to upload reel.";
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div>
    <button
      @click="showModal = true"
      class="fixed bottom-70 right-1 lg:bottom-10 lg:right-10 z-20 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg"
    >
      <i class="fa fa-plus text-xl"></i>
    </button>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-30 px-4"
    >
      <div class="bg-white rounded-xl w-full max-w-md p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-lg">Upload a Reel</h3>
          <button
            @click="showModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>

        <input
          type="file"
          accept="video/*"
          @change="handleFileChange"
          class="w-full text-sm"
        />

        <textarea
          v-model="description"
          placeholder="Write a description..."
          rows="3"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        ></textarea>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          @click="uploadReel"
          :disabled="!videoFile || uploading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium"
        >
          {{ uploading ? "Uploading..." : "Post Reel" }}
        </button>
      </div>
    </div>
  </div>
</template>

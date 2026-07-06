<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import { currentUser, userProfile } from "../store/auth";
import logo from "../assets/Gatherly.png";

const router = useRouter();
const selectedType = ref(null); // 'photo' or 'text'
const previewUrl = ref(null);
const selectedFile = ref(null);
const textContent = ref("");
const textBg = ref("from-blue-400 to-purple-600");
const uploading = ref(false);

const backgrounds = [
  "from-blue-400 to-purple-600",
  "from-pink-400 to-red-500",
  "from-green-400 to-teal-500",
  "from-yellow-400 to-orange-500",
  "from-indigo-400 to-blue-600",
  "from-purple-400 to-pink-500",
];

const onFileSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const submitStory = async () => {
  if (!currentUser.value) return;
  uploading.value = true;

  let imageUrl = null;

  if (selectedType.value === "photo" && selectedFile.value) {
    const fileExt = selectedFile.value.name.split(".").pop();
    const fileName = `public/${currentUser.value.id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("stories")
      .upload(fileName, selectedFile.value);

    if (uploadError) {
      alert(uploadError.message);
      uploading.value = false;
      return;
    }

    const { data: urlData } = supabase.storage
      .from("stories")
      .getPublicUrl(fileName);

    imageUrl = urlData.publicUrl;
  }

  console.log("current user:", currentUser.value);

  const { error } = await supabase.from("stories").insert({
    user_id: currentUser.value.id,
    image_url: imageUrl,
    text_content: selectedType.value === "text" ? textContent.value : null,
    text_bg: selectedType.value === "text" ? textBg.value : null,
  });

  console.log("insert error:", error);

  if (!error) router.push("/home");
  uploading.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Left Panel -->
    <div class="w-96 bg-white shadow-lg flex flex-col p-6 z-10">
      <div class="flex items-center gap-3 mb-8">
        <button
          @click="router.push('/home')"
          class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
        >
          <i class="fa fa-times text-gray-600"></i>
        </button>
        <img :src="logo" class="w-13 h-13" />
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mb-2">Your story</h1>

      <!-- Profile -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
          <img
            v-if="userProfile?.avatar_url"
            :src="userProfile.avatar_url"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="fa fa-user text-gray-400 text-xl"></i>
          </div>
        </div>
        <p class="font-semibold text-gray-800">
          {{ userProfile?.full_name || "You" }}
        </p>
      </div>

      <!-- If type selected show submit -->
      <div v-if="selectedType" class="space-y-4">
        <div v-if="selectedType === 'text'">
          <p class="text-sm font-medium text-gray-700 mb-2">Your text</p>
          <textarea
            v-model="textContent"
            placeholder="Start typing..."
            class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-32"
          ></textarea>
          <p class="text-sm font-medium text-gray-700 mt-3 mb-2">Background</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="bg in backgrounds"
              :key="bg"
              @click="textBg = bg"
              :class="`w-8 h-8 rounded-full bg-gradient-to-br ${bg} ${textBg === bg ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`"
            ></button>
          </div>
        </div>

        <button
          @click="submitStory"
          :disabled="
            uploading ||
            (selectedType === 'text' && !textContent.trim()) ||
            (selectedType === 'photo' && !previewUrl)
          "
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <i v-if="uploading" class="fa fa-spinner fa-spin"></i>
          {{ uploading ? "Sharing..." : "Share to story" }}
        </button>

        <button
          @click="
            selectedType = null;
            previewUrl = null;
            selectedFile = null;
          "
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
        >
          Discard
        </button>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 flex items-center justify-center gap-8 p-8">
      <!-- Photo/Video Story -->
      <label
        v-if="!selectedType || selectedType === 'photo'"
        @click="selectedType = 'photo'"
        :class="[
          'relative w-54 h-83 rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105',
          previewUrl ? '' : 'bg-gradient-to-br from-blue-400 to-cyan-300',
        ]"
      >
        <img
          v-if="previewUrl"
          :src="previewUrl"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="relative z-10 flex flex-col items-center gap-3">
          <div
            class="w-14 h-14 bg-white rounded-full flex items-center justify-center"
          >
            <i class="fa fa-image text-gray-700"></i>
          </div>
          <p class="text-white text-center">Create a photo or video story</p>
        </div>
        <input
          type="file"
          accept="image/*,video/*"
          class="hidden"
          @change="onFileSelected"
        />
      </label>

      <!-- Text Story -->
      <div
        v-if="!selectedType || selectedType === 'text'"
        @click="selectedType = 'text'"
        :class="`relative w-54 h-83 rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105 bg-gradient-to-br ${textBg}`"
      >
        <div
          class="w-14 h-14 bg-white rounded-full flex items-center justify-center"
        >
          <span class="text-gray-700 text-xl">Aa</span>
        </div>
        <p class="text-white">Create a text story</p>
        <p
          v-if="textContent"
          class="text-white text-center px-4 text-lg font-medium"
        >
          {{ textContent }}
        </p>
      </div>
    </div>
  </div>
</template>

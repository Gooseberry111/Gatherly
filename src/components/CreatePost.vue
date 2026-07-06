<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { currentUser, userProfile } from "../store/auth";

const showModal = ref(false);
const postText = ref("");
const postImage = ref(null);
const postImagePreview = ref(null);
const posting = ref(false);

const visibility = ref("public"); // "public" | "friends"
const showVisibilityMenu = ref(false);

const visibilityOptions = [
  { value: "public", label: "Everyone", icon: "fa-globe-americas" },
  { value: "friends", label: "Friends", icon: "fa-user-friends" },
];

const currentVisibility = () =>
  visibilityOptions.find((v) => v.value === visibility.value);

const selectVisibility = (value) => {
  visibility.value = value;
  showVisibilityMenu.value = false;
};

const openModal = () => (showModal.value = true);
const closeModal = () => {
  showModal.value = false;
  postText.value = "";
  postImage.value = null;
  postImagePreview.value = null;
  visibility.value = "public";
  showVisibilityMenu.value = false;
};

const onImageSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  postImage.value = file;
  postImagePreview.value = URL.createObjectURL(file);
};

const emit = defineEmits(["newPost"]);

const submitPost = async () => {
  if (!postText.value.trim() && !postImage.value) return;
  posting.value = true;

  let image_url = null;
  if (postImage.value) {
    const ext = postImage.value.name.split(".").pop();
    const fileName = `${currentUser.value.id}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("post-images")
      .upload(fileName, postImage.value);
    if (!uploadErr) {
      image_url = supabase.storage.from("post-images").getPublicUrl(fileName)
        .data.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: currentUser.value.id,
      content: postText.value.trim(),
      image_url,
      visibility: visibility.value,
    })
    .select()
    .single();

  posting.value = false;
  if (error) {
    alert(error.message);
    return;
  }

  emit("newPost", { ...data, profiles: userProfile.value });
  closeModal();
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-2">
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
      >
        <img
          v-if="userProfile?.avatar_url"
          :src="userProfile.avatar_url"
          class="w-full h-full object-cover"
        />
        <i v-else class="fa fa-user text-gray-500"></i>
      </div>
      <button
        @click="openModal"
        class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm text-left px-4 py-3 rounded-full"
      >
        What's on your mind?
      </button>
      <button
        @click="openModal"
        class="text-gray-400 hover:bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      >
        <i class="fa fa-video text-lg"></i>
      </button>
      <button
        @click="openModal"
        class="text-gray-400 hover:bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      >
        <i class="fa fa-image text-lg"></i>
      </button>
      <button
        @click="openModal"
        class="text-gray-400 hover:bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      >
        <i class="fa fa-smile text-lg"></i>
      </button>
    </div>
  </div>

  <!-- Create Post Modal -->
  <Transition name="fade">
    <div
      v-if="showModal"
      class="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
        >
          <h2 class="text-lg font-bold text-gray-800">Create post</h2>
          <button
            @click="closeModal"
            class="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
          >
            <i class="fa fa-times text-gray-600"></i>
          </button>
        </div>

        <!-- Author -->
        <div class="flex items-center gap-3 px-6 py-4">
          <div
            class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="userProfile?.avatar_url"
              :src="userProfile.avatar_url"
              class="w-full h-full object-cover"
            />
            <i v-else class="fa fa-user text-gray-500"></i>
          </div>
          <div class="relative">
            <p class="text-sm font-semibold text-gray-800">
              {{ userProfile?.full_name || "You" }}
            </p>
            <button
              @click="showVisibilityMenu = !showVisibilityMenu"
              class="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-xs font-medium px-2 py-1 rounded-lg mt-1"
            >
              <i :class="`fa ${currentVisibility().icon} text-xs`"></i>
              {{ currentVisibility().label }}
              <i class="fa fa-chevron-down text-xs"></i>
            </button>

            <!-- Visibility Dropdown -->
            <div
              v-if="showVisibilityMenu"
              class="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 py-1"
            >
              <button
                v-for="option in visibilityOptions"
                :key="option.value"
                @click="selectVisibility(option.value)"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <i :class="`fa ${option.icon} text-gray-500`"></i>
                {{ option.label }}
                <i
                  v-if="visibility === option.value"
                  class="fa fa-check text-blue-500 ml-auto"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Text Input -->
        <div class="px-6">
          <textarea
            v-model="postText"
            placeholder="What's on your mind?"
            class="w-full text-gray-800 text-lg placeholder-gray-400 focus:outline-none resize-none min-h-[120px]"
          ></textarea>
        </div>

        <!-- Image Preview -->
        <div v-if="postImagePreview" class="px-6 mt-2 relative">
          <img
            :src="postImagePreview"
            class="w-full rounded-xl object-contain max-h-64"
          />
          <button
            @click="
              postImagePreview = null;
              postImage = null;
            "
            class="absolute top-2 right-8 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
          >
            <i class="fa fa-times text-sm"></i>
          </button>
        </div>

        <!-- Add to post -->
        <div class="px-6 py-4 mt-2">
          <div
            class="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between"
          >
            <span class="text-sm font-medium text-gray-700"
              >Add to your post</span
            >
            <div class="flex items-center gap-3">
              <label class="cursor-pointer">
                <i
                  class="fa fa-image text-green-500 text-xl hover:scale-110 transition-transform"
                ></i>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onImageSelected"
                />
              </label>
              <button>
                <i
                  class="fa fa-user-tag text-blue-500 text-xl hover:scale-110 transition-transform"
                ></i>
              </button>
              <button>
                <i
                  class="fa fa-smile text-yellow-400 text-xl hover:scale-110 transition-transform"
                ></i>
              </button>
              <button>
                <i
                  class="fa fa-map-marker text-red-500 text-xl hover:scale-110 transition-transform"
                ></i>
              </button>
              <button>
                <i class="fa fa-ellipsis-h text-gray-500 text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Post Button -->
        <div class="px-6 pb-6">
          <button
            @click="submitPost"
            :disabled="!postText.trim() && !postImagePreview"
            :class="[
              'w-full py-2 rounded-xl font-semibold text-sm transition',
              postText.trim() || postImagePreview
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            ]"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

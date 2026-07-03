<script setup>
import { ref } from "vue";

const props = defineProps({
  post: Object,
  currentUserId: String,
});
const isOwner = () => {
  return props.post.user_id === props.currentUserId;
};

const liked = ref(false);
const likeCount = ref(props.post.likes_count || 0);
const showComments = ref(false);
const commentText = ref("");
const comments = ref([]);
const emit = defineEmits(["delete-post"]);

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const toggleLike = () => {
  liked.value = !liked.value;
  likeCount.value = liked.value ? likeCount.value + 1 : likeCount.value - 1;
};

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const submitComment = () => {
  if (commentText.value.trim() === "") return;
  comments.value.push({
    id: Date.now(),
    name: "Emmanuella",
    text: commentText.value.trim(),
    time: "Just now",
  });
  commentText.value = "";
};
const deletePost = () => {
  emit("delete-post", props.post.id);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow space-y-3">
    <!-- Post Header -->
    <div class="flex items-center justify-between px-4 pt-4 relative">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            v-if="post.profiles?.avatar_url"
            :src="post.profiles.avatar_url"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gray-300 flex items-center justify-center"
          >
            <i class="fa fa-user text-gray-500"></i>
          </div>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">
            {{ post.profiles?.full_name || "Unknown" }}
          </p>
          <p class="text-xs text-gray-400">
            {{ new Date(post.created_at).toLocaleDateString() }} ·
            <i class="fa fa-globe-americas"></i>
          </p>
        </div>
      </div>
      <div class="relative">
        <button
          @click="toggleMenu"
          class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <i class="fa fa-ellipsis-h"></i>
        </button>

        <div
          v-if="showMenu"
          class="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
        >
          <div v-if="isOwner()">
            <button
              @click="deletePost"
              class="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500 text-sm"
            >
              Delete Post
            </button>
          </div>

          <div v-else>
            <button
              class="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
            >
              Save Post
            </button>

            <button
              class="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
            >
              Not Interested
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="text-sm text-gray-800 leading-relaxed px-4">{{ post.content }}</p>

    <!-- Post Image -->
    <img
      v-if="post.image_url"
      :src="post.image_url"
      class="w-full object-contain"
    />

    <!-- Post Video -->
    <video
      v-if="post.video_url"
      :src="post.video_url"
      autoplay
      muted
      loop
      controls
      class="w-full max-h-80 object-contain"
    ></video>
    <!-- Like/Comment Count -->
    <div
      class="flex items-center justify-between text-xs text-gray-400 border-b border-gray-200 pb-2 px-4"
    >
      <span>
        <i
          class="fa fa-thumbs-up"
          :class="liked ? 'text-blue-500' : 'text-gray-400'"
        ></i>
        {{ likeCount }}
      </span>
      <button @click="toggleComments" class="hover:underline">
        {{ comments.length + post.comments }} comments ·
        {{ post.shares }} shares
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-around pb-2 px-2">
      <button
        @click="toggleLike"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium w-full justify-center',
          liked
            ? 'text-blue-600 hover:bg-blue-50'
            : 'text-gray-500 hover:bg-gray-100',
        ]"
      >
        <i class="fa fa-thumbs-up text-lg"></i>
        {{ liked ? "Liked" : "Like" }}
      </button>
      <button
        @click="toggleComments"
        class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
      >
        <i class="fa fa-comment text-lg"></i>
        Comment
      </button>
      <button
        class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
      >
        <i class="fa fa-share text-lg"></i>
        Share
      </button>
    </div>

    <!-- Comments Section -->
    <div
      v-if="showComments"
      class="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3"
    >
      <!-- Existing comments -->
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex items-start gap-2"
      >
        <div
          class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <i class="fa fa-user text-gray-500 text-xs"></i>
        </div>
        <div class="bg-gray-100 rounded-2xl px-3 py-2 flex-1">
          <p class="text-xs font-semibold text-gray-800">{{ comment.name }}</p>
          <p class="text-sm text-gray-700">{{ comment.text }}</p>
        </div>
      </div>

      <!-- Comment Input -->
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <i class="fa fa-user text-gray-500 text-xs"></i>
        </div>
        <div
          class="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2"
        >
          <input
            v-model="commentText"
            type="text"
            placeholder="Write a comment..."
            class="bg-transparent text-sm focus:outline-none flex-1"
            @keyup.enter="submitComment"
          />
          <button
            @click="submitComment"
            class="text-blue-500 hover:text-blue-600"
          >
            <i class="fa fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

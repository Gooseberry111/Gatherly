<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";

const props = defineProps({
  post: Object,
});

const emit = defineEmits(["deletePost"]);

const liked = ref(false);
const likeCount = ref(props.post.likes_count || 0);
const showComments = ref(false);
const commentText = ref("");
const comments = ref([]);
const commentsCount = ref(props.post.comments_count || 0);

onMounted(async () => {
  if (currentUser.value) {
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", props.post.id)
      .eq("user_id", currentUser.value.id)
      .single();
    liked.value = !!data;
  }
});

const loadComments = async () => {
  const { data } = await supabase
    .from("comments")
    .select("*, profiles(full_name, avatar_url)")
    .eq("post_id", props.post.id)
    .order("created_at", { ascending: true });

  if (data) comments.value = data;
};

const toggleLike = async () => {
  if (!currentUser.value) return;
  if (liked.value) {
    await supabase
      .from("likes")
      .delete()
      .eq("post_id", props.post.id)
      .eq("user_id", currentUser.value.id);
    liked.value = false;
    likeCount.value--;
  } else {
    await supabase
      .from("likes")
      .insert({ post_id: props.post.id, user_id: currentUser.value.id });
    liked.value = true;
    likeCount.value++;
  }
};

const toggleComments = async () => {
  showComments.value = !showComments.value;
  if (showComments.value && comments.value.length === 0) {
    await loadComments();
  }
};

const submitComment = async () => {
  if (!commentText.value.trim() || !currentUser.value) return;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: props.post.id,
      user_id: currentUser.value.id,
      content: commentText.value.trim(),
    })
    .select("*, profiles(full_name, avatar_url)")
    .single();

  if (!error && data) {
    comments.value.push(data);
    commentsCount.value++;
    commentText.value = "";
  }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow space-y-3">
    <!-- Post Header -->
    <div class="flex items-center justify-between px-4 pt-4">
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
            {{ post.profiles?.full_name || post.name }}
          </p>
          <p class="text-xs text-gray-400">
            {{ new Date(post.created_at).toLocaleDateString() }} ·
            <i class="fa fa-globe-americas"></i>
          </p>
        </div>
      </div>
      <button
        class="text-gray-400 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
      >
        <i class="fa fa-ellipsis-h"></i>
      </button>
    </div>

    <!-- Post Content -->
    <p v-if="post.content" class="text-sm text-gray-800 leading-relaxed px-4">
      {{ post.content }}
    </p>

    <!-- Post Image -->
    <img
      v-if="post.image_url || post.image"
      :src="post.image_url || post.image"
      class="w-full object-contain"
    />

    <!-- Post Video -->
    <video
      v-if="post.video_url || post.video"
      :src="post.video_url || post.video"
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
        {{ commentsCount }} comments · {{ post.shares || 0 }} shares
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
      <!-- Comments list -->
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex items-start gap-2"
      >
        <div
          class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-300"
        >
          <img
            v-if="comment.profiles?.avatar_url"
            :src="comment.profiles.avatar_url"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="fa fa-user text-gray-400 text-xs"></i>
          </div>
        </div>
        <div class="bg-gray-100 rounded-2xl px-3 py-2 flex-1">
          <p class="text-xs font-semibold text-gray-800">
            {{ comment.profiles?.full_name || "User" }}
          </p>
          <p class="text-sm text-gray-700">{{ comment.content }}</p>
        </div>
      </div>

      <!-- Comment Input -->
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-300 flex items-center justify-center"
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

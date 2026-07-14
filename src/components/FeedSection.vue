<script setup>
import { ref, onMounted } from "vue";
import CreatePost from "./CreatePost.vue";
import PostCard from "./PostCard.vue";
import StoryBar from "./StoryBar.vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";

const posts = ref([]);

const loadPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (!error) {
    posts.value = data;
  } else {
    console.error(error);
  }
};

const handleNewPost = (post) => {
  posts.value.unshift(post);
};

const handleDeletePost = async (postId) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    alert(error.message);
    return;
  }

  posts.value = posts.value.filter((post) => post.id !== postId);
};

onMounted(loadPosts);
</script>

<template>
  <div class="sm:py-4 sm:space-y-4">
    <CreatePost @newPost="handleNewPost" />
    <StoryBar />

    <div>
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :current-user-id="currentUser?.id"
        @delete-post="handleDeletePost"
      />
    </div>
  </div>
</template>

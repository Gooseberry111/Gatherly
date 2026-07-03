<script setup>
import { ref, onMounted } from "vue";
import CreatePost from "./CreatePost.vue";
import PostCard from "./PostCard.vue";
import StoryBar from "./StoryBar.vue";
import { supabase } from "../lib/supabase";

const posts = ref([]);

const loadPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });
  if (!error) posts.value = data;
};

const handleNewPost = (post) => {
  posts.value.unshift(post);
};

onMounted(loadPosts);
</script>

<template>
  <div class="py-4 space-y-4">
    <CreatePost @newPost="handleNewPost" />
    <StoryBar />
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

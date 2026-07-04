<script setup>
import { ref, onMounted } from "vue";
import CreatePost from "./CreatePost.vue";
import PostCard from "./PostCard.vue";
import StoryBar from "./StoryBar.vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";
import { useFriends } from "../composables/useFriends.js";

const { getFriends, friends } = useFriends();
const posts = ref([]);

const loadPosts = async () => {
  await getFriends();

  const friendIds = friends.value.map((f) => f.id);
  friendIds.push(currentUser.value.id); // include own posts

  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(full_name, avatar_url)")
    .in("user_id", friendIds)
    .order("created_at", { ascending: false });

  if (!error) posts.value = data;
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
  <div class="py-4 space-y-4">
    <CreatePost @newPost="handleNewPost" />
    <StoryBar />
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      :current-user-id="currentUser?.id"
      @delete-post="handleDeletePost"
    />
  </div>
</template>

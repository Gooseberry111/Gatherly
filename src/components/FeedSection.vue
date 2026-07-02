<script setup>
import CreatePost from "./CreatePost.vue";
import PostCard from "./PostCard.vue";
import StoryBar from "./StoryBar.vue";
import karissa from "../assets/videos/karissa.mp4";
import maryann from "../assets/images/maryann.jpeg";
import dorcas from "../assets/images/dorcas.jpeg";
import faith from "../assets/images/faith.jpeg";
import mercy from "../assets/images/mercy.jpeg";
import joel from "../assets/images/joel.jpeg";
import tony from "../assets/images/tony.jpeg";
import jill from "../assets/images/jill.jpeg";
import christmas from "../assets/images/christmas.jpeg";
import evolve1 from "../assets/images/evolve1.jpeg";
import evolve2 from "../assets/images/evolve2.jpeg";
import evolve from "../assets/images/evolve.jpeg";
import grad from "../assets/images/grad.jpeg";
import me from "../assets/images/me.jpeg";
import peace from "../assets/images/peace.jpeg";
import ijeoma from "../assets/images/ijeoma.jpeg";
import chidera from "../assets/images/chidera.jpeg";

const posts = [
  {
    id: 1,
    name: "Joel",
    time: "2 mins ago",
    content:
      "Happy birthday to mmy girl. I wish you the very very very best my darling.",
    likes: 24,
    comments: 5,
    shares: 2,
    avatar: joel,
    image: jill,
  },
  {
    id: 2,
    name: "faith",
    time: "15 mins ago",
    content: "Congratulations on your big day Ella. You have earned this!!!",
    likes: 120,
    comments: 12,
    shares: 4,
    avatar: faith,
    image: grad,
  },
  {
    id: 3,
    name: "MaryAnne",
    time: "1 hour ago",
    content:
      "Merry Christmas everyone. Make sure you take yourself and family to church because Jesus is the reason for the season",
    likes: 207,
    comments: 20,
    shares: 1208,
    avatar: maryann,
    image: tony,
  },
  {
    id: 4,
    name: "Emmanuella",
    time: "Just now",
    content: "",
    likes: 0,
    comments: 0,
    shares: 0,
    avatar: null,
    image: null,
    video: karissa,
  },
  {
    id: 5,
    name: "Tony",
    time: "Just now",
    content:
      "I was present at EVOLVE HER ESSENCE AND WELLNESS FOUNDATION'S outreach and it was so nice empowering those young women with not just pads but knowledge",
    likes: 0,
    comments: 0,
    shares: 0,
    avatar: tony,
    image: evolve,
  },
  {
    id: 6,
    name: "Chidera",
    time: "Just now",
    content: "Every girl child matters. You matter!!!!!!!!",
    likes: 0,
    comments: 0,
    shares: 0,
    avatar: chidera,
    image: evolve1,
  },
  {
    id: 7,
    name: "Faith",
    time: "Just now",
    content: "#evolveher #girlchild #iamenough",
    likes: 0,
    comments: 0,
    shares: 0,
    avatar: faith,
    image: evolve2,
  },
  {
    id: 8,
    name: "Dorcas",
    time: "2 days ago",
    content: "I am grateful for life and family. ",
    likes: 102,
    comments: 40,
    shares: 24,
    avatar: dorcas,
    image: peace,
  },
  {
    id: 9,
    name: "Mercy",
    time: "3 days ago",
    content:
      "Congratulations to me. MSN...RN. I am entirely grateful to God and my family as well for their support, love and prayers all through this journey. This degree goes to my dad. Wherever he is, I hope he is smiling down at me. ",
    likes: 102,
    comments: 40,
    shares: 24,
    avatar: mercy,
    image: ijeoma,
  },
];
</script>

<template>
  <div class="py-4 space-y-4">
    <CreatePost />
    <StoryBar />
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

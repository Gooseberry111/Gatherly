<script setup>
import logo from "../assets/Gatherly.png";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";

const email = ref("");
const password = ref("");

const router = useRouter();

const login = async () => {
  console.log("Trying login:", email.value);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  console.log("Data:", data);
  console.log("Error:", error);

  if (error) {
    alert(error.message);
    return;
  }

  router.push("/home");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
      <!-- Left Side -->
      <div>
        <h1 class="text-6xl font-bold text-blue-600 mb-4">
          <img
            :src="logo"
            alt="G"
            class="w-19 h-19 inline-block align-middle"
          />atherly
        </h1>

        <p class="text-2xl text-gray-700 mt-4">Connect. Share. Belong.</p>
      </div>

      <!-- Right Side -->

      <div class="bg-white p-8 rounded-3xl shadow-xl">
        <p class="text-2xl font-semibold mb-6 opacity-95">Log into Gatherly</p>

        <form @submit.prevent="login" class="space-y-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email address"
            class="w-full shadow-sm border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full shadow-sm border-gray-200 border rounded-2xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-3xl"
          >
            Log In
          </button>

          <div class="text-center">
            <button
              type="button"
              class="w-full text-opacity-80 bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-3xl"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="button"
            @click="router.push('/signup')"
            class="w-full mt-10 border bg-white hover:bg-gray-200 text-blue-500 font-semibold py-3 rounded-3xl"
          >
            Create New Account
          </button>
        </form>
      </div>
    </div>
  </div>
  <footer class="mt-12 border-t border-gray-200 pt-6 pb-8">
    <div class="max-w-6xl mx-auto px-4 text-sm text-gray-500">
      <!-- Languages -->
      <div class="flex flex-wrap gap-x-4 gap-y-2">
        <button class="hover:underline">English (US)</button>
        <button class="hover:underline">Hausa</button>
        <button class="hover:underline">Français (France)</button>
        <button class="hover:underline">Português (Brasil)</button>
        <button class="hover:underline">Español</button>
        <button class="hover:underline">العربية</button>
        <button class="hover:underline">Bahasa Indonesia</button>
        <button class="hover:underline font-medium">More languages...</button>
      </div>

      <hr class="my-4 border-gray-200" />

      <!-- Links -->
      <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <button class="hover:underline">Sign Up</button>
        <button class="hover:underline">Log In</button>
        <button class="hover:underline">Messenger</button>
        <button class="hover:underline">Gatherly Lite</button>
        <button class="hover:underline">Video</button>
        <button class="hover:underline">Pay</button>
        <button class="hover:underline">Store</button>
        <button class="hover:underline">AI</button>
        <button class="hover:underline">Instagram</button>
        <button class="hover:underline">Threads</button>
        <button class="hover:underline">Privacy Policy</button>
        <button class="hover:underline">Privacy Center</button>
        <button class="hover:underline">About</button>
        <button class="hover:underline">Create Ad</button>
        <button class="hover:underline">Create Page</button>
        <button class="hover:underline">Developers</button>
        <button class="hover:underline">Careers</button>
        <button class="hover:underline">Cookies</button>
        <button class="hover:underline">Ad Choices</button>
        <button class="hover:underline">Terms</button>
        <button class="hover:underline">Help</button>
        <button class="hover:underline">Contact</button>
      </div>

      <!-- Copyright -->
      <p class="mt-6 text-xs text-gray-400">Gatherly © 2026</p>
    </div>
  </footer>
</template>

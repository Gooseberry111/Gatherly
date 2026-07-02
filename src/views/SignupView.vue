<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/superbase";

const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const gender = ref("");

const signUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Account created successfully!");
  router.push("/");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Form -->
    <div class="flex-1 flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md space-y-5">
        <button
          type="button"
          @click="router.push('/')"
          class="text-gray-500 hover:text-black text-2xl font-light mb-4 flex items-center gap-1"
        >
          &#8592;
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Get started on Gatherly
          </h1>
          <p class="text-black text-sm mt-1">
            Create an account to connect with friends, family and communities of
            people who share your interests.
          </p>
        </div>

        <!-- Name -->
        <div>
          <p class="text-lg text-black mb-2">Name</p>
          <div class="flex gap-3">
            <input
              v-model="firstName"
              type="text"
              placeholder="First name"
              class="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <input
              v-model="lastName"
              type="text"
              placeholder="Last name"
              class="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <!-- Birthday -->
        <div>
          <p class="text-lg text-black mb-2">Birthday</p>
          <div class="flex gap-3">
            <select
              class="w-1/3 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-600"
            >
              <option disabled selected>Day</option>
              <option v-for="d in 31" :key="d">{{ d }}</option>
            </select>
            <select
              class="w-1/3 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-600"
            >
              <option disabled selected>Month</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
            <select
              class="w-1/3 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-600"
            >
              <option disabled selected>Year</option>
              <option v-for="y in 100" :key="y">{{ 2025 - y + 1 }}</option>
            </select>
          </div>
        </div>

        <!-- Gender -->
        <div>
          <p class="text-lg text-black mb-2">Gender</p>
          <select
            v-model="gender"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-600"
          >
            <option disabled selected>Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Custom</option>
          </select>
        </div>

        <!-- Mobile or Email -->
        <div>
          <p class="text-lg text-black mb-2">Mobile number or email</p>
          <input
            v-model="email"
            type="text"
            placeholder="Mobile number or email"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <p class="text-xs text-gray-400 mt-1">
            You may receive notifications from us.
          </p>
        </div>

        <!-- Password -->
        <div>
          <p class="text-lg text-black mb-2">Password</p>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <p class="text-xs text-gray-400 mt-1">
            People who use our service may have uploaded your contact
            information to Gatherly.
          </p>
        </div>

        <!-- Terms -->
        <p class="text-xs text-gray-400 leading-relaxed">
          By tapping <span class="font-semibold">Submit</span>, you agree to
          Gatherly's
          <span class="text-blue-500 cursor-pointer hover:underline">Terms</span
          >,
          <span class="text-blue-500 cursor-pointer hover:underline"
            >Privacy Policy</span
          >
          and
          <span class="text-blue-500 cursor-pointer hover:underline"
            >Cookies Policy</span
          >.
        </p>

        <!-- Submit -->
        <button
          type="button"
          @click="signUp"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-3xl"
        >
          Submit
        </button>

        <!-- Already have account -->
        <button
          type="button"
          @click="router.push('/')"
          class="w-full border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-3 rounded-3xl"
        >
          Already have an account? Log in
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-gray-200 pt-6 pb-8">
      <div class="max-w-3xl mx-auto px-4 text-sm text-gray-500">
        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <button class="hover:underline font-medium">English (US)</button>
          <button class="hover:underline">Hausa</button>
          <button class="hover:underline">Français (France)</button>
          <button class="hover:underline">Português (Brasil)</button>
          <button class="hover:underline">Español</button>
          <button class="hover:underline">العربية</button>
          <button class="hover:underline">Bahasa Indonesia</button>
          <button class="hover:underline">More languages…</button>
        </div>
        <hr class="my-4 border-gray-200" />
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
        <p class="mt-6 text-xs text-gray-400">Gatherly © 2026</p>
      </div>
    </footer>
  </div>
</template>

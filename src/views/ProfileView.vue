<script setup>
import { ref, onMounted } from "vue";
import NavBar from "../components/NavBar.vue";
import BottomNav from "../components/BottomNav.vue";
import { supabase } from "../lib/supabase";
import { currentUser, userProfile } from "../store/auth";
import { useProfile } from "../composables/useProfile";
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

const { updateProfile, uploadAvatar, uploadCover } = useProfile();

const activeTab = ref("posts");
const tabs = ["Posts", "About", "Friends", "Photos", "Videos", "Reels"];
const isEditing = ref(false);

const fullName = ref("");
const bio = ref("");
const location = ref("");
const workplace = ref("");
const school = ref("");
const avatarUrl = ref(null);
const coverUrl = ref(null);

const photos = [christmas, grad, peace, ijeoma, chidera, me];

const friends = [];

const posts = ref([]);

onMounted(async () => {
  // Load profile data
  if (userProfile.value) {
    fullName.value = userProfile.value.full_name || "";
    bio.value = userProfile.value.bio || "";
    location.value = userProfile.value.location || "";
    workplace.value = userProfile.value.workplace || "";
    school.value = userProfile.value.school || "";
    avatarUrl.value = userProfile.value.avatar_url || null;
    coverUrl.value = userProfile.value.cover_url || null;
  }

  // Load posts
  if (currentUser.value) {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", currentUser.value.id)
      .order("created_at", { ascending: false });
    if (data) posts.value = data;
  }
});

const onAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = await uploadAvatar(currentUser.value.id, file);
  if (url) {
    avatarUrl.value = url;
    await updateProfile(currentUser.value.id, { avatar_url: url });
  }
};

const onCoverChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = await uploadCover(currentUser.value.id, file);
  if (url) {
    coverUrl.value = url;
    await updateProfile(currentUser.value.id, { cover_url: url });
  }
};

const saveProfile = async () => {
  await updateProfile(currentUser.value.id, {
    full_name: fullName.value,
    bio: bio.value,
    location: location.value,
    workplace: workplace.value,
    school: school.value,
  });
  isEditing.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />

    <div class="pt-14 pb-16">
      <div class="mx-auto max-w-4xl">
        <!-- Cover Photo -->
        <div
          class="relative h-40 sm:h-72 bg-gray-200"
          style="box-shadow: inset 0 -100px 70px -20px rgba(128, 128, 128, 0.6)"
        >
          <img
            v-if="coverUrl"
            :src="coverUrl"
            class="w-full h-full object-cover"
          />
          <label
            class="absolute bottom-4 right-4 bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow cursor-pointer"
          >
            <i class="fa fa-camera"></i> Add cover photo
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="onCoverChange"
            />
          </label>
        </div>

        <!-- Mobile Profile Layout -->
        <div class="sm:hidden bg-white px-4 pb-4">
          <div class="flex items-end justify-between -mt-16 mb-3">
            <div class="relative">
              <div
                class="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-300"
              >
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <i class="fa fa-user text-5xl text-gray-400"></i>
                </div>
              </div>
              <label
                class="absolute bottom-1 right-1 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow"
              >
                <i class="fa fa-camera text-gray-600 text-sm"></i>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onAvatarChange"
                />
              </label>
            </div>
          </div>

          <h1 class="text-2xl font-bold text-gray-900">
            {{ fullName || "Your Name" }}
          </h1>
          <p class="text-gray-500 text-sm mt-1">
            <span class="font-bold text-gray-800">500</span> friends
          </p>
          <p class="text-gray-700 text-sm mt-1">{{ bio }}</p>

          <div class="flex items-center gap-2 mt-3">
            <button
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <i class="fa fa-plus"></i> Add to story
            </button>
            <button
              @click="isEditing = true"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <i class="fa fa-edit"></i> Edit profile
            </button>
            <button
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-3 py-2 rounded-lg text-sm"
            >
              <i class="fa fa-ellipsis-h"></i>
            </button>
          </div>

          <div
            class="flex items-center gap-2 mt-4 border-b border-gray-200 overflow-x-auto"
          >
            <button
              v-for="tab in ['Posts', 'Photos', 'Reels']"
              :key="tab"
              @click="activeTab = tab.toLowerCase()"
              :class="[
                'px-4 py-2 font-medium text-sm whitespace-nowrap flex-shrink-0',
                activeTab === tab.toLowerCase()
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500',
              ]"
            >
              {{ tab }}
            </button>
          </div>
        </div>

        <!-- Desktop Profile Layout -->
        <div class="hidden sm:block bg-white shadow px-10 pt-4 pb-4">
          <div class="flex items-end justify-between">
            <div class="flex items-end gap-4">
              <div class="-mt-16 relative z-10 flex-shrink-0">
                <div
                  class="w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-gray-300"
                >
                  <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <i class="fa fa-user text-6xl text-gray-400"></i>
                  </div>
                </div>
                <label
                  class="absolute bottom-1 right-1 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow"
                >
                  <i class="fa fa-camera text-gray-600 text-sm"></i>
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onAvatarChange"
                  />
                </label>
              </div>
              <div class="pb-2">
                <h1 class="text-3xl font-bold text-gray-900">
                  {{ fullName || "Your Name" }}
                </h1>
                <p class="text-gray-500 text-sm mt-1">500 friends</p>
                <p class="text-gray-600 text-sm mt-1">{{ bio }}</p>
                <div class="flex items-center mt-2">
                  <img
                    v-for="(f, i) in friends.slice(0, 6)"
                    :key="i"
                    :src="f.img"
                    class="w-8 h-8 rounded-full border-2 border-white object-cover -ml-2 first:ml-0"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 pb-2">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <i class="fa fa-plus"></i> Add to story
              </button>
              <button
                @click="isEditing = true"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <i class="fa fa-edit"></i> Edit profile
              </button>
              <button
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm"
              >
                <i class="fa fa-chevron-down"></i>
              </button>
            </div>
          </div>

          <div
            class="flex items-center gap-2 mt-4 border-t border-gray-200 pt-2"
          >
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab.toLowerCase()"
              :class="[
                'px-4 py-2 rounded-lg font-medium text-sm transition',
                activeTab === tab.toLowerCase()
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:bg-gray-100',
              ]"
            >
              {{ tab }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Content -->
      <div class="sm:hidden px-4 mt-4 space-y-4">
        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="text-lg font-bold text-gray-800 mb-3">Details</h2>
          <ul class="space-y-3 text-sm text-gray-600">
            <li v-if="location" class="flex items-center gap-2">
              <i class="fa fa-home text-gray-400 w-4"></i>
              Lives in
              <span class="font-bold ml-1 text-gray-900">{{ location }}</span>
            </li>
            <li v-if="workplace" class="flex items-center gap-2">
              <i class="fa fa-briefcase text-gray-400 w-4"></i>
              Works at
              <span class="font-bold ml-1 text-gray-900">{{ workplace }}</span>
            </li>
            <li v-if="school" class="flex items-center gap-2">
              <i class="fa fa-graduation-cap text-gray-400 w-4"></i>
              Studied at
              <span class="font-bold ml-1 text-gray-900">{{ school }}</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa fa-ellipsis-h text-gray-400 w-4"></i>
              See Your About Info
            </li>
          </ul>
          <button
            @click="isEditing = true"
            class="mt-4 w-full bg-blue-50 text-blue-600 font-medium py-2 rounded-lg text-sm"
          >
            Edit public details
          </button>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-lg font-bold text-gray-800">Friends</h2>
              <p class="text-sm text-gray-500">500 friends</p>
            </div>
            <button class="text-blue-600 text-sm hover:underline">
              Find friends
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="friend in friends.slice(0, 6)"
              :key="friend.name"
              class="flex flex-col items-center gap-1"
            >
              <div class="w-full aspect-square rounded-lg overflow-hidden">
                <img :src="friend.img" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs text-gray-600 font-medium text-center">{{
                friend.name
              }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gray-300 flex items-center justify-center"
              >
                <i class="fa fa-user text-gray-500"></i>
              </div>
            </div>
            <button
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm text-left px-4 py-3 rounded-full"
            >
              What's on your mind, {{ fullName || "you" }}?
            </button>
          </div>
        </div>

        <div
          v-for="post in posts"
          :key="post.id"
          class="bg-white rounded-xl shadow space-y-3"
        >
          <div class="flex items-center justify-between px-4 pt-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
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
                  {{ fullName || "You" }}
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
          <p class="text-sm text-gray-800 px-4">{{ post.content }}</p>
          <img
            v-if="post.image_url"
            :src="post.image_url"
            class="w-full object-contain"
          />
          <div
            class="flex items-center justify-between text-xs text-gray-400 border-b border-gray-200 pb-2 px-4"
          >
            <span
              ><i class="fa fa-thumbs-up text-blue-500"></i>
              {{ post.likes_count || 0 }}</span
            >
            <span>{{ post.comments_count || 0 }} comments</span>
          </div>
          <div class="flex items-center justify-around pb-2 px-2">
            <button
              class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
            >
              <i class="fa fa-thumbs-up text-lg"></i> Like
            </button>
            <button
              class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
            >
              <i class="fa fa-comment text-lg"></i> Comment
            </button>
            <button
              class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
            >
              <i class="fa fa-share text-lg"></i> Share
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Content -->
      <div
        class="hidden sm:grid max-w-4xl mx-auto mt-4 grid-cols-12 gap-4 px-4"
      >
        <div class="col-span-4 space-y-4">
          <div class="bg-white rounded-xl shadow p-4">
            <h2 class="text-lg font-bold text-gray-800 mb-3">Intro</h2>
            <ul class="space-y-3 text-sm text-gray-600">
              <li v-if="workplace" class="flex items-center gap-2">
                <i class="fa fa-briefcase text-gray-400 w-4"></i>
                Works at <span class="font-medium ml-1">{{ workplace }}</span>
              </li>
              <li v-if="school" class="flex items-center gap-2">
                <i class="fa fa-graduation-cap text-gray-400 w-4"></i>
                Studied at <span class="font-medium ml-1">{{ school }}</span>
              </li>
              <li v-if="location" class="flex items-center gap-2">
                <i class="fa fa-map-marker text-gray-400 w-4"></i>
                Lives in <span class="font-medium ml-1">{{ location }}</span>
              </li>
            </ul>
            <button
              @click="isEditing = true"
              class="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-sm"
            >
              Edit details
            </button>
          </div>

          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-bold text-gray-800">Photos</h2>
              <button class="text-blue-600 text-sm hover:underline">
                See all photos
              </button>
            </div>
            <div class="grid grid-cols-3 gap-1">
              <div
                v-for="(photo, i) in photos"
                :key="i"
                class="aspect-square rounded-lg overflow-hidden"
              >
                <img :src="photo" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-bold text-gray-800">Friends</h2>
              <button class="text-blue-600 text-sm hover:underline">
                See all friends
              </button>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="friend in friends"
                :key="friend.name"
                class="flex flex-col items-center gap-1"
              >
                <div class="w-full aspect-square rounded-lg overflow-hidden">
                  <img :src="friend.img" class="w-full h-full object-cover" />
                </div>
                <span class="text-xs text-gray-600 font-medium text-center">{{
                  friend.name
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-8 space-y-4">
          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gray-300 flex items-center justify-center"
                >
                  <i class="fa fa-user text-gray-500"></i>
                </div>
              </div>
              <button
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm text-left px-4 py-3 rounded-full"
              >
                What's on your mind, {{ fullName || "you" }}?
              </button>
            </div>
          </div>

          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white rounded-xl shadow space-y-3"
          >
            <div class="flex items-center justify-between px-4 pt-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
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
                    {{ fullName || "You" }}
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
            <p class="text-sm text-gray-800 px-4">{{ post.content }}</p>
            <img
              v-if="post.image_url"
              :src="post.image_url"
              class="w-full object-contain"
            />
            <div
              class="flex items-center justify-between text-xs text-gray-400 border-b border-gray-200 pb-2 px-4"
            >
              <span
                ><i class="fa fa-thumbs-up text-blue-500"></i>
                {{ post.likes_count || 0 }}</span
              >
              <span>{{ post.comments_count || 0 }} comments</span>
            </div>
            <div class="flex items-center justify-around pb-2 px-2">
              <button
                class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
              >
                <i class="fa fa-thumbs-up text-lg"></i> Like
              </button>
              <button
                class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
              >
                <i class="fa fa-comment text-lg"></i> Comment
              </button>
              <button
                class="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-xl text-gray-500 text-sm font-medium w-full justify-center"
              >
                <i class="fa fa-share text-lg"></i> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <Transition name="fade">
      <div
        v-if="isEditing"
        class="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4"
        @click.self="isEditing = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
          >
            <h2 class="text-lg font-bold text-gray-800">Edit profile</h2>
            <button
              @click="isEditing = false"
              class="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
            >
              <i class="fa fa-times text-gray-600"></i>
            </button>
          </div>

          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Full name</label>
              <input
                v-model="fullName"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                v-model="bio"
                class="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Location</label>
              <input
                v-model="location"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Workplace</label>
              <input
                v-model="workplace"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">School</label>
              <input
                v-model="school"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="px-6 pb-6">
            <button
              @click="saveProfile"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-sm"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <BottomNav />
  </div>
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

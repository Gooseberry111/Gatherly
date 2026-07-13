import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { refreshProfile } from "../store/auth";

export const useProfile = () => {
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const getProfile = async (userId) => {
    loading.value = true;
    const { data, error: err } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (err) error.value = err.message;
    else profile.value = data;
    loading.value = false;
  };

  const updateProfile = async (userId, updates) => {
    loading.value = true;
    const { error: err } = await supabase
      .from("profiles")
      .upsert({ id: userId, ...updates });

    if (err) {
      error.value = err.message;
    } else {
      await getProfile(userId);
      await refreshProfile();
    }
    loading.value = false;
  };

  const uploadAvatar = async (userId, file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const { error: err } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (err) {
      error.value = err.message;
      return null;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return data.publicUrl;
  };

  const uploadCover = async (userId, file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const { error: err } = await supabase.storage
      .from("covers")
      .upload(fileName, file, { upsert: true });

    if (err) {
      error.value = err.message;
      return null;
    }

    const { data } = supabase.storage.from("covers").getPublicUrl(fileName);

    return data.publicUrl;
  };

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadCover,
  };
};

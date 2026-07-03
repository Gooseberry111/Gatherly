import { ref } from "vue";
import { supabase } from "../lib/supabase";

export const currentUser = ref(null);
export const userProfile = ref(null);

export const initAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  currentUser.value = session?.user ?? null;

  if (currentUser.value) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.value.id)
      .single();
    userProfile.value = data;
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    currentUser.value = session?.user ?? null;

    if (currentUser.value) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.value.id)
        .single();
      userProfile.value = data;
    } else {
      userProfile.value = null;
    }
  });
};

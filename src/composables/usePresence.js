import { ref, watch, onMounted, onUnmounted } from "vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";

// Shared across all components that use this composable
const onlineUserIds = ref(new Set());
let channel = null;
let refCount = 0;
let stopWatcher = null;

const setupChannel = () => {
  if (channel) return;

  channel = supabase.channel("online-users");

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      onlineUserIds.value = new Set(Object.keys(state));
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED" && currentUser.value) {
        await channel.track({
          user_id: currentUser.value.id,
          online_at: new Date().toISOString(),
        });
      }
    });

  // Handles the case where currentUser resolves AFTER the channel subscribes
  stopWatcher = watch(currentUser, async (user) => {
    if (user && channel) {
      await channel.track({
        user_id: user.id,
        online_at: new Date().toISOString(),
      });
    }
  });
};

const teardownChannel = () => {
  if (stopWatcher) {
    stopWatcher();
    stopWatcher = null;
  }
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
};

export const usePresence = () => {
  onMounted(() => {
    refCount++;
    setupChannel();
  });

  onUnmounted(() => {
    refCount--;
    if (refCount <= 0) {
      teardownChannel();
    }
  });

  return { onlineUserIds };
};

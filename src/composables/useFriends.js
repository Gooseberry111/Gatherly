import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { currentUser } from "../store/auth";

export const useFriends = () => {
  const friends = ref([]);
  const pendingRequests = ref([]);
  const sentRequests = ref([]);
  const loading = ref(false);

  // Get all accepted friends
  const getFriends = async () => {
    loading.value = true;
    const { data } = await supabase
      .from("friends")
      .select(
        `
        *,
        sender:sender_id(id, full_name, avatar_url),
        receiver:receiver_id(id, full_name, avatar_url)
      `,
      )
      .or(
        `sender_id.eq.${currentUser.value.id},receiver_id.eq.${currentUser.value.id}`,
      )
      .eq("status", "accepted");

    if (data) {
      friends.value = data.map((f) => {
        return f.sender_id === currentUser.value.id ? f.receiver : f.sender;
      });
    }
    loading.value = false;
  };

  // Get pending requests sent TO me
  const getPendingRequests = async () => {
    const { data } = await supabase
      .from("friends")
      .select(
        `
        *,
        sender:sender_id(id, full_name, avatar_url)
      `,
      )
      .eq("receiver_id", currentUser.value.id)
      .eq("status", "pending");

    if (data) pendingRequests.value = data;
  };

  // Get requests I have sent
  const getSentRequests = async () => {
    const { data } = await supabase
      .from("friends")
      .select("*")
      .eq("sender_id", currentUser.value.id)
      .eq("status", "pending");

    if (data) sentRequests.value = data;
  };

  // Send a friend request
  const sendFriendRequest = async (receiverId) => {
    const { error } = await supabase
      .from("friends")
      .insert({ sender_id: currentUser.value.id, receiver_id: receiverId })
      .select();

    if (!error) await getSentRequests();
    return { error };
  };

  // Accept a friend request
  const acceptFriendRequest = async (requestId) => {
    const { error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (!error) {
      await getPendingRequests();
      await getFriends();
    }
    return { error };
  };

  // Decline a friend request
  const declineFriendRequest = async (requestId) => {
    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("id", requestId);

    if (!error) await getPendingRequests();
    return { error };
  };

  // Remove a friend
  const removeFriend = async (friendId) => {
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(
        `and(sender_id.eq.${currentUser.value.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${currentUser.value.id})`,
      );

    if (!error) await getFriends();
    return { error };
  };

  // Check relationship status with a user
  const getFriendStatus = async (userId) => {
    const { data } = await supabase
      .from("friends")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.value.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.value.id})`,
      )
      .single();

    return data;
  };

  // Search users by name
  const searchUsers = async (query) => {
    if (!query.trim()) return [];
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .ilike("full_name", `%${query}%`)
      .neq("id", currentUser.value.id)
      .limit(10);

    return data || [];
  };

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    getFriends,
    getPendingRequests,
    getSentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    getFriendStatus,
    searchUsers,
  };
};

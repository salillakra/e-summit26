"use server";

import { createClient } from "@/lib/supabase/server";
import { ChatMessage } from "@/hooks/use-realtime-chat";

export interface DbChatMessage {
  id: string;
  room_name: string;
  user_id: string;
  user_name: string;
  user_role: string | null;
  user_avatar: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch messages from the database with pagination
 */
export async function fetchMessages(
  roomName: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact" })
    .eq("room_name", roomName)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching messages:", error);
    return { messages: [], hasMore: false };
  }

  const messages: ChatMessage[] = (data || []).map((msg: DbChatMessage) => ({
    id: msg.id,
    content: msg.content,
    user: {
      id: msg.user_id,
      name: msg.user_name,
      role: msg.user_role || undefined,
      avatar: msg.user_avatar || undefined,
    },
    createdAt: msg.created_at,
  }));

  // Reverse to show oldest first
  messages.reverse();

  const hasMore = count ? offset + limit < count : false;

  return { messages, hasMore };
}

/**
 * Store a single message in the database
 */
export async function storeMessage(
  roomName: string,
  message: ChatMessage,
  userId: string,
  userAvatar?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("chat_messages").insert({
    room_name: roomName,
    user_id: userId,
    user_name: message.user.name,
    user_role: message.user.role,
    user_avatar: userAvatar,
    content: message.content,
    created_at: message.createdAt,
  });

  if (error) {
    console.error("Error storing message:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Store multiple messages in the database (batch insert)
 */
export async function storeMessages(
  roomName: string,
  messages: ChatMessage[],
  userId: string,
  userAvatar?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const messagesToInsert = messages.map((msg) => ({
    room_name: roomName,
    user_id: userId,
    user_name: msg.user.name,
    user_role: msg.user.role,
    user_avatar: userAvatar,
    content: msg.content,
    created_at: msg.createdAt,
  }));

  const { error } = await supabase.from("chat_messages").insert(messagesToInsert);

  if (error) {
    console.error("Error storing messages:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete a message
 */
export async function deleteMessage(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

"use client";

import { ChatMessageItem } from "@/components/chat/chat-message";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { storeMessage } from "@/lib/chat/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmojiGifPicker } from "@/components/chat/emoji-gif-picker";
import { format } from "date-fns";

interface RealtimeChatProps {
  roomName?: string;
  username?: string;
  userRole?: string;
  userAvatar?: string;
  userId?: string;
}

/**
 * Realtime chat component with message persistence and lazy loading
 * @param roomName - The name of the room to join. Each room is a unique chat. Defaults to "default-room"
 * @param username - The username of the user. Defaults to "Anonymous"
 * @param userRole - The role of the user (e.g., "admin", "moderator")
 * @param userAvatar - The avatar URL of the user
 * @param userId - The user ID for database operations
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomName = "default-room",
  username = "Anonymous",
  userRole,
  userAvatar,
  userId,
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const storedMessageIds = useRef(new Set<string>());
  const { toast } = useToast();
  const prevMessageCountRef = useRef(0);

  // Fetch messages from database with lazy loading
  const {
    messages: dbMessages,
    isLoading: isLoadingMessages,
    hasMore,
    loadMoreMessages,
  } = useChatMessages({ roomName });

  // Realtime subscription
  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
    userRole,
    userAvatar,
    userId,
  });

  // Group messages by date
  const groupMessagesByDate = (messages: typeof dbMessages) => {
    const groups: { date: string; messages: typeof dbMessages }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: currentDate,
          messages: []
        });
      }
      
      groups[groups.length - 1].messages.push(message);
    });

    return groups;
  };

  // Merge database messages with realtime messages
  const allMessages = useMemo(() => {
    console.log(
      "Merging messages - DB:",
      dbMessages.length,
      "Realtime:",
      realtimeMessages.length
    );
    const mergedMessages = [...dbMessages, ...realtimeMessages];
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m.id === message.id)
    );
    // Sort by creation date
    return uniqueMessages.sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  }, [dbMessages, realtimeMessages]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(allMessages);
  }, [allMessages]);

  // Request notification permission on mount
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (allMessages.length > 0) {
      scrollToBottom();
    }

    // Show notification for new messages from other users
    if (
      allMessages.length > prevMessageCountRef.current &&
      prevMessageCountRef.current > 0
    ) {
      const newMessages = allMessages.slice(prevMessageCountRef.current);
      newMessages.forEach((msg) => {
        if (msg.user.id !== userId) {
          toast({
            title: `${msg.user.name}${
              msg.user.role ? ` (${msg.user.role})` : ""
            }`,
            description:
              msg.content.length > 100
                ? msg.content.substring(0, 100) + "..."
                : msg.content,
            duration: 3000,
          });

          // Browser notification if permission granted
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(
              `${msg.user.name}${msg.user.role ? ` (${msg.user.role})` : ""}`,
              {
                body:
                  msg.content.length > 100
                    ? msg.content.substring(0, 100) + "..."
                    : msg.content,
                icon: msg.user.avatar,
              }
            );
          }
        }
      });
    }
    prevMessageCountRef.current = allMessages.length;
  }, [allMessages, scrollToBottom, userId, toast]);

  // Store ALL realtime messages in database with correct user attribution
  useEffect(() => {
    if (realtimeMessages.length > 0 && userId) {
      const latestMessage = realtimeMessages[realtimeMessages.length - 1];

      // Check if we've already stored this message
      if (storedMessageIds.current.has(latestMessage.id)) {
        return;
      }

      // Store message with the SENDER's userId (from message payload), not current user's
      storedMessageIds.current.add(latestMessage.id);
      storeMessage(
        roomName,
        latestMessage,
        latestMessage.user.id,
        latestMessage.user.avatar
      ).catch((err) => {
        console.error("Failed to store message:", err);
        // Remove from set if storage failed so we can retry
        storedMessageIds.current.delete(latestMessage.id);
      });
    }
  }, [realtimeMessages, userId, roomName]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected || isSending || !userId) return;

      setIsSending(true);
      const messageId = crypto.randomUUID();
      const messageContent = newMessage.trim();

      // Mark this message as already stored BEFORE doing anything
      // to prevent the realtime effect from storing it again
      storedMessageIds.current.add(messageId);

      try {
        // Create the message object
        const message = {
          id: messageId,
          content: messageContent,
          user: {
            id: userId,
            name: username,
            role: userRole,
            avatar: userAvatar,
          },
          createdAt: new Date().toISOString(),
        };

        // Send via broadcast with the pre-generated messageId
        await sendMessage(messageContent, messageId);

        // Store in database with sender's userId
        await storeMessage(roomName, message, userId, userAvatar).catch(
          (err) => {
            console.error("Failed to store own message:", err);
            // Remove from set if storage failed so we can retry
            storedMessageIds.current.delete(messageId);
          }
        );

        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
        // Remove from set on error
        storedMessageIds.current.delete(messageId);
      } finally {
        setIsSending(false);
      }
    },
    [
      newMessage,
      isConnected,
      sendMessage,
      isSending,
      userId,
      roomName,
      username,
      userRole,
      userAvatar,
    ]
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMessages && hasMore) {
      loadMoreMessages();
    }
  }, [isLoadingMessages, hasMore, loadMoreMessages]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  }, []);

  const handleGifSelect = useCallback(
    async (gifUrl: string) => {
      setIsSending(true);
      const messageId = crypto.randomUUID();

      // Mark this message as already stored BEFORE doing anything
      // to prevent the realtime effect from storing it again
      storedMessageIds.current.add(messageId);

      try {
        await sendMessage(`[GIF] ${gifUrl}`, messageId);

        if (userId) {
          await storeMessage(
            roomName,
            {
              id: messageId,
              content: `[GIF] ${gifUrl}`,
              user: {
                id: userId,
                name: username,
                role: userRole,
                avatar: userAvatar,
              },
              createdAt: new Date().toISOString(),
            },
            userId,
            userAvatar
          ).catch((err) => {
            console.error("Failed to store GIF message:", err);
            // Remove from set if storage failed so we can retry
            storedMessageIds.current.delete(messageId);
          });
        }
      } catch (error) {
        console.error("Failed to send GIF:", error);
        // Remove from set on error
        storedMessageIds.current.delete(messageId);
        toast({
          title: "Error",
          description: "Failed to send GIF. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSending(false);
      }
    },
    [sendMessage, roomName, userId, username, userRole, userAvatar, toast]
  );

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Connection Status */}
      {!isConnected && !isLoadingMessages && (
        <div className="flex items-center justify-center gap-2 p-2 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm">
          <Loader2 className="size-4 animate-spin" />
          <span>Connecting to chat...</span>
        </div>
      )}

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMore}
              disabled={isLoadingMessages}
            >
              {isLoadingMessages ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load older messages"
              )}
            </Button>
          </div>
        )}

        {allMessages.length === 0 && !isLoadingMessages ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : null}

        <div className="space-y-1">
          {groupedMessages.map((group, groupIndex) => (
            <div key={group.date} className="space-y-1">
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-border" />
                <span className="mx-3 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {format(new Date(group.date), 'EEEE, MMMM d, yyyy') === format(new Date(), 'EEEE, MMMM d, yyyy')
                    ? 'Today'
                    : format(new Date(group.date), 'EEEE, MMMM d, yyyy') === 
                      format(new Date(Date.now() - 86400000), 'EEEE, MMMM d, yyyy')
                    ? 'Yesterday'
                    : format(new Date(group.date), 'EEEE, MMMM d, yyyy')}
                </span>
                <div className="flex-1 border-t border-border" />
              </div>
              {group.messages.map((message, index) => {
                const prevMessage = index > 0 ? group.messages[index - 1] : null;
                let showHeader = !prevMessage || prevMessage.user.id !== message.user.id;

                if (prevMessage && prevMessage.user.id === message.user.id) {
                  const timeDiff =
                    new Date(message.createdAt).getTime() -
                    new Date(prevMessage.createdAt).getTime();
                  const fiveMinutes = 5 * 60 * 1000;
                  if (timeDiff > fiveMinutes) {
                    showHeader = true;
                  }
                }

                return (
                  <div
                    key={message.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                  >
                    <ChatMessageItem
                      message={message}
                      isOwnMessage={message.user.id === userId}
                      showHeader={showHeader}
                      currentUserId={userId}
                      onDelete={async (msgId) => {
                        const { deleteMessage } = await import(
                          "@/lib/chat/actions"
                        );
                        await deleteMessage(msgId);
                        window.location.reload();
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="flex w-full gap-2 border-t border-border p-4"
      >
        <EmojiGifPicker
          onEmojiSelect={handleEmojiSelect}
          onGifSelect={handleGifSelect}
        />
        <Input
          className="flex-1 rounded-full bg-background text-sm"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          disabled={!isConnected || isSending}
        />
        <Button
          className="aspect-square rounded-full"
          type="submit"
          disabled={!isConnected || !newMessage.trim() || isSending}
          size="icon"
        >
          {isSending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

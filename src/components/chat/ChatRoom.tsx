// components/chat/ChatRoom.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useChatStore } from "@/store/useChatStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socket = io();

type ChatRoomProps = {
  roomId: string;
  currentUser: {
    id: string;
    name: string;
    // add other properties if needed
  };
};

export default function ChatRoom({ roomId, currentUser }: ChatRoomProps) {
  const [message, setMessage] = useState("");
  const { messages, addMessage, usersTyping, setTyping, clearTyping } =
    useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("new-message", (msg) => {
      addMessage(msg);
    });

    socket.on("user-typing", (user) => {
      if (user !== currentUser.name) {
        setTyping(user);
        setTimeout(() => clearTyping(user), 3000);
      }
    });

    return () => {
      socket.off("new-message");
      socket.off("user-typing");
    };
  }, [addMessage, clearTyping, currentUser, roomId, setMessage, setTyping]);

  const handleSend = () => {
    const data = {
      content: message,
      sender: currentUser.name,
      senderId: currentUser.id,
      roomId,
    };
    socket.emit("send-message", data);
    addMessage({ ...data, createdAt: new Date() });
    setMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", { roomId, user: currentUser.name });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col space-y-2 p-4 border rounded-xl max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm ${
              msg.senderId === currentUser.id ? "text-right" : "text-left"
            }`}
          >
            <div className="font-medium">{msg.sender}</div>
            <div className="bg-gray-100 dark:bg-neutral-800 p-2 rounded-md inline-block">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="text-xs text-muted-foreground h-5">
        {usersTyping.length > 0 && (
          <span>{usersTyping.join(", ")} typing...</span>
        )}
      </div>

      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type a message"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}

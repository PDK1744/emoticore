"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, LogOut, User, Bot, Menu } from "lucide-react";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/ui/SideBar";
import { createClient } from "../../../utils/supabase/client";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI therapist. I'm here to provide a safe, non-judgmental space for you to share your thoughts and feelings. How are you doing today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<
    { id: string; title?: string; updated_at?: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleDeleteSession = async (id: string) => {
  await supabase.from("chat_sessions").delete().eq("id", id);
  setSessions((prev) => prev.filter((s) => s.id !== id));
  // If the deleted session is active, reset to new chat
  if (sessionId === id) {
    handleNewChat();
  }
};

  // Check authentication and get user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        setTimeout(async () => {
          const {
            data: { user: retryUser },
          } = await supabase.auth.getUser();
          if (!retryUser) {
            router.push("/sign-in");
          } else {
            setUser(retryUser);
          }
        }, 200);
      }
    };
    getUser();
  }, [supabase, router]);

  // Fetch sessions when user is loaded
  useEffect(() => {
    if (!user) return;
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (!error && data) setSessions(data);
    };
    fetchSessions();
  }, [user, supabase]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Start a new chat
  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your AI therapist. I'm here to provide a safe, non-judgmental space for you to share your thoughts and feelings. How are you doing today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    setSessionId(null);
    setSidebarOpen(false);
  };

  // Select a previous session and load its messages
  const handleSelectSession = async (id: string) => {
    setSessionId(id);
    setSidebarOpen(false);
    const { data, error } = await supabase
      .from("messages")
      .select("id, content, role, created_at")
      .eq("session_id", id)
      .order("created_at", { ascending: true });
    if (!error && data) {
      setMessages(
        data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          isBot: msg.role === "assistant",
          timestamp: new Date(msg.created_at),
        }))
      );
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble connecting right now. This happens when the AI service isn't configured yet. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        activeSessionId={sessionId}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:justify-end">
          {/* Sidebar open button (mobile only) */}
          <button
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          {/* Logo and title (desktop only) */}
          {/* <div className="hidden md:flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              EmotiCore AI Therapist
            </h1>
          </div> */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.isBot ? "" : "flex-row-reverse space-x-reverse"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  {message.isBot ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                    message.isBot
                      ? "bg-white text-gray-900 border border-gray-200"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.isBot ? "text-gray-500" : "text-blue-100"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                  rows={1}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex items-center justify-center w-11 h-11 rounded-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              EmotiCore AI is designed to provide emotional support. It's not a
              replacement for professional therapy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
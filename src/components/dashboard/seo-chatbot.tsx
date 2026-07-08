"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Trash2,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "How can we improve our keyword rankings?",
  "What content gaps should we prioritize?",
  "Analyze our competitor strategy",
  "Suggest SEO topics for Mediusware",
];

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) =>
      `<pre class="bg-muted rounded-md p-3 my-2 overflow-x-auto text-xs font-mono whitespace-pre-wrap"><code>${code.trim()}</code></pre>`
  );

  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>'
  );

  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="font-semibold text-sm mt-3 mb-1">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="font-semibold text-base mt-3 mb-1">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="font-bold text-lg mt-3 mb-1">$1</h1>'
  );

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  html = html.replace(
    /^[\-\*] (.+)$/gm,
    '<li class="ml-4 list-disc text-sm">$1</li>'
  );

  html = html.replace(
    /^\d+\. (.+)$/gm,
    '<li class="ml-4 list-decimal text-sm">$1</li>'
  );

  html = html.replace(/\n\n/g, '</p><p class="mt-2">');
  html = html.replace(/\n/g, "<br/>");

  return `<p>${html}</p>`;
}

function MessageBubble({ message, index }: { message: ChatMessage; index: number }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
        <AvatarFallback
          className={cn(
            "text-[10px] font-bold",
            isUser
              ? "text-white"
              : "text-white"
          )}
          style={isUser ? { background: "#0066CC" } : { background: "linear-gradient(135deg, #00A99D, #0066CC)" }}
        >
          {isUser ? "U" : "M"}
        </AvatarFallback>
      </Avatar>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed transition-shadow duration-300",
          isUser
            ? "rounded-tr-md"
            : "bg-muted text-foreground rounded-tl-md"
        )}
        style={isUser ? { background: "linear-gradient(135deg, #00A99D, #008F85)", color: "white" } : undefined}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            className="prose prose-xs max-w-none [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-xs [&_li]:my-0.5 [&_p]:my-0 [&_strong]:font-semibold [&_pre]:whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}
        <p
          className={cn(
            "text-[10px] mt-1.5",
            isUser ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </motion.div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5"
    >
      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
        <AvatarFallback
          className="text-[10px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #00A99D, #0066CC)" }}
        >
          M
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#00A99D" }}
              animate={{
                y: [0, -6, 0],
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function SeoChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your **Mediusware SEO Intelligence Assistant**. I can answer questions about SEO, content strategy, competitors, keywords, or anything else. Ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, sessionId }),
        });

        const data = await res.json();

        if (data.success && data.response) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.response,
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Sorry, something went wrong: ${data.error || "Unknown error"}. Please try again.`,
              timestamp: new Date(),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Network error \u2014 please check your connection and try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClear = async () => {
    try {
      await fetch(`/api/chat?sessionId=${sessionId}`, { method: "DELETE" });
    } catch {
      // Ignore
    }
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you with your SEO strategy?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00A99D, #0066CC)" }}
            aria-label="Open SEO Assistant"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "#00CC99" }}
              />
              <span
                className="relative inline-flex rounded-full h-4 w-4 border-2 border-background"
                style={{ backgroundColor: "#00CC99" }}
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.9, rotateX: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "fixed z-50 bg-background border shadow-2xl rounded-2xl flex flex-col overflow-hidden",
              isExpanded
                ? "inset-4 sm:inset-6"
                : "bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-[400px] h-[560px]"
            )}
          >
            {/* Header */}
            <div
              className="text-white px-4 py-3 flex items-center justify-between shrink-0"
              style={{ background: "linear-gradient(135deg, #00A99D, #0066CC)" }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                  className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                >
                  <Image src="/logo.png" alt="M" width={18} height={18} className="rounded-sm" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">
                    SEO Intelligence Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#00CC99" }}
                    />
                    <span className="text-[11px] text-white/80">
                      Powered by AI &middot; Ask anything
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label={isExpanded ? "Minimize" : "Maximize"}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={handleClear}
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(var(--border)) transparent" }}
            >
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} index={i} />
                ))}

                {isLoading && <TypingDots />}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-4 pb-2 shrink-0"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                  Quick questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] bg-muted hover:bg-muted/80 text-foreground px-2.5 py-1.5 rounded-full border border-border/50 transition-colors text-left leading-tight"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t px-3 py-3 flex items-center gap-2 shrink-0 bg-background"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about SEO..."
                disabled={isLoading}
                className="h-9 text-sm border-0 bg-muted focus-visible:ring-1 rounded-full px-4 transition-all duration-200"
                style={{ '--tw-ring-color': '#00A99D50' } as React.CSSProperties}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 rounded-full text-white shrink-0 disabled:opacity-40 transition-all duration-200 hover:shadow-lg"
                  style={{ background: input.trim() ? "linear-gradient(135deg, #00A99D, #0066CC)" : undefined }}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
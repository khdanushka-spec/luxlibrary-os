"use client";

import { useState, type FormEvent } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { answerQuery } from "@/lib/ai-librarian";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Which books mention quantum physics?",
  "Recommend books like Sapiens",
  "Books shorter than 250 pages",
  "What books have I never read?",
  "Where is Circe?",
];

const INITIAL_MESSAGE: Message = {
  role: "ai",
  text: "Ask me about your library — an author, a genre, a page count, or where a book lives on your shelves.",
};

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = answerQuery(trimmed);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "ai", text: reply },
    ]);
    setInput("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Bot className="size-6 text-gold" />
          AI Librarian
        </h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-3.5 text-gold" />
          Demo intelligence — pattern matching over your library, not a live
          model yet
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border/70 bg-card/60 p-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-2.5",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                msg.role === "user"
                  ? "bg-secondary text-foreground"
                  : "bg-gold/15 text-gold"
              )}
            >
              {msg.role === "user" ? (
                <User className="size-3.5" />
              ) : (
                <Bot className="size-3.5" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-secondary text-foreground"
                  : "border border-gold/20 bg-gold/[0.06] text-foreground"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-border/70 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your library anything..."
          className="h-11 flex-1 rounded-full border border-border/70 bg-secondary/40 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
        />
        <button
          type="submit"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground transition-transform hover:scale-[1.05] active:scale-[0.95]"
          aria-label="Send"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

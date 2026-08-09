"use client";

import { motion } from "motion/react";
import { Bot, Sparkles, User } from "lucide-react";
import { Reveal } from "./reveal";

const CONVERSATION = [
  { role: "user", text: "I forgot where my Harry Potter books are." },
  {
    role: "ai",
    text: "All seven are on Shelf B2, Fantasy — spines together, first editions marked with a gold dot.",
  },
  { role: "user", text: "Which books mention quantum physics?" },
  {
    role: "ai",
    text: "Fourteen books, led by “Helgoland” and “Quantum: A Guide for the Perplexed.” Want the full list?",
  },
];

export function AiLibrarianSection() {
  return (
    <section
      id="ai-librarian"
      className="border-t border-border/60 bg-secondary/10 py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="glass rounded-2xl border border-border/70 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-4 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-gold" />
              AI Librarian
            </div>
            <div className="space-y-3">
              {CONVERSATION.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.35 }}
                  className={`flex items-start gap-2.5 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-secondary text-foreground"
                        : "bg-gold/15 text-gold"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="size-3.5" />
                    ) : (
                      <Bot className="size-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-secondary text-foreground"
                        : "border border-gold/20 bg-gold/[0.06] text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <span className="text-xs font-medium tracking-[0.2em] text-gold">
            AI LIBRARIAN
          </span>
          <h2 className="font-display mt-4 text-balance text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Ask your library anything
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Your AI Librarian has read every summary, note, and quote in your
            collection. It recommends, explains, locates, and remembers — so
            you can spend less time searching and more time reading.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {[
              "Recommend books like Sapiens",
              "Summarize this novel",
              "Books shorter than 250 pages",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border/70 px-3.5 py-1.5 text-xs text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Bell, BellOff, LogOut, MoreVertical, Pencil, ShieldCheck, UserX, X } from "lucide-react";
import { MemberAvatar } from "./member-avatar";
import type { CommunityMemberView, CommunitySummary, CurrentUserSummary } from "./types";
import { cn } from "@/lib/utils";

export function MembersPanel({
  community,
  members,
  currentUser,
  isMuted,
  onToggleMute,
  onLeave,
  onUpdateCommunity,
  onRemoveMember,
  onBanMember,
  onClose,
}: {
  community: CommunitySummary;
  members: CommunityMemberView[];
  currentUser: CurrentUserSummary;
  isMuted: boolean;
  onToggleMute: () => void;
  onLeave: () => void;
  onUpdateCommunity: (name: string, description: string) => void;
  onRemoveMember: (userId: string) => void;
  onBanMember: (userId: string) => void;
  onClose?: () => void;
}) {
  const [editingInfo, setEditingInfo] = useState(false);
  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description ?? "");
  const [openMemberMenu, setOpenMemberMenu] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-border/60 p-4">
        <h2 className="font-display text-lg text-foreground">Group info</h2>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="size-4.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
          {editingInfo ? (
            <div className="space-y-2.5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                placeholder="Community name"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-border/70 bg-secondary/40 px-3 py-2 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                placeholder="Description"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingInfo(false)}
                  className="h-8 rounded-full border border-border/70 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateCommunity(name, description);
                    setEditingInfo(false);
                  }}
                  className="h-8 rounded-full bg-gold px-3 text-xs font-medium text-gold-foreground"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base text-foreground">{community.name}</h3>
                {currentUser.isAdmin && (
                  <button
                    onClick={() => setEditingInfo(true)}
                    className="shrink-0 text-muted-foreground hover:text-gold"
                    aria-label="Edit group info"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                )}
              </div>
              {community.description && (
                <p className="mt-1.5 text-sm text-muted-foreground">{community.description}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-5">
          <h4 className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {members.length} member{members.length === 1 ? "" : "s"}
          </h4>
          <div className="space-y-0.5">
            {members.map((m) => (
              <div
                key={m.userId}
                className="group flex items-center gap-2.5 rounded-lg px-1.5 py-2 hover:bg-secondary/40"
              >
                <MemberAvatar name={m.name} isOnline={m.isOnline} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm text-foreground">
                    {m.name}
                    {m.userId === currentUser.id && (
                      <span className="text-xs text-muted-foreground">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.isOnline ? "Online" : "Offline"}</p>
                </div>
                {m.isAdmin && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[0.65rem] font-medium text-gold">
                    <ShieldCheck className="size-3" />
                    Admin
                  </span>
                )}
                {currentUser.isAdmin && m.userId !== currentUser.id && (
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setOpenMemberMenu(openMemberMenu === m.userId ? null : m.userId)}
                      className="flex size-6 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100"
                      aria-label="Member actions"
                    >
                      <MoreVertical className="size-3.5" />
                    </button>
                    {openMemberMenu === m.userId && (
                      <div className="glass absolute right-0 top-7 z-20 w-32 overflow-hidden rounded-xl border border-border/70 py-1 shadow-xl">
                        <button
                          onClick={() => {
                            onRemoveMember(m.userId);
                            setOpenMemberMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/60"
                        >
                          <UserX className="size-3.5" />
                          Remove
                        </button>
                        <button
                          onClick={() => {
                            onBanMember(m.userId);
                            setOpenMemberMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-400/10"
                        >
                          <UserX className="size-3.5" />
                          Ban
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-0.5 border-t border-border/60 p-3">
        <button
          onClick={onToggleMute}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary/50"
        >
          {isMuted ? <BellOff className="size-4 text-muted-foreground" /> : <Bell className="size-4 text-muted-foreground" />}
          {isMuted ? "Unmute notifications" : "Mute notifications"}
        </button>
        <button
          onClick={() => {
            if (!confirmLeave) {
              setConfirmLeave(true);
              return;
            }
            onLeave();
          }}
          onBlur={() => setConfirmLeave(false)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
            confirmLeave ? "bg-rose-400/10 text-rose-400" : "text-rose-400 hover:bg-rose-400/10"
          )}
        >
          <LogOut className="size-4" />
          {confirmLeave ? "Confirm leave community?" : "Leave community"}
        </button>
      </div>
    </div>
  );
}

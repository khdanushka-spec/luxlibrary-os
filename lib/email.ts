import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Where signup-approval notifications land. Deliberately separate from
 * SUPER_ADMIN_EMAIL (lib/auth.ts) - that constant decides who auto-becomes
 * admin on signup, this is just a mailbox, and they don't have to match.
 */
const NOTIFICATION_EMAIL = "bringbooksdkns@gmail.com";

/**
 * Fire-and-forget: a failed or unconfigured email must never block signup
 * (there's no retry/queue here - it's a best-effort admin nudge, not a
 * transactional flow anything else depends on).
 */
export async function sendNewUserApprovalEmail(user: { name: string; email: string }): Promise<void> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping new-user approval email.");
    return;
  }

  try {
    await resend.emails.send({
      from: "BringBooks <onboarding@resend.dev>",
      to: NOTIFICATION_EMAIL,
      subject: `New BringBooks access request — ${user.name}`,
      html: `
        <p><strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}) just requested access to BringBooks.</p>
        <p><a href="${SITE_URL}/admin">Review the request</a></p>
      `,
    });
  } catch (error) {
    console.error("Failed to send new-user approval email:", error);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

import { LegalPage } from "@/components/legal/legal-page";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Cookie Policy — BringBooks",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="12 August 2026">
      <p>
        This page explains the cookies BringBooks uses. It&rsquo;s intentionally short, because
        BringBooks intentionally uses very few.
      </p>

      <h2>1. What we use</h2>
      <p>
        BringBooks sets a single <strong>essential session cookie</strong> when you sign in. It
        stores a session token that keeps you logged in as you move between pages. It&rsquo;s
        secure, HTTP-only (JavaScript on the page can&rsquo;t read it), and expires automatically.
      </p>
      <p>
        Your appearance preference (light or dark mode) is stored in your browser&rsquo;s local
        storage, not a cookie, and never leaves your device.
      </p>

      <h2>2. What we don&rsquo;t use</h2>
      <p>
        BringBooks does not use advertising cookies, third-party tracking cookies, or analytics
        cookies. We don&rsquo;t track you across other websites.
      </p>

      <h2>3. Managing cookies</h2>
      <p>
        Because our only cookie is essential to keeping you signed in, blocking or deleting it will
        log you out and you&rsquo;ll need to sign in again. You can control or clear cookies at any
        time in your browser&rsquo;s settings.
      </p>

      <h2>4. Changes to this policy</h2>
      <p>
        If BringBooks ever introduces analytics or other non-essential cookies, we&rsquo;ll update
        this page first. We&rsquo;ll update the &ldquo;Last updated&rdquo; date above when we do.
      </p>

      <h2>5. Contact us</h2>
      <p>
        Questions about this policy: email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}

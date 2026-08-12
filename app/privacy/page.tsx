import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy — BringBooks",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="12 August 2026">
      <p>
        This policy explains how BringBooks collects, holds, uses, and discloses personal
        information, and how you can access or correct it, in line with the Australian Privacy
        Principles (APPs) under the <em>Privacy Act 1988</em> (Cth).
      </p>

      <h2>1. Who this policy covers</h2>
      <p>
        BringBooks (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates the BringBooks personal library
        application at bringbooks.com. This policy applies to anyone who signs up for or uses
        BringBooks.
      </p>

      <h2>2. What personal information we collect</h2>
      <ul>
        <li>Account details: your name, email address, and a securely hashed password.</li>
        <li>
          Library data you add: book titles, authors, notes, quotes, reading status/progress,
          and — if you choose to enter it — purchase price, purchase date, seller, and insurance
          value for individual books.
        </li>
        <li>
          Community content: messages, reactions, and shared books you post in BringBooks&rsquo;
          community chat, visible to other approved members.
        </li>
        <li>App preferences: settings like theme, notification, and AI-feature toggles.</li>
        <li>
          Technical data: standard server logs (IP address, browser type, timestamps) generated
          by normal web traffic.
        </li>
      </ul>

      <h2>3. How we collect it</h2>
      <p>
        Directly from you — when you request access, add books to your library, adjust settings,
        or use community features. We don&rsquo;t buy personal information from third parties or
        collect it from social media.
      </p>

      <h2>4. Why we collect and use it</h2>
      <ul>
        <li>To create and run your BringBooks account, including admin approval of new sign-ups.</li>
        <li>To operate the features you use: your library, reading tracker, notes, and community chat.</li>
        <li>To notify the library owner by email when a new account requests access.</li>
        <li>
          To personalise the app for you (e.g. dashboard picks, reading suggestions) where you&rsquo;ve
          opted in via Settings.
        </li>
        <li>To keep the service secure and diagnose technical problems.</li>
      </ul>
      <p>We do not use your personal information for advertising, and we do not sell it.</p>

      <h2>5. Who we disclose it to</h2>
      <p>
        We use the following service providers to run BringBooks. Each only receives what it needs
        to provide its service, under its own terms:
      </p>
      <ul>
        <li>
          <strong>Neon (database hosting)</strong> — stores your account and library data. Hosted
          on Amazon Web Services in the United States.
        </li>
        <li>
          <strong>Vercel (application hosting)</strong> — runs the BringBooks application itself.
        </li>
        <li>
          <strong>Resend (email delivery)</strong> — sends the new-signup approval notification
          email. Based in the United States.
        </li>
      </ul>
      <p>
        <strong>Overseas storage:</strong> because of the providers above, your personal
        information is stored and processed on servers located outside Australia, principally in
        the United States. We choose providers with strong security and privacy commitments of
        their own, but by using BringBooks you understand your information may be handled overseas
        and outside the direct reach of Australian privacy enforcement.
      </p>
      <p>We don&rsquo;t disclose your personal information to anyone else, except where required by law.</p>

      <h2>6. Data security</h2>
      <p>
        Passwords are never stored in plain text — they&rsquo;re hashed with bcrypt. Sessions use
        secure, HTTP-only cookies. Access to administrative functions (approving accounts, managing
        members) is restricted to the super admin. No method of storage or transmission is 100%
        secure, but we take reasonable technical steps to protect your information.
      </p>

      <h2>7. How long we keep it</h2>
      <p>
        We keep your account and library data for as long as your account is active. If you ask us
        to delete your account (see below), we&rsquo;ll remove your personal information within a
        reasonable time, except where we need to retain something to meet a legal obligation.
      </p>

      <h2>8. Access, correction, and deletion</h2>
      <p>
        Most of your information — library data, notes, settings — can be viewed and corrected
        directly inside the app. For anything else, including requesting a copy of your data or
        deleting your account entirely, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We&rsquo;ll respond within a
        reasonable timeframe.
      </p>

      <h2>9. Cookies</h2>
      <p>
        BringBooks uses a single essential cookie to keep you signed in. See our{" "}
        <Link href="/cookies">Cookie Policy</Link> for details.
      </p>

      <h2>10. Children&rsquo;s privacy</h2>
      <p>
        BringBooks isn&rsquo;t directed at children and we don&rsquo;t knowingly collect personal
        information from anyone under 16. If you believe a child has provided us with personal
        information, contact us and we&rsquo;ll remove it.
      </p>

      <h2>11. Complaints</h2>
      <p>
        If you think we&rsquo;ve mishandled your personal information, contact us first at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> so we can try to resolve it. If
        you&rsquo;re not satisfied with our response, you can lodge a complaint with the Office of
        the Australian Information Commissioner (OAIC) at{" "}
        <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
          oaic.gov.au
        </a>
        .
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy as BringBooks changes. We&rsquo;ll update the &ldquo;Last
        updated&rdquo; date above when we do. Continued use of BringBooks after a change means you
        accept the update.
      </p>

      <h2>13. Contact us</h2>
      <p>
        Questions about this policy or your personal information: email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}

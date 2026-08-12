import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Terms of Service — BringBooks",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="12 August 2026">
      <p>
        These terms govern your use of BringBooks. By requesting access to or using BringBooks,
        you agree to them. If you don&rsquo;t agree, please don&rsquo;t use the service.
      </p>

      <h2>1. The service</h2>
      <p>
        BringBooks is a personal library management application: catalogue your book collection,
        track your reading, and (for approved members) chat with other members of the same
        library community. Access is by admin approval — creating an account doesn&rsquo;t
        guarantee entry.
      </p>

      <h2>2. Eligibility and your account</h2>
      <ul>
        <li>You must be at least 16 years old to create a BringBooks account.</li>
        <li>You&rsquo;re responsible for keeping your password confidential and for all activity under your account.</li>
        <li>Tell us immediately at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you suspect unauthorised access.</li>
        <li>Provide accurate information when you sign up.</li>
      </ul>

      <h2>3. Acceptable use and community guidelines</h2>
      <p>When using BringBooks, including its community chat, you agree not to:</p>
      <ul>
        <li>Post content that&rsquo;s unlawful, defamatory, harassing, hateful, or sexually explicit involving a minor.</li>
        <li>Threaten, bully, or abuse another member.</li>
        <li>Infringe someone else&rsquo;s intellectual property or privacy.</li>
        <li>Send spam or unsolicited commercial messages.</li>
        <li>Attempt to gain unauthorised access to the service or another member&rsquo;s account.</li>
        <li>Use the service for anything illegal under Australian law.</li>
      </ul>
      <p>
        If you see content or behaviour that breaches these guidelines, report it to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. The library owner can remove
        content, and disable, suspend, or delete accounts that breach these terms, at their
        discretion.
      </p>

      <h2>4. Your content</h2>
      <p>
        You keep ownership of the library data, notes, and messages you add to BringBooks. By
        posting content, you give us the licence we need to store, display, and back it up solely
        to operate the service for you and (for community content) other approved members of your
        library.
      </p>
      <p>
        Book titles, cover images, and other bibliographic data may be protected by the copyright
        of their respective publishers and authors — BringBooks is a personal cataloguing tool,
        not a licence to redistribute that content.
      </p>

      <h2>5. Third-party services</h2>
      <p>
        BringBooks relies on third-party infrastructure to operate, including Neon (database
        hosting), Vercel (application hosting), and Resend (email delivery). See our{" "}
        <Link href="/privacy">Privacy Policy</Link> for details on how these providers handle your
        information.
      </p>

      <h2>6. Availability</h2>
      <p>
        BringBooks is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We
        don&rsquo;t guarantee the service will be uninterrupted, error-free, or available at all
        times, and we may change, suspend, or discontinue any part of it.
      </p>

      <h2>7. Liability</h2>
      <p>
        Nothing in these terms excludes, restricts, or modifies any consumer guarantee, right, or
        remedy you have under the <em>Australian Consumer Law</em> (Schedule 2 of the{" "}
        <em>Competition and Consumer Act 2010</em> (Cth)) that can&rsquo;t lawfully be excluded.
        To the extent the law allows, BringBooks is provided for personal, non-commercial use, and
        we exclude liability for indirect or consequential loss, and for loss of data arising from
        service interruptions.
      </p>

      <h2>8. Ending your account</h2>
      <p>
        You can ask us to close your account at any time by emailing{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may suspend or delete an
        account that breaches these terms, or that&rsquo;s inactive for an extended period,
        without notice.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. We&rsquo;ll update the &ldquo;Last
        updated&rdquo; date above when we do. Continuing to use BringBooks after a change means you
        accept the update.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of Australia. Any dispute arising from these terms or
        your use of BringBooks is subject to the exclusive jurisdiction of the Australian courts.
      </p>

      <h2>11. Contact us</h2>
      <p>
        Questions about these terms: email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}

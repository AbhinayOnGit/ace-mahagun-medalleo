import type { Metadata } from "next";
import LegalShell from "../LegalShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy | ACE Mahagun Medalleo", alternates: { canonical: "/privacy" }, robots: { index: false } };

export default function Privacy() {
  const who = siteConfig.advertiserName || "[Advertiser legal name]";
  return (
    <LegalShell title="Privacy Policy">
      <h2>Who we are</h2>
      <p>This website is operated by {who} (&ldquo;we&rdquo;) to market ACE Mahagun Medalleo, Sector 107, Noida. It is not the official website of the developer.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Details you submit in an enquiry form: name, mobile number, optional email, preferred configuration, enquiry type and preferred contact time.</li>
        <li>Your consent to be contacted, with the time it was given.</li>
        <li>The page address and campaign (UTM) parameters from which you enquired.</li>
      </ul>
      <p>We do not collect payment information, and we do not use advertising or analytics cookies on this website at present.</p>
      <h2>How we use it</h2>
      <p>Only to respond to your enquiry about this project — calls, SMS, email or WhatsApp from our property advisors — and to keep a record of your consent.</p>
      <h2>Storage and security</h2>
      <p>Enquiries are stored in a secured database with access restricted to authorised staff. Data is retained for [retention period] and then deleted.</p>
      <h2>Sharing</h2>
      <p>We do not sell your data. [Describe any sharing with the developer or a CRM provider, if applicable.]</p>
      <h2>Your rights</h2>
      <p>You may ask us to access, correct or delete your data, or withdraw consent, by writing to {siteConfig.email || "[contact email]"}. This policy follows the Digital Personal Data Protection Act, 2023.</p>
      <h2>Third-party content</h2>
      <p>The interactive map loads Google Maps only when you choose to load it, and WhatsApp links open WhatsApp; their own privacy policies apply.</p>
    </LegalShell>
  );
}

import type { Metadata } from "next";
import LegalShell from "../LegalShell";
import { disclaimer, project } from "@/content/project";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms & Conditions | ACE Mahagun Medalleo", alternates: { canonical: "/terms" }, robots: { index: false } };

export default function Terms() {
  return (
    <LegalShell title="Terms & Conditions">
      <h2>Nature of this website</h2>
      <p>This website is a marketing communication by {siteConfig.advertiserName || "the advertiser"}{siteConfig.agentRera ? ` (UP RERA Agent Reg. ${siteConfig.agentRera})` : ""}. It is not an offer, invitation to offer or contract.</p>
      <h2>Project information</h2>
      <p>{disclaimer}</p>
      <p>UP RERA Registration: {project.rera.number}. Verify at www.up-rera.in/projects.</p>
      <h2>No pricing or return assurances</h2>
      <p>Nothing on this website is a promise of price, availability, possession date, rental yield or capital appreciation. Pricing and availability are confirmed only in writing by the developer.</p>
      <h2>Intellectual property</h2>
      <p>Project names, renders and floor plans belong to their respective owners and are reproduced for marketing of this project.</p>
    </LegalShell>
  );
}

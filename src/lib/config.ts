/**
 * Site configuration. All contact details are environment-driven so that no
 * phone number or WhatsApp number is ever hard-coded. Empty values hide the
 * corresponding UI rather than showing an invented number.
 */
const clean = (v?: string) => (v ?? "").trim();

export const siteConfig = {
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",
  whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, ""), // e.g. 9198XXXXXXXX
  phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE), // e.g. +91 98XXX XXXXX
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  advertiserName: clean(process.env.NEXT_PUBLIC_ADVERTISER_NAME), // channel partner / advertiser legal name
  agentRera: clean(process.env.NEXT_PUBLIC_AGENT_RERA_NUMBER), // UP RERA agent registration, if advertiser is an agent
  brochureUrl: clean(process.env.NEXT_PUBLIC_BROCHURE_URL), // shown only after a brochure enquiry is submitted
};

export function whatsappLink(message: string) {
  if (!siteConfig.whatsappNumber) return null;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  if (!siteConfig.phone) return null;
  return `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
}

export const waMessages = {
  general: "Hello, I'm interested in ACE Mahagun Medalleo, Sector 107, Noida. Please share more details.",
  hero: "Hello, I'd like to know more about ACE Mahagun Medalleo residences (3 & 4 BHK) in Sector 107, Noida.",
  contact: "Hello, I'd like to schedule a site visit to ACE Mahagun Medalleo, Sector 107, Noida.",
};

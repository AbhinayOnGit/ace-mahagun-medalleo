import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { project } from "@/content/project";

const title = "ACE Mahagun Medalleo, Sector 107 Noida | Luxury 3 & 4 BHK Residences";
const description =
  "ACE Mahagun Medalleo — Art Deco luxury 3 & 4 BHK apartments in Sector 107, Noida, designed with Hafeez Contractor. Approx. 10 acres, two clubhouses, forest trail. UP RERA: UPRERAPRJ125561.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title,
  description,
  keywords: [
    "ACE Mahagun Medalleo",
    "ACE Mahagun Medalleo Sector 107",
    "Mahagun Medalleo Noida",
    "luxury apartments in Sector 107 Noida",
    "3 BHK apartments in Noida",
    "4 BHK apartments in Noida",
    "premium homes in Noida",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: project.name,
    title,
    description,
    locale: "en_IN",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "ACE Mahagun Medalleo towers, Sector 107 Noida" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#171A19",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}

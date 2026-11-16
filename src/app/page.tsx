import EnquiryProvider from "@/components/EnquiryProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { AtAGlance, Hallmarks, Overview } from "@/components/Overview";
import Residences from "@/components/Residences";
import EmiEstimator from "@/components/EmiEstimator";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import { About, BrochureCta, Faq, FinalCta, Footer } from "@/components/Closing";
import FloatingActions from "@/components/FloatingActions";
import { faqs, project } from "@/content/project";
import { siteConfig } from "@/lib/config";

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "ApartmentComplex",
      name: project.name,
      description:
        "Art Deco luxury 3 & 4 BHK residences on approx. 10 acres in Sector 107, Noida, with two clubhouses and resort-style landscapes.",
      url: siteConfig.siteUrl,
      image: `${siteConfig.siteUrl}/images/og.jpg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plot No. GH-01/A (Alpha), Sector 107",
        addressLocality: "Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: "201304",
        addressCountry: "IN",
      },
      amenityFeature: ["Dense Forest Trail", "All-Weather Swimming Pool", "Two Exclusive Clubhouses", "Squash Court", "Spa", "Gym", "Infinity Swimming Pool"].map(
        (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
      ),
      identifier: { "@type": "PropertyValue", name: "UP RERA Registration", value: project.rera.number },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Home() {
  return (
    <EnquiryProvider>
      <a href="#overview" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Overview />
        <AtAGlance />
        <Hallmarks />
        <Residences />
        <EmiEstimator />
        <Amenities />
        <Gallery />
        <Location />
        <BrochureCta />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingActions />
      <JsonLd />
    </EnquiryProvider>
  );
}

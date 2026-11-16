import { z } from "zod";

export const CONFIGURATIONS = ["3 BHK", "4 BHK", "Not Sure"] as const;
export const ENQUIRY_TYPES = ["Brochure", "Price Details", "Site Visit", "Callback"] as const;
export const CONTACT_TIMES = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)", "Anytime"] as const;

/** Normalises Indian mobile numbers: accepts +91, 91, 0 prefixes, spaces and dashes. */
export function normaliseIndianMobile(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "").replace(/^\+/, "");
  let n = digits;
  if (n.length === 12 && n.startsWith("91")) n = n.slice(2);
  else if (n.length === 11 && n.startsWith("0")) n = n.slice(1);
  return /^[6-9]\d{9}$/.test(n) ? n : null;
}

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long")
    .regex(/^[\p{L} .'-]+$/u, "Please use letters only"),
  mobile: z
    .string()
    .trim()
    .refine((v) => normaliseIndianMobile(v) !== null, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || z.email().safeParse(v).success, "Enter a valid email address"),
  configuration: z.enum(CONFIGURATIONS, { error: "Select a configuration" }),
  enquiryType: z.enum(ENQUIRY_TYPES, { error: "Select an enquiry type" }),
  contactTime: z.enum(CONTACT_TIMES).optional().or(z.literal("")),
  consent: z.literal(true, { error: "Please accept to be contacted" }),
  // metadata
  idempotencyKey: z.uuid(),
  landingUrl: z.string().max(500).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(150).optional(),
  formLocation: z.string().max(40).optional(),
  // honeypot — must be empty
  company: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const CONSENT_TEXT =
  "I authorise the advertiser and its representatives to contact me about ACE Mahagun Medalleo via call, SMS, email or WhatsApp. This overrides any DND/NDNC registration. I have read the Privacy Policy.";

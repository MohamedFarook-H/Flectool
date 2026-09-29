/**
 * Contact form email plumbing.
 *
 * Kept separate from the React component so the formatting can be tested on
 * its own — the string produced here is what the visitor's mail client shows.
 */

export const CONTACT_EMAIL = "flectonis@gmail.com";
export const GITHUB_URL = "https://github.com/MohamedFarook-H?tab=repositories";
export const GITHUB_HANDLE = "@MohamedFarook-H";

export const TOPICS = [
  "General enquiry",
  "Report a bug",
  "Request a tool",
  "Feedback or suggestion",
  "Collaboration",
  "Other",
] as const;

export interface FormState {
  name: string;
  email: string;
  topic: string;
  tool: string;
  message: string;
}

export type FormErrors = Partial<Record<keyof FormState, string>>;

export const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  topic: TOPICS[0],
  tool: "",
  message: "",
};

export function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Please enter your name";
  else if (form.name.trim().length < 2) errors.name = "Name looks too short";

  if (!form.email.trim()) errors.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = "Please enter a valid email address";

  if (!form.message.trim())
    errors.message = "Please tell us what's on your mind";
  else if (form.message.trim().length < 10)
    errors.message = "Message looks too short — please add a little more detail";

  return errors;
}

/** Formats the form into a full email body for the visitor's mail client. */
export function buildMailto(form: FormState): string {
  const toolLabel = form.tool.trim() || "Not specified";
  const topic = form.topic.trim() || "General enquiry";
  const subject = `[Flectool] ${topic}${toolLabel !== "Not specified" ? ` — ${toolLabel}` : ""}`;

  const body = [
    "New message from the Flectool contact form",
    "===========================================",
    "",
    `Name:     ${form.name.trim()}`,
    `Email:    ${form.email.trim()}`,
    `Topic:    ${topic}`,
    `Tool:     ${toolLabel}`,
    "",
    "Message",
    "-------",
    form.message.trim(),
    "",
    "===========================================",
    "Sent from flectool.app/contact",
    "Flectool is a product of Flectonis.",
  ].join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

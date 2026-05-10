import { buildApiUrl } from "./api";

export async function submitContactInquiry(payload) {
  const response = await fetch(buildApiUrl("/api/public/contact-inquiries"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Unable to send enquiry right now.");
  }

  return data;
}

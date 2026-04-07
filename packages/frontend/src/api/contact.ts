import { apiFetch } from "./client";

export type ContactRequestPayload = {
  name: string;
  email: string;
  phone?: string;
  school_name?: string;
  role?: string;
  message: string;
};

export function submitContactRequest(payload: ContactRequestPayload) {
  return apiFetch<{ detail?: string }>("/content/contact/", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

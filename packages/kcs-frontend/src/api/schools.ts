import { apiFetch } from "./client";

export type School = {
  id: number;
  name: string;
  code: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  is_active?: boolean;
  admin_email?: string | null;
};

export type CreateSchoolPayload = {
  name: string;
  code: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
};

export type CreateSchoolAdminPayload = {
  email: string;
  password: string;
};

export type AssignSubscriptionPayload = {
  plan: "free" | "monthly" | "yearly" | "free_plan" | "monthly_plan" | "yearly_plan";
};

export function listSchools() {
  return apiFetch<School[]>("/schools/");
}

export function createSchool(payload: CreateSchoolPayload) {
  return apiFetch<School>("/schools/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSchool(id: number, payload: Partial<CreateSchoolPayload>) {
  return apiFetch<School>(`/schools/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function createSchoolAdmin(schoolId: number, payload: CreateSchoolAdminPayload) {
  return apiFetch<{ id: number; email: string; role: string; school_id: number }>(
    `/schools/${schoolId}/admin/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function assignSubscription(schoolId: number, payload: AssignSubscriptionPayload) {
  return apiFetch<{ detail: string; schedule_id: string; plan: string }>(
    `/schools/${schoolId}/subscription/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

import { apiFetch } from "./client";

export type School = {
  uuid: string;
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

export function updateSchool(schoolUuid: string, payload: Partial<CreateSchoolPayload>) {
  return apiFetch<School>(`/schools/${schoolUuid}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function createSchoolAdmin(schoolUuid: string, payload: CreateSchoolAdminPayload) {
  return apiFetch<{ uuid: string; email: string; role: string; school_uuid: string }>(
    `/schools/${schoolUuid}/admin/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function assignSubscription(schoolUuid: string, payload: AssignSubscriptionPayload) {
  return apiFetch<{ detail: string; schedule_id: string; plan: string }>(
    `/schools/${schoolUuid}/subscription/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

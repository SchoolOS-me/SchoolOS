import { apiFetch } from "./client";

export type School = {
  uuid: string;
  name: string;
  code: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  theme_mode?: "light" | "dark" | "system" | null;
  subdomain?: string | null;
  is_active?: boolean;
  admin_email?: string | null;
};

export type CreateSchoolPayload = {
  name: string;
  code: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  logo?: File;
  theme_mode?: "light" | "dark" | "system";
};

export type CreateSchoolAdminPayload = {
  email: string;
  password: string;
};

export type AssignSubscriptionPayload = {
  plan: "free" | "monthly" | "yearly" | "free_plan" | "monthly_plan" | "yearly_plan";
};

export type BulkImportRow = Record<string, string>;

export type BulkImportPayload = {
  classes: BulkImportRow[];
  sections: BulkImportRow[];
  students: BulkImportRow[];
  teachers: BulkImportRow[];
};

export type BulkImportResponse = {
  detail: string;
  school_uuid: string;
  summary: {
    classes: { created: number; updated: number; skipped: number };
    sections: { created: number; updated: number; skipped: number };
    students: { created: number; updated: number; skipped: number };
    teachers: { created: number; updated: number; skipped: number };
  };
  errors: Array<{
    group: string;
    row: number;
    detail: string;
  }>;
};

export type ImportGroup = "classes" | "sections" | "students" | "teachers";

export type ImportPreviewResponse = {
  headers: string[];
  row_count: number;
  required_fields: string[];
};

export function listSchools() {
  return apiFetch<School[]>("/schools/");
}

export function createSchool(payload: CreateSchoolPayload) {
  const formData = new FormData();
  formData.set("name", payload.name);
  formData.set("code", payload.code);
  if (payload.contact_email) formData.set("contact_email", payload.contact_email);
  if (payload.contact_phone) formData.set("contact_phone", payload.contact_phone);
  if (payload.address) formData.set("address", payload.address);
  if (payload.logo) formData.set("logo", payload.logo);
  return apiFetch<School>("/schools/", {
    method: "POST",
    body: formData,
  });
}

export function updateSchool(schoolUuid: string, payload: Partial<CreateSchoolPayload>) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.set(key, value instanceof File ? value : String(value));
    }
  });
  return apiFetch<School>(`/schools/${schoolUuid}/`, {
    method: "PATCH",
    body: formData,
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

export function bulkImportSchoolData(schoolUuid: string, payload: BulkImportPayload) {
  return apiFetch<BulkImportResponse>(`/schools/${schoolUuid}/bulk-import/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchCurrentSchool() {
  return apiFetch<School>("/schools/current/");
}

export function updateCurrentSchool(payload: Partial<CreateSchoolPayload>) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.set(key, value instanceof File ? value : String(value));
    }
  });
  return apiFetch<School>("/schools/current/", {
    method: "PATCH",
    body: formData,
  });
}

export function previewCurrentSchoolImport(importGroup: ImportGroup, file: File) {
  const formData = new FormData();
  formData.set("import_group", importGroup);
  formData.set("file", file);
  return apiFetch<ImportPreviewResponse>("/schools/current/bulk-import/preview/", {
    method: "POST",
    body: formData,
  });
}

export function importCurrentSchoolFile(
  importGroup: ImportGroup,
  file: File,
  mapping: Record<string, string>
) {
  const formData = new FormData();
  formData.set("import_group", importGroup);
  formData.set("file", file);
  formData.set("mapping", JSON.stringify(mapping));
  return apiFetch<BulkImportResponse>("/schools/current/bulk-import/file/", {
    method: "POST",
    body: formData,
  });
}

export function fetchSchoolBrandingByCode(code: string) {
  return apiFetch<School>(`/schools/branding/${encodeURIComponent(code)}/`, {
    method: "GET",
    skipAuth: true,
  });
}

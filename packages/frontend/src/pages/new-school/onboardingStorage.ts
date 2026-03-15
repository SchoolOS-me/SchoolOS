export type OnboardingDraft = {
  schoolUuid: string;
  schoolName: string;
  adminName: string;
  adminEmail: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  website?: string;
  academicYear?: string;
  medium?: string;
  grades?: string;
  sections?: string;
};

const KEY = "schoolos_onboarding_draft";

export function readOnboardingDraft(): OnboardingDraft | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    if (!parsed.schoolUuid) return null;
    return {
      schoolUuid: parsed.schoolUuid,
      schoolName: parsed.schoolName || "",
      adminName: parsed.adminName || "",
      adminEmail: parsed.adminEmail || "",
      address: parsed.address || "",
      city: parsed.city || "",
      country: parsed.country || "",
      phone: parsed.phone || "",
      website: parsed.website || "",
      academicYear: parsed.academicYear || "",
      medium: parsed.medium || "",
      grades: parsed.grades || "",
      sections: parsed.sections || "",
    };
  } catch {
    return null;
  }
}

export function saveOnboardingDraft(patch: Partial<OnboardingDraft>): OnboardingDraft {
  const current = readOnboardingDraft() || {
    schoolUuid: "",
    schoolName: "",
    adminName: "",
    adminEmail: "",
  };
  const next: OnboardingDraft = {
    ...current,
    ...patch,
  };
  window.sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearOnboardingDraft() {
  window.sessionStorage.removeItem(KEY);
}

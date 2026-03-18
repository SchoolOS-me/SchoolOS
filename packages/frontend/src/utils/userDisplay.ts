import { authStorage } from "../api/storage";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  SCHOOL_ADMIN: "School Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

function toNameFromIdentifier(email?: string | null, phoneNumber?: string | null): string {
  if (!email) {
    return phoneNumber?.trim() || "User";
  }
  const localPart = email.split("@")[0] || "user";
  return localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function toInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getCurrentUserDisplay() {
  const user = authStorage.getUser();
  const name = toNameFromIdentifier(user?.email, user?.phone_number);
  const role = ROLE_LABELS[user?.role || ""] || "User";
  return {
    name,
    role,
    initials: toInitials(name),
    schoolName: user?.school_name?.trim() || "SchoolOS",
  };
}

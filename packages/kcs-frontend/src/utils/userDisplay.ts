import { authStorage } from "../api/storage";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  SCHOOL_ADMIN: "School Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

function toNameFromEmail(email?: string | null): string {
  if (!email) return "User";
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
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getCurrentUserDisplay() {
  const user = authStorage.getUser();
  const name = toNameFromEmail(user?.email);
  const role = ROLE_LABELS[user?.role || ""] || "User";
  return {
    name,
    role,
    initials: toInitials(name),
  };
}


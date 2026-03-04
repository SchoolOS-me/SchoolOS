import { authStorage } from "../api/storage";

export type DashboardVariant = "default" | "superAdmin" | "teacher" | "student" | "parent" | "admin";

const ROLE_TO_VARIANT: Record<string, DashboardVariant> = {
  SUPER_ADMIN: "superAdmin",
  SCHOOL_ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

export function getDashboardVariantFromRole(): DashboardVariant {
  const role = authStorage.getUser()?.role ?? "";
  return ROLE_TO_VARIANT[role] ?? "default";
}

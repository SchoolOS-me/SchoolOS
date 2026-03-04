import { apiFetch } from "./client";

export type Teacher = {
  uuid: string;
  full_name: string;
  employee_id: string;
  is_active: boolean;
  email: string;
};

export type Student = {
  uuid: string;
  full_name: string;
  admission_number: string;
  is_active: boolean;
  class_name: string;
  section_name: string;
  school_class_uuid: string;
  section_uuid: string;
};

export type SchoolClass = {
  uuid: string;
  name: string;
  order: number;
  academic_year: string;
  academic_year_uuid: string;
};

export type Section = {
  uuid: string;
  name: string;
  school_class_uuid: string;
};

export type CreateTeacherPayload = {
  full_name: string;
  employee_id: string;
  email: string;
  password: string;
};

export type CreateStudentPayload = {
  full_name: string;
  admission_number: string;
  parent_contact?: string;
  school_class_uuid: string;
  section_uuid: string;
};

export type CreateClassPayload = {
  name: string;
  order: number;
  academic_year_uuid?: string | null;
};

export type CreateSectionPayload = {
  school_class_uuid: string;
  name: string;
};

export function createTeacher(payload: CreateTeacherPayload) {
  return apiFetch<Teacher>("/academics/admin/teachers/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createStudent(payload: CreateStudentPayload) {
  return apiFetch<Student>("/academics/admin/students/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createClass(payload: CreateClassPayload) {
  return apiFetch<{ uuid: string; name: string; order: number }>("/academics/admin/classes/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createSection(payload: CreateSectionPayload) {
  return apiFetch<{ uuid: string; name: string }>("/academics/admin/sections/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listTeachers() {
  return apiFetch<Teacher[]>("/academics/admin/teachers/");
}

export function listStudents() {
  return apiFetch<Student[]>("/academics/admin/students/");
}

export function listClasses() {
  return apiFetch<SchoolClass[]>("/academics/admin/classes/");
}

export function listSections(schoolClassUuid?: string) {
  const query = schoolClassUuid ? `?school_class_uuid=${schoolClassUuid}` : "";
  return apiFetch<Section[]>(`/academics/admin/sections/${query}`);
}

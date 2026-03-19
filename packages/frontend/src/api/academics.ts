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

export type ParentChild = {
  student_uuid: string;
  name: string;
  class: string;
  section: string;
};

export type ParentReportCard = {
  student: {
    name: string;
    admission_number: string;
    class: string;
    section: string;
  };
  exam: {
    name: string;
    academic_year: string;
  };
  subjects: Array<{
    subject_name: string;
    max_marks: number;
    pass_marks: number;
    marks_obtained: number | null;
    is_pass: boolean;
  }>;
  summary: {
    total_marks: number;
    max_marks: number;
    percentage: number;
    is_pass: boolean;
  };
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
  student_email?: string;
  student_phone?: string;
  student_password?: string;
  guardian_name?: string;
  guardian_email?: string;
  guardian_phone?: string;
  guardian_password?: string;
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

export function fetchParentChildren() {
  return apiFetch<ParentChild[]>("/academics/parent/children/");
}

export function fetchParentResults(studentUuid: string) {
  return apiFetch<ParentReportCard[]>(
    `/academics/parent/results/?student_uuid=${encodeURIComponent(studentUuid)}`
  );
}

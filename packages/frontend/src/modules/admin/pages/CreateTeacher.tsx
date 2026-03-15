import { useState } from "react";
import type { KeyboardEvent } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { createTeacher } from "../../../api/academics";
import "./CreateTeacher.css";

const DEPARTMENT_OPTIONS = [
  "Science & Technology",
  "Arts & Humanities",
  "Physical Education",
  "Mathematics",
];

const CreateTeacher = () => {
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0]);
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>(["Mathematics", "Physics"]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addSubject = () => {
    const value = subjectInput.trim();
    if (!value) return;
    if (subjects.some((subject) => subject.toLowerCase() === value.toLowerCase())) {
      setSubjectInput("");
      return;
    }
    setSubjects((prev) => [...prev, value]);
    setSubjectInput("");
  };

  const removeSubject = (subject: string) => {
    setSubjects((prev) => prev.filter((item) => item !== subject));
  };

  const onSubjectKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubject();
    }
  };

  const resetOptionalFields = () => {
    setPhone("");
    setDepartment(DEPARTMENT_OPTIONS[0]);
    setSubjectInput("");
    setSubjects(["Mathematics", "Physics"]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createTeacher({
        full_name: fullName.trim(),
        employee_id: employeeId.trim(),
        email: email.trim(),
        password,
      });
      setSuccess("Teacher created successfully.");
      setFullName("");
      setEmployeeId("");
      setEmail("");
      setPassword("");
      resetOptionalFields();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create teacher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create Teacher" variant="admin">
      <div className="teacher-form-page">
        <section className="teacher-form-header">
          <p className="teacher-form-breadcrumb">Dashboard / Faculty / Create Teacher</p>
          <h1>Create Teacher</h1>
          <p>Enter faculty details to grant portal access.</p>
        </section>

        <form className="teacher-form-card" onSubmit={handleSubmit}>
          <div className="teacher-grid teacher-grid--two">
            <label className="teacher-field teacher-field--full" htmlFor="teacher-name">
              <span>Full Name</span>
              <input
                id="teacher-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="e.g. Sarah Mitchell"
                required
              />
            </label>

            <label className="teacher-field" htmlFor="teacher-email">
              <span>Email Address</span>
              <input
                id="teacher-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="sarah.m@school.edu"
                required
              />
            </label>

            <label className="teacher-field" htmlFor="teacher-phone">
              <span>Phone Number</span>
              <input
                id="teacher-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </label>

            <label className="teacher-field" htmlFor="teacher-employee-id">
              <span>Employee ID</span>
              <input
                id="teacher-employee-id"
                type="text"
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                placeholder="e.g. TCH-120"
                required
              />
            </label>

            <label className="teacher-field" htmlFor="teacher-password">
              <span>Temporary Password</span>
              <input
                id="teacher-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
            </label>

            <label className="teacher-field teacher-field--full" htmlFor="teacher-department">
              <span>Department</span>
              <select
                id="teacher-department"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              >
                {DEPARTMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <section className="teacher-subjects">
            <div className="teacher-subjects__header">
              <label htmlFor="teacher-subject-input">Subjects Taught</label>
              <span>Press Enter to add</span>
            </div>

            <div className="teacher-tags">
              {subjects.map((subject) => (
                <div key={subject} className="teacher-tag">
                  <span>{subject}</span>
                  <button type="button" onClick={() => removeSubject(subject)}>
                    x
                  </button>
                </div>
              ))}

              <input
                id="teacher-subject-input"
                type="text"
                value={subjectInput}
                onChange={(event) => setSubjectInput(event.target.value)}
                onKeyDown={onSubjectKeyDown}
                onBlur={addSubject}
                placeholder="Type a subject"
              />
            </div>
            <p>Subject tags are currently for UI capture and will be wired to backend assignment in the next API iteration.</p>
          </section>

          {error && <div className="form-message form-message--error">{error}</div>}
          {success && <div className="form-message form-message--success">{success}</div>}

          <footer className="teacher-form-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setFullName("");
                setEmployeeId("");
                setEmail("");
                setPassword("");
                resetOptionalFields();
                setError(null);
                setSuccess(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Teacher"}
            </button>
          </footer>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateTeacher;

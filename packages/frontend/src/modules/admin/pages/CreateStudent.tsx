import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import {
  createStudent,
  listClasses,
  listSections,
} from "../../../api/academics";
import type { SchoolClass, Section } from "../../../api/academics";
import "./CreateStudent.css";

const CreateStudent = () => {
  const [fullName, setFullName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [schoolClassUuid, setSchoolClassUuid] = useState<string>("");
  const [sectionUuid, setSectionUuid] = useState<string>("");

  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianPassword, setGuardianPassword] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    listClasses()
      .then(setClasses)
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    if (!schoolClassUuid) {
      setSections([]);
      return;
    }

    listSections(schoolClassUuid)
      .then(setSections)
      .catch(() => setSections([]));
  }, [schoolClassUuid]);

  const resetForm = () => {
    setFullName("");
    setAdmissionNumber("");
    setParentContact("");
    setSchoolClassUuid("");
    setSectionUuid("");
    setDob("");
    setGender("");
    setGuardianName("");
    setGuardianEmail("");
    setGuardianPassword("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentPassword("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!schoolClassUuid) {
      setError("Please select a class.");
      return;
    }
    if (!sectionUuid) {
      setError("Please select a section.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createStudent({
        full_name: fullName.trim(),
        admission_number: admissionNumber.trim(),
        parent_contact: parentContact.trim() || undefined,
        student_email: studentEmail.trim() || undefined,
        student_phone: studentPhone.trim() || undefined,
        student_password: studentPassword || undefined,
        guardian_name: guardianName.trim() || undefined,
        guardian_email: guardianEmail.trim() || undefined,
        guardian_phone: parentContact.trim() || undefined,
        guardian_password: guardianPassword || undefined,
        school_class_uuid: schoolClassUuid,
        section_uuid: sectionUuid,
      });

      setSuccess("Student created successfully.");
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create Student" variant="admin">
      <div className="student-form-page">
        <header className="student-form-page__header">
          <p>Dashboard / Students / Create</p>
          <h1>Create New Student</h1>
          <p>Enter enrollment, placement, and guardian details.</p>
        </header>

        <form className="student-form-layout" onSubmit={handleSubmit}>
          <section className="student-form-main">
            <article className="student-form-card">
              <div className="student-form-card__head">
                <h2>Student Information</h2>
                <p>Personal details for identification</p>
              </div>

              <div className="student-grid student-grid--two">
                <label className="student-field student-field--full" htmlFor="student-name">
                  <span>Full Name</span>
                  <input
                    id="student-name"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g. Jonathan Doe"
                    required
                  />
                </label>

                <label className="student-field" htmlFor="student-roll">
                  <span>Admission Number</span>
                  <input
                    id="student-roll"
                    type="text"
                    value={admissionNumber}
                    onChange={(event) => setAdmissionNumber(event.target.value)}
                    placeholder="2023001"
                    required
                  />
                </label>

                <label className="student-field" htmlFor="student-dob">
                  <span>Date of Birth</span>
                  <input
                    id="student-dob"
                    type="date"
                    value={dob}
                    onChange={(event) => setDob(event.target.value)}
                  />
                </label>

                <div className="student-field student-field--full">
                  <span>Gender</span>
                  <div className="student-gender-row">
                    {(["Male", "Female", "Other"] as const).map((option) => (
                      <label key={option} className={`student-gender-chip${gender === option ? " is-active" : ""}`}>
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === option}
                          onChange={() => setGender(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="student-form-card">
              <div className="student-form-card__head">
                <h2>Academic Placement</h2>
                <p>Assign class and section</p>
              </div>

              <div className="student-grid student-grid--two">
                <label className="student-field" htmlFor="student-class">
                  <span>Class</span>
                  <select
                    id="student-class"
                    value={schoolClassUuid}
                    onChange={(event) => setSchoolClassUuid(event.target.value)}
                    required
                  >
                    <option value="">Select class</option>
                    {classes.map((item) => (
                      <option key={item.uuid} value={item.uuid}>
                        {item.name} ({item.academic_year})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="student-field" htmlFor="student-section">
                  <span>Section</span>
                  <select
                    id="student-section"
                    value={sectionUuid}
                    onChange={(event) => setSectionUuid(event.target.value)}
                    required
                  >
                    <option value="">Select section</option>
                    {sections.map((item) => (
                      <option key={item.uuid} value={item.uuid}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>

            <article className="student-form-card">
              <div className="student-form-card__head">
                <h2>Student Portal Access</h2>
                <p>Optional. Create credentials for direct student login.</p>
              </div>

              <div className="student-grid student-grid--two">
                <label className="student-field" htmlFor="student-email">
                  <span>Student Email</span>
                  <input
                    id="student-email"
                    type="email"
                    value={studentEmail}
                    onChange={(event) => setStudentEmail(event.target.value)}
                    placeholder="student@school.edu"
                  />
                </label>

                <label className="student-field" htmlFor="student-phone">
                  <span>Student Phone</span>
                  <input
                    id="student-phone"
                    type="tel"
                    value={studentPhone}
                    onChange={(event) => setStudentPhone(event.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </label>

                <label className="student-field student-field--full" htmlFor="student-password">
                  <span>Student Portal Password</span>
                  <input
                    id="student-password"
                    type="password"
                    value={studentPassword}
                    onChange={(event) => setStudentPassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                  />
                </label>
              </div>
            </article>

            <article className="student-form-card">
              <div className="student-form-card__head">
                <h2>Parent/Guardian Contact</h2>
                <p>Emergency details and optional guardian portal access.</p>
              </div>

              <div className="student-grid student-grid--two">
                <label className="student-field student-field--full" htmlFor="guardian-name">
                  <span>Guardian Name</span>
                  <input
                    id="guardian-name"
                    type="text"
                    value={guardianName}
                    onChange={(event) => setGuardianName(event.target.value)}
                    placeholder="Guardian full name"
                  />
                </label>

                <label className="student-field" htmlFor="guardian-phone">
                  <span>Phone Number</span>
                  <input
                    id="guardian-phone"
                    type="tel"
                    value={parentContact}
                    onChange={(event) => setParentContact(event.target.value)}
                    placeholder="+1 (555) 987-6543"
                  />
                </label>

                <label className="student-field" htmlFor="guardian-email">
                  <span>Email Address</span>
                  <input
                    id="guardian-email"
                    type="email"
                    value={guardianEmail}
                    onChange={(event) => setGuardianEmail(event.target.value)}
                    placeholder="guardian@example.com"
                  />
                </label>

                <label className="student-field student-field--full" htmlFor="guardian-password">
                  <span>Guardian Portal Password</span>
                  <input
                    id="guardian-password"
                    type="password"
                    value={guardianPassword}
                    onChange={(event) => setGuardianPassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                  />
                </label>
              </div>
            </article>
          </section>

          <aside className="student-form-side">
            <div className="student-form-side__card">
              <h3>Actions</h3>
              <p>Review required fields before creating the student profile.</p>

              <div className="student-form-side__status">
                <span>Status</span>
                <strong>Active</strong>
              </div>

              <div className="student-form-side__note">
                Student and guardian can log in with either email or phone when portal credentials are provided.
              </div>

              {error && <div className="form-message form-message--error">{error}</div>}
              {success && <div className="form-message form-message--success">{success}</div>}

              <div className="student-form-side__buttons">
                <button type="submit" className="button-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Student"}
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => {
                    resetForm();
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateStudent;

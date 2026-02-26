import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { createSchoolAdmin, listSchools } from "../../../api/schools";
import type { School } from "../../../api/schools";
import "./CreateSchoolAdmin.css";

const CreateSchoolAdmin = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState<number | "">("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    listSchools()
      .then((data) => {
        setSchools(data);
        if (data.length) {
          setSchoolId(data[0].id);
        }
      })
      .catch(() => {
        setSchools([]);
      });
  }, []);

  const selectedSchool = useMemo(
    () => schools.find((school) => school.id === schoolId),
    [schoolId, schools]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!schoolId) {
      setError("Please select a school.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createSchoolAdmin(Number(schoolId), {
        email: email.trim(),
        password,
      });

      setSuccess("School admin created successfully.");
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create School Admin" variant="superAdmin">
      <div className="create-school-admin-page">
        <section className="create-school-admin-page__header">
          <p className="create-school-admin-page__crumbs">Schools / Admins / Create</p>
          <h1>Create School Admin</h1>
          <p>Provision a new administrator account for a specific school tenant.</p>
        </section>

        <form className="create-school-admin-card" onSubmit={handleSubmit}>
          <div className="create-school-admin-grid">
            <label className="create-school-admin-field create-school-admin-field--full" htmlFor="admin-school">
              <span>School</span>
              <select
                id="admin-school"
                value={schoolId}
                onChange={(event) =>
                  setSchoolId(event.target.value ? Number(event.target.value) : "")
                }
                required
              >
                <option value="">Select a school</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </option>
                ))}
              </select>
            </label>

            <label className="create-school-admin-field create-school-admin-field--full" htmlFor="admin-fullname">
              <span>Full Name</span>
              <input
                id="admin-fullname"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="e.g. Jane Doe"
              />
            </label>

            <label className="create-school-admin-field" htmlFor="admin-email">
              <span>Work Email</span>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane.doe@school.edu"
                required
              />
            </label>

            <label className="create-school-admin-field" htmlFor="admin-phone">
              <span>Phone Number</span>
              <input
                id="admin-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </label>

            <label className="create-school-admin-field create-school-admin-field--full" htmlFor="admin-password">
              <span>Temporary Password</span>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </label>

            <div className="create-school-admin-fixed create-school-admin-field--full">
              <span>Assigned School Scope</span>
              <div>{selectedSchool?.name || "No school selected"}</div>
              <p>This admin will only have access to this school’s data.</p>
            </div>
          </div>

          {error && <div className="form-message form-message--error">{error}</div>}
          {success && <div className="form-message form-message--success">{success}</div>}

          <div className="create-school-admin-actions">
            <button type="button" className="button-secondary" onClick={() => {
              setFullName("");
              setEmail("");
              setPhone("");
              setPassword("");
              setError(null);
              setSuccess(null);
            }}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateSchoolAdmin;

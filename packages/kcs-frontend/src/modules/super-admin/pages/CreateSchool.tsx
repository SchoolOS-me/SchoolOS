import { useState } from "react";
import type { ChangeEvent } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { createSchool } from "../../../api/schools";
import "./CreateSchool.css";

type FormState = {
  name: string;
  code: string;
  contact_email: string;
  contact_phone: string;
  address: string;
};

const initialState: FormState = {
  name: "",
  code: "",
  contact_email: "",
  contact_phone: "",
  address: "",
};

const CreateSchool = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createSchool({
        name: form.name.trim(),
        code: form.code.trim(),
        contact_email: form.contact_email.trim() || undefined,
        contact_phone: form.contact_phone.trim() || undefined,
        address: form.address.trim() || undefined,
      });
      setSuccess("School created successfully.");
      setForm(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create school.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="School Management" variant="superAdmin">
      <div className="sa-create-school">
        <div className="sa-create-school__breadcrumbs">
          <span>Dashboard</span>
          <span>/</span>
          <span>Schools</span>
          <span>/</span>
          <strong>Create New</strong>
        </div>

        <div className="sa-create-school__grid">
          <section className="sa-create-school__intro">
            <h1>Create New School</h1>
            <p>
              Register a new institution and provision a dedicated tenant
              environment for its administrators, teachers, and students.
            </p>
            <div className="sa-create-school__note">
              <div className="sa-create-school__noteIcon" aria-hidden="true">i</div>
              <div className="sa-create-school__noteContent">
                <h4>Tenant Provisioning</h4>
                <p>
                  Each school receives its own isolated tenant. Use a unique
                  code for easy identification across the platform.
                </p>
              </div>
            </div>
          </section>

          <section className="sa-create-school__formCard">
            <form onSubmit={handleSubmit}>
              <div className="sa-create-school__row">
                <div className="sa-create-school__field">
                  <label htmlFor="schoolName">School Name</label>
                  <input
                    id="schoolName"
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Springfield High School"
                    required
                  />
                </div>
                <div className="sa-create-school__field">
                  <label htmlFor="schoolCode">School Code</label>
                  <input
                    id="schoolCode"
                    type="text"
                    value={form.code}
                    onChange={handleChange("code")}
                    placeholder="SPF-001"
                    required
                  />
                  <small>Unique identifier used across tenant records.</small>
                </div>
              </div>

              <div className="sa-create-school__row">
                <div className="sa-create-school__field">
                  <label htmlFor="contactEmail">Admin Contact Email</label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={form.contact_email}
                    onChange={handleChange("contact_email")}
                    placeholder="admin@school.edu"
                  />
                </div>
                <div className="sa-create-school__field">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={form.contact_phone}
                    onChange={handleChange("contact_phone")}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="sa-create-school__field">
                <label htmlFor="address">Physical Address</label>
                <textarea
                  id="address"
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder="Street, City, State, Zip"
                  rows={3}
                />
              </div>

              {error && <div className="form-message form-message--error">{error}</div>}
              {success && (
                <div className="form-message form-message--success">{success}</div>
              )}

              <div className="sa-create-school__actions">
                <button type="button" className="button-secondary">
                  Cancel
                </button>
                <button type="submit" className="button-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create School"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateSchool;

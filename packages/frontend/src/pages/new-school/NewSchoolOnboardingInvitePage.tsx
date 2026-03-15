import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createSchoolAdmin } from "../../api/schools";
import ThemedCompleteLogo from "../../components/ui/ThemedCompleteLogo";
import { readOnboardingDraft } from "./onboardingStorage";
import "./NewSchoolFlow.css";

type InviteRow = {
  email: string;
  role: "Teacher" | "School Admin" | "Registrar" | "Counselor";
};

function createTempPassword(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `Sch!${random}9A`;
}

export default function NewSchoolOnboardingInvitePage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<InviteRow[]>([
    { email: "", role: "Teacher" },
    { email: "", role: "School Admin" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const draft = readOnboardingDraft();
    if (!draft?.schoolUuid) {
      navigate("/signup", { replace: true });
    }
  }, [navigate]);

  const updateRow = (index: number, patch: Partial<InviteRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { email: "", role: "Teacher" }]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const draft = readOnboardingDraft();
    if (!draft?.schoolUuid) {
      navigate("/signup", { replace: true });
      return;
    }

    const validRows = rows.map((row) => ({ ...row, email: row.email.trim() })).filter((row) => row.email.length > 0);
    if (validRows.length === 0) {
      navigate("/onboarding/complete");
      return;
    }

    const schoolAdminRows = validRows.filter((row) => row.role === "School Admin");
    const skippedCount = validRows.length - schoolAdminRows.length;

    setIsSubmitting(true);
    try {
      for (const row of schoolAdminRows) {
        await createSchoolAdmin(draft.schoolUuid, {
          email: row.email,
          password: createTempPassword(),
        });
      }

      if (skippedCount > 0) {
        setSuccess(`Added ${schoolAdminRows.length} school admin invite(s). ${skippedCount} non-admin invite(s) are not yet supported by API.`);
      } else {
        setSuccess(`Added ${schoolAdminRows.length} school admin invite(s).`);
      }

      navigate("/onboarding/complete");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not send invites.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ns-page ns-page--flat">
      <header className="ns-authHeader">
        <div className="ns-shell">
          <Link className="ns-brand" to="/">
            <ThemedCompleteLogo />
          </Link>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 700 }}>Step 4 / 5</span>
        </div>
      </header>

      <main className="ns-authMain" style={{ width: "min(820px, 92vw)" }}>
        <div className="ns-progress">
          <div className="ns-progressTop">
            <span>Step 4 of 5</span>
            <span>80% Complete</span>
          </div>
          <div className="ns-progressBar"><span style={{ width: "80%" }} /></div>
        </div>

        <section className="ns-authCard">
          <h1 style={{ marginTop: 0 }}>Invite your staff</h1>
          <p className="ns-help" style={{ marginTop: 0, marginBottom: 16 }}>
            API currently creates School Admin users from this step. Other roles will be available after dashboard setup.
          </p>

          <form className="ns-formGrid" onSubmit={handleSubmit}>
            {rows.map((row, index) => (
              <div className="ns-gridEmailRole" key={`invite-${index}`}>
                <div className="ns-field">
                  <label htmlFor={`staff-email-${index}`}>Email Address</label>
                  <input
                    id={`staff-email-${index}`}
                    type="email"
                    placeholder="staff@school.edu"
                    value={row.email}
                    onChange={(event) => updateRow(index, { email: event.target.value })}
                  />
                </div>
                <div className="ns-field">
                  <label htmlFor={`staff-role-${index}`}>Role</label>
                  <select
                    id={`staff-role-${index}`}
                    value={row.role}
                    onChange={(event) => updateRow(index, { role: event.target.value as InviteRow["role"] })}
                  >
                    <option>Teacher</option>
                    <option>School Admin</option>
                    <option>Registrar</option>
                    <option>Counselor</option>
                  </select>
                </div>
              </div>
            ))}

            <button className="ns-btn ns-btn--ghost" type="button" style={{ justifySelf: "start" }} onClick={addRow}>
              Add another staff member
            </button>

            {error && <div className="ns-alert ns-alert--error">{error}</div>}
            {success && <div className="ns-alert ns-alert--success">{success}</div>}

            <div className="ns-stepActions">
              <Link className="ns-btn ns-btn--ghost" to="/onboarding/academic" style={{ textDecoration: "none" }}>
                Previous
              </Link>
              <div className="ns-stepActionsRight">
                <Link className="ns-btn ns-btn--ghost" to="/onboarding/complete" style={{ textDecoration: "none" }}>
                  I will do this later
                </Link>
                <button className="ns-btn ns-btn--solid" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Invites And Continue"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

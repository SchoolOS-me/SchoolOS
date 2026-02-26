import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { assignSubscription, listSchools } from "../../../api/schools";
import type { School } from "../../../api/schools";
import "./AssignSubscription.css";

const AssignSubscription = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState<number | "">("");
  const [plan, setPlan] = useState<"free" | "monthly" | "yearly">("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    listSchools()
      .then(setSchools)
      .catch(() => setSchools([]));
  }, []);

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
      await assignSubscription(Number(schoolId), { plan });
      setSuccess("Subscription updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Assign Subscription" variant="superAdmin">
      <div className="sa-assign-subscription">
        <header>
          <h1>Assign Subscription</h1>
          <p>Update the active plan for any school tenant.</p>
        </header>

        <form className="sa-assign-subscription__card" onSubmit={handleSubmit}>
          <div className="sa-assign-subscription__field">
            <label htmlFor="schoolSelect">School</label>
            <select
              id="schoolSelect"
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
          </div>

          <div className="sa-assign-subscription__field">
            <label>Plan</label>
            <div className="sa-assign-subscription__plans">
              {[
                { id: "free", label: "Free", detail: "Starter access" },
                { id: "monthly", label: "Monthly", detail: "Billed monthly" },
                { id: "yearly", label: "Yearly", detail: "Billed annually" },
              ].map((option) => (
                <label key={option.id} className="plan-card">
                  <input
                    type="radio"
                    name="plan"
                    value={option.id}
                    checked={plan === option.id}
                    onChange={() => setPlan(option.id as "free" | "monthly" | "yearly")}
                  />
                  <div>
                    <strong>{option.label}</strong>
                    <span>{option.detail}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="form-message form-message--error">{error}</div>}
          {success && (
            <div className="form-message form-message--success">{success}</div>
          )}

          <div className="sa-assign-subscription__actions">
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Subscription"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AssignSubscription;

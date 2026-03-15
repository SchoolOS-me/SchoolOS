import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemedCompleteLogo from "../../components/ui/ThemedCompleteLogo";
import { readOnboardingDraft, saveOnboardingDraft } from "./onboardingStorage";
import "./NewSchoolFlow.css";

export default function NewSchoolOnboardingAcademicPage() {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [medium, setMedium] = useState("English");
  const [grades, setGrades] = useState("");
  const [sections, setSections] = useState("");

  useEffect(() => {
    const draft = readOnboardingDraft();
    if (!draft?.schoolUuid) {
      navigate("/signup", { replace: true });
      return;
    }
    if (draft.academicYear) setAcademicYear(draft.academicYear);
    if (draft.medium) setMedium(draft.medium);
    if (draft.grades) setGrades(draft.grades);
    if (draft.sections) setSections(draft.sections);
  }, [navigate]);

  const handleContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft = readOnboardingDraft();
    if (!draft?.schoolUuid) {
      navigate("/signup", { replace: true });
      return;
    }

    saveOnboardingDraft({
      schoolUuid: draft.schoolUuid,
      academicYear,
      medium,
      grades: grades.trim(),
      sections: sections.trim(),
    });

    navigate("/onboarding/invite");
  };

  return (
    <div className="ns-page ns-page--flat">
      <header className="ns-authHeader">
        <div className="ns-shell">
          <Link className="ns-brand" to="/">
            <ThemedCompleteLogo />
          </Link>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 700 }}>Step 3 / 5</span>
        </div>
      </header>

      <main className="ns-authMain" style={{ width: "min(780px, 92vw)" }}>
        <div className="ns-progress">
          <div className="ns-progressTop">
            <span>Step 3 of 5</span>
            <span>60% Complete</span>
          </div>
          <div className="ns-progressBar"><span style={{ width: "60%" }} /></div>
        </div>

        <section className="ns-authCard">
          <h1 style={{ marginTop: 0 }}>Academic configuration</h1>
          <p className="ns-help" style={{ marginTop: 0, marginBottom: 16 }}>
            Save your session, medium of instruction, grades, and section defaults.
          </p>

          <form className="ns-formGrid" onSubmit={handleContinue}>
            <div className="ns-grid2">
              <div className="ns-field">
                <label htmlFor="year">Academic Year</label>
                <select id="year" value={academicYear} onChange={(event) => setAcademicYear(event.target.value)}>
                  <option>2026-2027</option>
                  <option>2025-2026</option>
                  <option>2024-2025</option>
                </select>
              </div>
              <div className="ns-field">
                <label htmlFor="medium">Medium of Instruction</label>
                <select id="medium" value={medium} onChange={(event) => setMedium(event.target.value)}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Bilingual</option>
                </select>
              </div>
            </div>

            <div className="ns-field">
              <label htmlFor="grades">Available Grades</label>
              <input
                id="grades"
                type="text"
                value={grades}
                onChange={(event) => setGrades(event.target.value)}
                placeholder="e.g. Grade 1, Grade 2, Grade 3"
              />
            </div>

            <div className="ns-field">
              <label htmlFor="sections">Section Names</label>
              <input
                id="sections"
                type="text"
                value={sections}
                onChange={(event) => setSections(event.target.value)}
                placeholder="e.g. A, B, C"
              />
            </div>

            <div className="ns-stepActions">
              <Link className="ns-btn ns-btn--ghost" to="/onboarding/details" style={{ textDecoration: "none" }}>
                Previous
              </Link>
              <div className="ns-stepActionsRight">
                <button className="ns-btn ns-btn--ghost" type="button" onClick={() => {
                  const draft = readOnboardingDraft();
                  if (!draft?.schoolUuid) return;
                  saveOnboardingDraft({ schoolUuid: draft.schoolUuid, academicYear, medium, grades, sections });
                }}>
                  Save Draft
                </button>
                <button className="ns-btn ns-btn--solid" type="submit">
                  Continue to Invite Staff
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

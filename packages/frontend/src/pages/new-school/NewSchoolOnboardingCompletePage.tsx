import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearOnboardingDraft, readOnboardingDraft } from "./onboardingStorage";
import "./NewSchoolFlow.css";

export default function NewSchoolOnboardingCompletePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const draft = readOnboardingDraft();
    if (!draft?.schoolUuid) {
      navigate("/signup", { replace: true });
      return;
    }
    clearOnboardingDraft();
  }, [navigate]);

  return (
    <div className="ns-page ns-page--flat">
      <main className="ns-authMain" style={{ width: "min(760px, 92vw)", paddingTop: 48 }}>
        <section className="ns-authCard ns-complete">
          <div className="ns-authBrand">
            <img src="/logo.svg" alt="SchoolOS icon" />
            <h1>Your SchoolOS workspace is ready</h1>
            <p>Everything is configured. Start managing your school from one secure dashboard.</p>
          </div>

          <div className="ns-stats">
            <div>
              <p>Students</p>
              <strong>0</strong>
            </div>
            <div>
              <p>Classes</p>
              <strong>0</strong>
            </div>
            <div>
              <p>Staff</p>
              <strong>1</strong>
            </div>
          </div>

          <div className="ns-stepActions" style={{ marginTop: 24, justifyContent: "center" }}>
            <Link className="ns-btn ns-btn--solid" to="/login" style={{ textDecoration: "none" }}>
              Go to Dashboard Login
            </Link>
            <Link className="ns-btn ns-btn--ghost" to="/onboarding/invite" style={{ textDecoration: "none" }}>
              Add More Staff
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateSchool } from "../../api/schools";
import ThemedCompleteLogo from "../../components/ui/ThemedCompleteLogo";
import { readOnboardingDraft, saveOnboardingDraft } from "./onboardingStorage";
import "./NewSchoolFlow.css";

export default function NewSchoolOnboardingDetailsPage() {
  const navigate = useNavigate();
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const draft = readOnboardingDraft();
    if (!draft?.schoolUuid) {
      navigate("/signup", { replace: true });
      return;
    }
    setStreet(draft.address || "");
    setCity(draft.city || "");
    setCountry(draft.country || "United States");
    setPhone(draft.phone || "");
    setWebsite(draft.website || "");
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const draft = readOnboardingDraft();
    if (!draft?.schoolUuid) {
      navigate("/signup", { replace: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const address = [street.trim(), city.trim(), country.trim()].filter(Boolean).join(", ");
      await updateSchool(draft.schoolUuid, {
        address,
        contact_phone: phone.trim(),
      });

      saveOnboardingDraft({
        schoolUuid: draft.schoolUuid,
        address: street.trim(),
        city: city.trim(),
        country: country.trim(),
        phone: phone.trim(),
        website: website.trim(),
      });

      navigate("/onboarding/academic");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save school details.");
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
          <Link className="ns-btn ns-btn--ghost" to="/signup">Back</Link>
        </div>
      </header>

      <main className="ns-authMain" style={{ width: "min(760px, 92vw)" }}>
        <div className="ns-progress">
          <div className="ns-progressTop">
            <span>Step 2 of 5</span>
            <span>40% Complete</span>
          </div>
          <div className="ns-progressBar"><span style={{ width: "40%" }} /></div>
        </div>

        <section className="ns-authCard">
          <h1 style={{ marginTop: 0 }}>Tell us about your school</h1>
          <p className="ns-help" style={{ marginTop: 0, marginBottom: 16 }}>
            Add your institution details to configure identity, location, and contact details.
          </p>

          <form className="ns-formGrid" onSubmit={handleSubmit}>
            <div className="ns-field">
              <label htmlFor="street">School Street Address</label>
              <input
                id="street"
                type="text"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                placeholder="123 Education Way"
              />
            </div>

            <div className="ns-grid2">
              <div className="ns-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="San Francisco"
                />
              </div>
              <div className="ns-field">
                <label htmlFor="country">Country</label>
                <select id="country" value={country} onChange={(event) => setCountry(event.target.value)}>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>

            <div className="ns-grid2">
              <div className="ns-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div className="ns-field">
                <label htmlFor="website">School Website</label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="https://school.edu"
                />
              </div>
            </div>

            {error && <div className="ns-alert ns-alert--error">{error}</div>}

            <div className="ns-stepActions">
              <Link className="ns-btn ns-btn--ghost" to="/signup" style={{ textDecoration: "none" }}>
                Previous
              </Link>
              <div className="ns-stepActionsRight">
                <button type="submit" className="ns-btn ns-btn--solid" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Continue to Academic Setup"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

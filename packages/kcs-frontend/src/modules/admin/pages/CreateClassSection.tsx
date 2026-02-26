import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { createClass, createSection, listClasses } from "../../../api/academics";
import type { SchoolClass } from "../../../api/academics";
import "./CreateClassSection.css";

const CreateClassSection = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [className, setClassName] = useState("");
  const [classOrder, setClassOrder] = useState<number | "">("");
  const [sectionName, setSectionName] = useState("");
  const [sectionClassId, setSectionClassId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmittingClass, setIsSubmittingClass] = useState(false);
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);

  const refreshClasses = () => {
    listClasses()
      .then(setClasses)
      .catch(() => setClasses([]));
  };

  useEffect(() => {
    refreshClasses();
  }, []);

  const handleCreateClass = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmittingClass(true);
    setError(null);
    setSuccess(null);

    try {
      await createClass({
        name: className.trim(),
        order: Number(classOrder),
      });
      setSuccess("Class created.");
      setClassName("");
      setClassOrder("");
      refreshClasses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create class.");
    } finally {
      setIsSubmittingClass(false);
    }
  };

  const handleCreateSection = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sectionClassId) {
      setError("Please select a class for the section.");
      return;
    }
    setIsSubmittingSection(true);
    setError(null);
    setSuccess(null);

    try {
      await createSection({
        school_class_id: Number(sectionClassId),
        name: sectionName.trim(),
      });
      setSuccess("Section created.");
      setSectionName("");
      setSectionClassId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create section.");
    } finally {
      setIsSubmittingSection(false);
    }
  };

  return (
    <DashboardLayout title="Create Class & Section" variant="admin">
      <div className="admin-create-class">
        <header>
          <h1>Create Class & Section</h1>
          <p>Define your academic structure for the active year.</p>
        </header>

        <div className="admin-create-class__grid">
          <form className="admin-create-class__card" onSubmit={handleCreateClass}>
            <h2>Create Class</h2>
            <div className="admin-create-class__field">
              <label htmlFor="className">Class Name</label>
              <input
                id="className"
                type="text"
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                placeholder="Grade 5"
                required
              />
            </div>
            <div className="admin-create-class__field">
              <label htmlFor="classOrder">Display Order</label>
              <input
                id="classOrder"
                type="number"
                min={0}
                value={classOrder}
                onChange={(event) =>
                  setClassOrder(event.target.value ? Number(event.target.value) : "")
                }
                placeholder="5"
                required
              />
            </div>
            <button type="submit" className="button-primary" disabled={isSubmittingClass}>
              {isSubmittingClass ? "Creating..." : "Create Class"}
            </button>
          </form>

          <form className="admin-create-class__card" onSubmit={handleCreateSection}>
            <h2>Create Section</h2>
            <div className="admin-create-class__field">
              <label htmlFor="sectionClass">Class</label>
              <select
                id="sectionClass"
                value={sectionClassId}
                onChange={(event) =>
                  setSectionClassId(event.target.value ? Number(event.target.value) : "")
                }
                required
              >
                <option value="">Select Class</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.academic_year})
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-create-class__field">
              <label htmlFor="sectionName">Section Name</label>
              <input
                id="sectionName"
                type="text"
                value={sectionName}
                onChange={(event) => setSectionName(event.target.value)}
                placeholder="A"
                required
              />
            </div>
            <button type="submit" className="button-primary" disabled={isSubmittingSection}>
              {isSubmittingSection ? "Creating..." : "Create Section"}
            </button>
          </form>
        </div>

        {error && <div className="form-message form-message--error">{error}</div>}
        {success && <div className="form-message form-message--success">{success}</div>}
      </div>
    </DashboardLayout>
  );
};

export default CreateClassSection;

import { useId, useState } from "react";

import "./SchoolsTable.css";

type School = {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  subscriptionStatus: "active" | "expired" | "trial";
};

type Props = {
  schools: School[];
};

const IMPORT_TEMPLATES = [
  {
    fileName: "classes-template.csv",
    rows: [
      ["class_name", "class_code", "academic_year"],
      ["Grade 8", "G8", "2026-2027"],
    ],
  },
  {
    fileName: "sections-template.csv",
    rows: [
      ["class_code", "section_name", "class_teacher_email"],
      ["G8", "A", "teacher@school.edu"],
    ],
  },
  {
    fileName: "students-template.csv",
    rows: [
      ["admission_no", "student_name", "class_code", "section_name", "roll_no", "parent_phone"],
      ["ADM-1001", "Aarav Sharma", "G8", "A", "12", "+91 9876543210"],
    ],
  },
  {
    fileName: "teachers-template.csv",
    rows: [
      ["teacher_name", "email", "phone", "subjects", "class_teacher_of"],
      ["Meera Singh", "teacher@school.edu", "+91 9988776655", "Math,Science", "G8-A"],
    ],
  },
] as const;

const SchoolsTable = ({ schools }: Props) => {
  const importInputId = useId();
  const [isImportPanelOpen, setIsImportPanelOpen] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<string>("");

  const handleExport = () => {
    const header = ["School Name", "Admin Name", "Admin Email", "Subscription Status"];
    const rows = schools.map((school) => [
      school.name,
      school.adminName,
      school.adminEmail,
      school.subscriptionStatus,
    ]);

    const toCsvRow = (values: string[]) =>
      values
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(",");

    const csv = [header, ...rows].map(toCsvRow).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "schoolos-schools-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = (fileName: string, rows: readonly (readonly string[])[]) => {
    const csv = rows
      .map((columns) => columns.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTemplateDownload = () => {
    IMPORT_TEMPLATES.forEach((template, index) => {
      window.setTimeout(() => downloadCsv(template.fileName, template.rows), index * 150);
    });
  };

  if (schools.length === 0) {
    return (
      <div className="schoolsEmptyState">
        <h3>No schools added yet</h3>
        <p>
          Start by adding a school and assigning an admin to manage it.
        </p>
        <button className="primaryAction">Add School</button>
      </div>
    );
  }

  return (
    <div className="schoolsTableCard">
      <div className="schoolsTableHeader">
        <h2>Schools Management</h2>
        <div className="schoolsTableActions">
          <button
            type="button"
            className={`tableHeaderButton ${isImportPanelOpen ? "tableHeaderButton--active" : ""}`}
            onClick={() => setIsImportPanelOpen((current) => !current)}
          >
            <span className="tableHeaderIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 20V10m0 0l4 4m-4-4l-4 4M5 4h14" />
              </svg>
            </span>
            Import Excel
          </button>
          <button type="button" className="tableHeaderButton">
            <span className="tableHeaderIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </span>
            Filter
          </button>
          <button type="button" className="tableHeaderButton" onClick={handleExport}>
            <span className="tableHeaderIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 4v10m0 0l-4-4m4 4l4-4M5 20h14" />
              </svg>
            </span>
            Export
          </button>
        </div>
      </div>
      {isImportPanelOpen && (
        <div className="schoolsImportPanel">
          <div className="schoolsImportPanel__intro">
            <div>
              <p className="schoolsImportPanel__eyebrow">Bulk data tools</p>
              <h3>Import classes, students, and staff from Excel</h3>
              <p>
                The design is ready for workbook-based onboarding. Upload a single file with
                tabs for Classes, Sections, Students, and Teachers, or start by exporting current
                records as CSV for your template.
              </p>
            </div>
            <label htmlFor={importInputId} className="schoolsImportPanel__upload">
              <input
                id={importInputId}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(event) => setSelectedImportFile(event.target.files?.[0]?.name || "")}
              />
              <span>Choose Excel File</span>
            </label>
          </div>

          <div className="schoolsImportPanel__grid">
            <article className="schoolsImportCard">
              <span className="schoolsImportCard__label">Sheets</span>
              <strong>Classes, Sections, Students, Teachers</strong>
              <p>One workbook can carry the full school setup in a single import run.</p>
            </article>
            <article className="schoolsImportCard">
              <span className="schoolsImportCard__label">Best flow</span>
              <strong>Export, fill, import</strong>
              <p>Download the existing data first, map your rows, then upload the completed file.</p>
            </article>
            <article className="schoolsImportCard">
              <span className="schoolsImportCard__label">Validation</span>
              <strong>Headers, duplicates, missing fields</strong>
              <p>Backend parsing can validate roll numbers, class mapping, and subscription limits.</p>
            </article>
          </div>

          <div className="schoolsImportPanel__footer">
            <div>
              <span className="schoolsImportPanel__statusLabel">Selected file</span>
              <strong>{selectedImportFile || "No file selected yet"}</strong>
            </div>
            <div className="schoolsImportPanel__footerActions">
              <button
                type="button"
                className="schoolsImportPanel__templateButton"
                onClick={handleTemplateDownload}
              >
                Download Sample Templates
              </button>
              <p className="schoolsImportPanel__hint">
                Templates are ready. The actual Excel parser/API hookup is the next backend step.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="schoolsTableWrapper">
        <table className="schoolsTable">
          <thead>
            <tr>
              <th>School Name</th>
              <th>Admin Name</th>
              <th>Admin Email</th>
              <th>Subscription Status</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id}>
                <td className="cellStrong">{school.name}</td>
                <td>{school.adminName}</td>
                <td>{school.adminEmail}</td>
                <td>
                  <span
                    className={`subscriptionBadge subscription-${school.subscriptionStatus}`}
                  >
                    {school.subscriptionStatus}
                  </span>
                </td>
                <td className="align-right">
                  <button className="tableAction">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="schoolsTableFooter">
        <p>Showing 1 to {schools.length} of 124 schools</p>
        <div className="pagination">
          <button type="button" className="paginationButton" disabled>
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M14 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="paginationButton">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M10 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolsTable;

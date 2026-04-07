import { useId, useMemo, useState } from "react";

import {
  bulkImportSchoolData,
  type BulkImportPayload,
  type BulkImportResponse,
} from "../../../api/schools";
import "./SchoolsTable.css";

type School = {
  id: string;
  uuid: string;
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
      ["class_name", "class_code", "academic_year", "order"],
      ["Grade 8", "G8", "2026-2027", "8"],
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

const EMPTY_PAYLOAD: BulkImportPayload = {
  classes: [],
  sections: [],
  students: [],
  teachers: [],
};

const SchoolsTable = ({ schools }: Props) => {
  const importInputId = useId();
  const [isImportPanelOpen, setIsImportPanelOpen] = useState(false);
  const [selectedSchoolUuid, setSelectedSchoolUuid] = useState<string>(schools[0]?.uuid || "");
  const [selectedImportFiles, setSelectedImportFiles] = useState<File[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importResult, setImportResult] = useState<BulkImportResponse | null>(null);

  const selectedFileLabel = useMemo(() => {
    if (!selectedImportFiles.length) {
      return "No files selected yet";
    }
    return selectedImportFiles.map((file) => file.name).join(", ");
  }, [selectedImportFiles]);

  const selectedSchoolName =
    schools.find((school) => school.uuid === selectedSchoolUuid)?.name || schools[0]?.name || "this school";

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

  const parseCsvText = (text: string) => {
    const rows: string[][] = [];
    let currentValue = "";
    let currentRow: string[] = [];
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const nextChar = text[index + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentValue += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === "," && !inQuotes) {
        currentRow.push(currentValue.trim());
        currentValue = "";
        continue;
      }

      if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") {
          index += 1;
        }
        currentRow.push(currentValue.trim());
        if (currentRow.some((value) => value.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentValue = "";
        continue;
      }

      currentValue += char;
    }

    if (currentValue.length > 0 || currentRow.length > 0) {
      currentRow.push(currentValue.trim());
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  const toPayloadRows = (rows: string[][]) => {
    const [headerRow, ...dataRows] = rows;
    if (!headerRow) {
      return [];
    }

    const headers = headerRow.map((value) => value.trim());
    return dataRows
      .filter((columns) => columns.some((value) => value.trim().length > 0))
      .map((columns) =>
        headers.reduce<Record<string, string>>((record, header, index) => {
          record[header] = (columns[index] || "").trim();
          return record;
        }, {})
      );
  };

  const detectImportGroup = (fileName: string) => {
    const normalized = fileName.toLowerCase();
    if (normalized.includes("class")) {
      return "classes" as const;
    }
    if (normalized.includes("section")) {
      return "sections" as const;
    }
    if (normalized.includes("student")) {
      return "students" as const;
    }
    if (normalized.includes("teacher") || normalized.includes("staff")) {
      return "teachers" as const;
    }
    return null;
  };

  const buildImportPayload = async (files: File[]): Promise<BulkImportPayload> => {
    const payload: BulkImportPayload = { ...EMPTY_PAYLOAD };

    for (const file of files) {
      const importGroup = detectImportGroup(file.name);
      if (!importGroup) {
        throw new Error(`Could not map file "${file.name}" to classes, sections, students, or teachers.`);
      }
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error(`"${file.name}" is not supported yet. Please upload CSV template files.`);
      }

      const text = await file.text();
      const rows = parseCsvText(text);
      if (!rows.length) {
        continue;
      }
      payload[importGroup] = toPayloadRows(rows);
    }

    return payload;
  };

  const handleImport = async () => {
    if (!selectedSchoolUuid) {
      setImportError("Choose a school before importing.");
      return;
    }

    if (!selectedImportFiles.length) {
      setImportError("Select at least one CSV file to import.");
      return;
    }

    setIsImporting(true);
    setImportError("");
    setImportResult(null);

    try {
      const payload = await buildImportPayload(selectedImportFiles);
      const totalRows =
        payload.classes.length +
        payload.sections.length +
        payload.students.length +
        payload.teachers.length;

      if (totalRows === 0) {
        throw new Error("No import rows were found in the selected files.");
      }

      const response = await bulkImportSchoolData(selectedSchoolUuid, payload);
      setImportResult(response);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Import failed.");
    } finally {
      setIsImporting(false);
    }
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
            Import Data
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
              <h3>Import classes, students, and staff into one school</h3>
              <p>
                Download the CSV templates, fill them in, then upload the completed files together.
                The importer creates classes first, then sections, students, and teachers for the
                selected school.
              </p>
            </div>
            <label htmlFor={importInputId} className="schoolsImportPanel__upload">
              <input
                id={importInputId}
                type="file"
                accept=".csv,.xlsx,.xls"
                multiple
                onChange={(event) => {
                  setSelectedImportFiles(Array.from(event.target.files || []));
                  setImportError("");
                  setImportResult(null);
                }}
              />
              <span>Choose Import Files</span>
            </label>
          </div>

          <div className="schoolsImportPanel__grid">
            <article className="schoolsImportCard">
              <span className="schoolsImportCard__label">Order</span>
              <strong>Classes, Sections, Students, Teachers</strong>
              <p>The importer resolves dependencies automatically and reports any skipped rows.</p>
            </article>
            <article className="schoolsImportCard">
              <span className="schoolsImportCard__label">Best flow</span>
              <strong>Download, fill, import</strong>
              <p>Use the provided filenames so the importer can classify each CSV correctly.</p>
            </article>
            <article className="schoolsImportCard">
              <span className="schoolsImportCard__label">Validation</span>
              <strong>Duplicates, references, missing fields</strong>
              <p>Each import returns created, updated, skipped, and first-error feedback.</p>
            </article>
          </div>

          <div className="schoolsImportPanel__footer">
            <div className="schoolsImportPanel__statusBlock">
              <span className="schoolsImportPanel__statusLabel">Import into</span>
              <label className="schoolsImportPanel__selectWrap">
                <select
                  value={selectedSchoolUuid}
                  onChange={(event) => setSelectedSchoolUuid(event.target.value)}
                >
                  {schools.map((school) => (
                    <option key={school.uuid} value={school.uuid}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="schoolsImportPanel__statusBlock">
              <span className="schoolsImportPanel__statusLabel">Selected files</span>
              <strong>{selectedFileLabel}</strong>
            </div>
            <div className="schoolsImportPanel__footerActions">
              <div className="schoolsImportPanel__buttonRow">
                <button
                  type="button"
                  className="schoolsImportPanel__templateButton"
                  onClick={handleTemplateDownload}
                >
                  Download Sample Templates
                </button>
                <button
                  type="button"
                  className="schoolsImportPanel__templateButton schoolsImportPanel__templateButton--primary"
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  {isImporting ? "Importing..." : "Run Import"}
                </button>
              </div>
              <p className="schoolsImportPanel__hint">
                CSV import is live for {selectedSchoolName}. `.xlsx` workbook parsing can be added next.
              </p>
              {importError && <p className="schoolsImportPanel__error">{importError}</p>}
              {importResult && (
                <div className="schoolsImportPanel__result">
                  <strong>{importResult.detail}</strong>
                  <p>
                    Created: classes {importResult.summary.classes.created}, sections{" "}
                    {importResult.summary.sections.created}, students{" "}
                    {importResult.summary.students.created}, teachers{" "}
                    {importResult.summary.teachers.created}
                  </p>
                  <p>
                    Updated: {importResult.summary.classes.updated + importResult.summary.sections.updated + importResult.summary.students.updated + importResult.summary.teachers.updated}
                    {" · "}
                    Skipped: {importResult.summary.classes.skipped + importResult.summary.sections.skipped + importResult.summary.students.skipped + importResult.summary.teachers.skipped}
                  </p>
                  {!!importResult.errors.length && (
                    <p>
                      First issue: {importResult.errors[0].group} row {importResult.errors[0].row} -{" "}
                      {importResult.errors[0].detail}
                    </p>
                  )}
                </div>
              )}
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
                  <button
                    className="tableAction"
                    type="button"
                    onClick={() => {
                      setSelectedSchoolUuid(school.uuid);
                      setIsImportPanelOpen(true);
                    }}
                  >
                    Import Here
                  </button>
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

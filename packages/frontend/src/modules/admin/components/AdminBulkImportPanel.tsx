import { useId, useMemo, useState } from "react";
import {
  importCurrentSchoolFile,
  previewCurrentSchoolImport,
  type BulkImportResponse,
  type ImportGroup,
  type ImportPreviewResponse,
} from "../../../api/schools";
import "./AdminBulkImportPanel.css";

type TemplateConfig = {
  fileName: string;
  rows: string[][];
};

type Props = {
  title: string;
  description: string;
  importGroup: ImportGroup;
  templates: TemplateConfig[];
};

function downloadCsv(fileName: string, rows: readonly (readonly string[])[]) {
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
}

export default function AdminBulkImportPanel({ title, description, importGroup, templates }: Props) {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<BulkImportResponse | null>(null);
  const [error, setError] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const canImport = useMemo(
    () => !!preview && preview.required_fields.every((field) => !!mapping[field]),
    [mapping, preview]
  );

  const handleTemplateDownload = () => {
    templates.forEach((template, index) => {
      window.setTimeout(() => downloadCsv(template.fileName, template.rows), index * 150);
    });
  };

  const handlePreview = async () => {
    if (!selectedFile) {
      setError("Choose a CSV or XLSX file first.");
      return;
    }
    setError("");
    setResult(null);
    setIsPreviewing(true);
    try {
      const data = await previewCurrentSchoolImport(importGroup, selectedFile);
      setPreview(data);
      setMapping((current) =>
        data.required_fields.reduce<Record<string, string>>((next, field) => {
          next[field] = current[field] || data.headers.find((header) => header === field) || "";
          return next;
        }, {})
      );
    } catch (err) {
      setPreview(null);
      setMapping({});
      setError(err instanceof Error ? err.message : "Unable to preview this file.");
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !canImport) {
      setError("Map all required fields before importing.");
      return;
    }
    setError("");
    setResult(null);
    setIsImporting(true);
    try {
      const data = await importCurrentSchoolFile(importGroup, selectedFile, mapping);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <section className="admin-import-panel">
      <div className="admin-import-panel__header">
        <div>
          <p className="admin-import-panel__eyebrow">Bulk Upload</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="admin-import-panel__actions">
          <button type="button" className="button-secondary" onClick={handleTemplateDownload}>
            Download Sample
          </button>
          <label htmlFor={inputId} className="button-secondary admin-import-panel__fileButton">
            Choose File
            <input
              id={inputId}
              type="file"
              accept=".csv,.xlsx"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] || null);
                setPreview(null);
                setResult(null);
                setError("");
              }}
            />
          </label>
          <button type="button" className="button-primary" onClick={handlePreview} disabled={isPreviewing}>
            {isPreviewing ? "Reading..." : "Preview Fields"}
          </button>
        </div>
      </div>

      <div className="admin-import-panel__meta">
        <span>Selected file</span>
        <strong>{selectedFile?.name || "No file selected"}</strong>
      </div>

      {preview ? (
        <div className="admin-import-panel__mapping">
          <div className="admin-import-panel__meta">
            <span>Rows found</span>
            <strong>{preview.row_count}</strong>
          </div>
          <div className="admin-import-panel__mapGrid">
            {preview.required_fields.map((field) => (
              <label key={field} className="admin-import-panel__field">
                <span>{field}</span>
                <select
                  value={mapping[field] || ""}
                  onChange={(event) =>
                    setMapping((current) => ({ ...current, [field]: event.target.value }))
                  }
                >
                  <option value="">Select column</option>
                  {preview.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button type="button" className="button-primary" onClick={handleImport} disabled={!canImport || isImporting}>
            {isImporting ? "Importing..." : "Run Import"}
          </button>
        </div>
      ) : null}

      {error ? <p className="form-message form-message--error">{error}</p> : null}
      {result ? (
        <div className="form-message form-message--success">
          <strong>{result.detail}</strong>
          <div>
            Created: classes {result.summary.classes.created}, sections {result.summary.sections.created}, students{" "}
            {result.summary.students.created}, teachers {result.summary.teachers.created}
          </div>
          {!!result.errors.length && <div>First issue: {result.errors[0].detail}</div>}
        </div>
      ) : null}
    </section>
  );
}

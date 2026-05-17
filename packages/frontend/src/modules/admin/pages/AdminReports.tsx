import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { listClasses, listStudents, listTeachers, type SchoolClass, type Student, type Teacher } from "../../../api/academics";
import { fetchFeeReport, type FeeReport } from "../../../api/finances";
import "./AdminReports.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function downloadCsv(fileName: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [feeReport, setFeeReport] = useState<FeeReport | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listStudents(), listTeachers(), listClasses(), fetchFeeReport()])
      .then(([studentData, teacherData, classData, feeData]) => {
        setStudents(studentData);
        setTeachers(teacherData);
        setClasses(classData);
        setFeeReport(feeData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."));
  }, []);

  const studentsByClass = useMemo(() => {
    return students.reduce<Record<string, number>>((acc, student) => {
      const key = `${student.class_name}-${student.section_name}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [students]);

  const handleExport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Students", String(students.length)],
      ["Teachers", String(teachers.length)],
      ["Classes", String(classes.length)],
      ["Receipts", String(feeReport?.payment_count || 0)],
      ["Cash Collected", String(feeReport?.cash_collected || 0)],
    ];
    downloadCsv("schoolos-admin-report.csv", rows);
  };

  return (
    <DashboardLayout title="Reports" variant="admin">
      <div className="admin-reports-page">
        <header className="admin-reports-page__header">
          <p>Dashboard / Reports</p>
          <h1>School Reports</h1>
          <p>Review operational totals and recent fee collections.</p>
        </header>

        {error ? <p className="form-message form-message--error">{error}</p> : null}

        <section className="admin-reports-toolbar">
          <button type="button" className="button-secondary" onClick={handleExport}>
            Export CSV
          </button>
        </section>

        <section className="admin-reports-grid">
          <article>
            <span>Students</span>
            <strong>{students.length}</strong>
          </article>
          <article>
            <span>Teachers</span>
            <strong>{teachers.length}</strong>
          </article>
          <article>
            <span>Classes</span>
            <strong>{classes.length}</strong>
          </article>
          <article>
            <span>Cash Collected</span>
            <strong>{currency.format(Number(feeReport?.cash_collected || 0))}</strong>
          </article>
        </section>

        <div className="admin-reports-layout">
          <section className="admin-reports-card">
            <div className="admin-reports-card__head">
              <h2>Students by Class</h2>
            </div>
            <div className="admin-reports-list">
              {Object.entries(studentsByClass).map(([label, count]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              ))}
              {!students.length ? <p>No students found.</p> : null}
            </div>
          </section>

          <section className="admin-reports-card">
            <div className="admin-reports-card__head">
              <h2>Recent Fee Receipts</h2>
            </div>
            <div className="admin-reports-list">
              {feeReport?.latest_payments.map((payment) => (
                <div key={payment.uuid}>
                  <span>{payment.receipt_number} · {payment.student_name}</span>
                  <strong>{currency.format(Number(payment.amount || 0))}</strong>
                </div>
              ))}
              {!feeReport?.latest_payments.length ? <p>No receipts generated yet.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

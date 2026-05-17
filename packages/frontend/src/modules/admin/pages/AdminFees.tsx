import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { listStudents, type Student } from "../../../api/academics";
import { createFeePayment, listFeePayments, type FeePayment } from "../../../api/finances";
import "./AdminFees.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatCurrency(value: string | number) {
  return currency.format(Number(value || 0));
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminFees() {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [studentUuid, setStudentUuid] = useState("");
  const [feeTitle, setFeeTitle] = useState("Tuition Fee");
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState(todayDate());
  const [notes, setNotes] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedStudent = useMemo(
    () => students.find((student) => student.uuid === studentUuid) || null,
    [studentUuid, students]
  );

  const totalCollected = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  );

  useEffect(() => {
    Promise.all([listStudents(), listFeePayments()])
      .then(([studentData, paymentData]) => {
        setStudents(studentData);
        setPayments(paymentData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load fee data."));
  }, []);

  const resetForm = () => {
    setStudentUuid("");
    setFeeTitle("Tuition Fee");
    setAmount("");
    setPaidOn(todayDate());
    setNotes("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!studentUuid || !amount) {
      setError("Select a student and enter the amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payment = await createFeePayment({
        student_uuid: studentUuid,
        fee_title: feeTitle.trim() || "Fee Payment",
        amount,
        payment_mode: "cash",
        paid_on: paidOn,
        notes: notes.trim(),
      });
      setPayments((current) => [payment, ...current]);
      setSelectedReceipt(payment);
      setSuccess(`Receipt ${payment.receipt_number} generated.`);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Fees" variant="admin">
      <div className="admin-fees-page">
        <header className="admin-fees-page__header">
          <p>Dashboard / Fees</p>
          <h1>Fee Payments</h1>
          <p>Record cash payments and generate receipts for students.</p>
        </header>

        <section className="admin-fees-summary">
          <div>
            <span>Total cash collected</span>
            <strong>{formatCurrency(totalCollected)}</strong>
          </div>
          <div>
            <span>Receipts generated</span>
            <strong>{payments.length}</strong>
          </div>
          <div>
            <span>Payment mode</span>
            <strong>Cash</strong>
          </div>
        </section>

        <div className="admin-fees-layout">
          <form className="admin-fees-card admin-fees-form" onSubmit={handleSubmit}>
            <div className="admin-fees-card__head">
              <h2>New Receipt</h2>
              <p>Online payment modes can be added later; this flow records cash only.</p>
            </div>

            <label>
              <span>Student</span>
              <select value={studentUuid} onChange={(event) => setStudentUuid(event.target.value)} required>
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.uuid} value={student.uuid}>
                    {student.full_name} · {student.admission_number} · {student.class_name}-{student.section_name}
                  </option>
                ))}
              </select>
            </label>

            {selectedStudent ? (
              <div className="admin-fees-student">
                <strong>{selectedStudent.full_name}</strong>
                <span>
                  Admission {selectedStudent.admission_number} · {selectedStudent.class_name}-{selectedStudent.section_name}
                </span>
              </div>
            ) : null}

            <label>
              <span>Fee title</span>
              <input value={feeTitle} onChange={(event) => setFeeTitle(event.target.value)} required />
            </label>

            <label>
              <span>Amount</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                required
              />
            </label>

            <label>
              <span>Paid on</span>
              <input type="date" value={paidOn} onChange={(event) => setPaidOn(event.target.value)} required />
            </label>

            <label>
              <span>Notes</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
            </label>

            {error ? <p className="form-message form-message--error">{error}</p> : null}
            {success ? <p className="form-message form-message--success">{success}</p> : null}

            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Generate Cash Receipt"}
            </button>
          </form>

          <section className="admin-fees-card admin-fees-receipt">
            <div className="admin-fees-card__head">
              <h2>Receipt Preview</h2>
              <button type="button" className="button-secondary" onClick={() => window.print()} disabled={!selectedReceipt}>
                Print
              </button>
            </div>

            {selectedReceipt ? (
              <div className="fee-receipt" id="fee-receipt">
                <div className="fee-receipt__top">
                  <div>
                    <span>Receipt</span>
                    <strong>{selectedReceipt.receipt_number}</strong>
                  </div>
                  <div>
                    <span>Date</span>
                    <strong>{selectedReceipt.paid_on}</strong>
                  </div>
                </div>
                <h3>Fee Payment Receipt</h3>
                <dl>
                  <div><dt>Student</dt><dd>{selectedReceipt.student_name}</dd></div>
                  <div><dt>Admission No.</dt><dd>{selectedReceipt.admission_number}</dd></div>
                  <div><dt>Class</dt><dd>{selectedReceipt.class_name}-{selectedReceipt.section_name}</dd></div>
                  <div><dt>Fee</dt><dd>{selectedReceipt.fee_title}</dd></div>
                  <div><dt>Payment Mode</dt><dd>Cash</dd></div>
                  <div><dt>Amount Paid</dt><dd>{formatCurrency(selectedReceipt.amount)}</dd></div>
                </dl>
                {selectedReceipt.notes ? <p>{selectedReceipt.notes}</p> : null}
                <div className="fee-receipt__sign">
                  <span>Received by</span>
                  <strong>{selectedReceipt.received_by_email || "School Admin"}</strong>
                </div>
              </div>
            ) : (
              <div className="admin-fees-empty">Generate or select a receipt to preview it here.</div>
            )}
          </section>
        </div>

        <section className="admin-fees-card">
          <div className="admin-fees-card__head">
            <h2>Recent Receipts</h2>
          </div>
          <div className="admin-fees-table">
            {payments.map((payment) => (
              <button key={payment.uuid} type="button" onClick={() => setSelectedReceipt(payment)}>
                <span>{payment.receipt_number}</span>
                <span>{payment.student_name}</span>
                <span>{payment.fee_title}</span>
                <strong>{formatCurrency(payment.amount)}</strong>
              </button>
            ))}
            {!payments.length ? <div className="admin-fees-empty">No fee receipts yet.</div> : null}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

import { apiFetch } from "./client";

export type FeePayment = {
  uuid: string;
  receipt_number: string;
  student_uuid: string;
  student_name: string;
  admission_number: string;
  class_name: string;
  section_name: string;
  fee_title: string;
  amount: string;
  payment_mode: "cash";
  paid_on: string;
  received_by_email: string | null;
  notes: string;
  created_at: string;
};

export type CreateFeePaymentPayload = {
  student_uuid: string;
  fee_title: string;
  amount: string;
  payment_mode: "cash";
  paid_on?: string;
  notes?: string;
};

export type FeeReport = {
  total_collected: string;
  payment_count: number;
  cash_collected: string;
  latest_payments: FeePayment[];
};

export function listFeePayments() {
  return apiFetch<FeePayment[]>("/finances/admin/fee-payments/");
}

export function createFeePayment(payload: CreateFeePaymentPayload) {
  return apiFetch<FeePayment>("/finances/admin/fee-payments/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchFeeReport() {
  return apiFetch<FeeReport>("/finances/admin/reports/fees/");
}

import { useState } from "react";

/* --------------------------------------------------------------------------
   Order edit forms — replace the old window.prompt() UX with proper fields.
   Each form keeps local state seeded from the order and calls onSubmit(values).
   -------------------------------------------------------------------------- */

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#334155",
  fontSize: "13px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
};

const actionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const saveBtnStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#635bff",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
};

const cancelBtnStyle = {
  padding: "10px 20px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  background: "#fff",
  color: "#334155",
  fontWeight: "600",
  cursor: "pointer",
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

/* ------------------------------ Delivery ------------------------------ */

export function DeliveryForm({ order, submitting, onSubmit, onCancel }) {
  const [expectedDate, setExpectedDate] = useState(
    order.delivery?.expectedDate
      ? new Date(order.delivery.expectedDate).toISOString().slice(0, 10)
      : ""
  );
  const [address, setAddress] = useState(order.delivery?.address || "");
  const [notes, setNotes] = useState(order.delivery?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      expectedDate: expectedDate || undefined,
      address,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Expected Delivery Date">
        <input
          type="date"
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
          style={inputStyle}
        />
      </Field>

      <Field label="Delivery Address">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Shipping address"
          style={inputStyle}
        />
      </Field>

      <Field label="Notes">
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any delivery notes..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </Field>

      <div style={actionsStyle}>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} style={saveBtnStyle}>
          {submitting ? "Saving..." : "Save Delivery"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------ Shipment ------------------------------ */

const SHIPMENT_MILESTONES = [
  "Picked up",
  "In transit",
  "Out for delivery",
  "Customs clearance",
  "Delivered",
];

export function ShipmentForm({ order, submitting, onSubmit, onCancel }) {
  const [carrier, setCarrier] = useState(order.shipment?.carrier || "");
  const [trackingNumber, setTrackingNumber] = useState(
    order.shipment?.trackingNumber || ""
  );
  const [milestone, setMilestone] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      carrier,
      trackingNumber,
      status: milestone || undefined,
      location: location || undefined,
      note: note || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Carrier">
        <input
          type="text"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          placeholder="e.g. DHL, FedEx, Aramex"
          style={inputStyle}
        />
      </Field>

      <Field label="Tracking Number">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Tracking / consignment number"
          style={inputStyle}
        />
      </Field>

      <Field label="Add Timeline Event">
        <select
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          style={inputStyle}
        >
          <option value="">— Don't add an event —</option>
          {SHIPMENT_MILESTONES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      {milestone && (
        <>
          <Field label="Location">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Karachi, Pakistan"
              style={inputStyle}
            />
          </Field>

          <Field label="Event Note">
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note about this event..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
        </>
      )}

      <div style={actionsStyle}>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} style={saveBtnStyle}>
          {submitting ? "Saving..." : "Save Shipment"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------- Invoice ------------------------------ */

const INVOICE_STATUSES = ["pending", "issued", "paid", "cancelled"];

export function InvoiceForm({ order, submitting, onSubmit, onCancel }) {
  const [invoiceNumber, setInvoiceNumber] = useState(
    order.invoice?.invoiceNumber || ""
  );
  const [amount, setAmount] = useState(
    order.invoice?.amount != null ? String(order.invoice.amount) : ""
  );
  const [status, setStatus] = useState(order.invoice?.status || "pending");
  const [issuedAt, setIssuedAt] = useState(
    order.invoice?.issuedAt
      ? new Date(order.invoice.issuedAt).toISOString().slice(0, 10)
      : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      invoiceNumber,
      amount: amount ? Number(amount) : undefined,
      status,
      issuedAt: issuedAt || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Invoice Number">
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="e.g. INV-2026-0001"
          style={inputStyle}
        />
      </Field>

      <Field label="Amount ($)">
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Invoice amount"
          style={inputStyle}
        />
      </Field>

      <Field label="Status">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          {INVOICE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Issued Date">
        <input
          type="date"
          value={issuedAt}
          onChange={(e) => setIssuedAt(e.target.value)}
          style={inputStyle}
        />
      </Field>

      <div style={actionsStyle}>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} style={saveBtnStyle}>
          {submitting ? "Saving..." : "Save Invoice"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------- Payment ------------------------------ */

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
const PAYMENT_METHODS = [
  "",
  "Bank Transfer",
  "Credit Card",
  "PayPal",
  "Cheque",
  "Wire Transfer",
];

export function PaymentForm({ order, submitting, onSubmit, onCancel, onProcessPayment, processing }) {
  const [status, setStatus] = useState(order.payment?.status || "pending");
  const [method, setMethod] = useState(order.payment?.method || "");
  const [transactionId, setTransactionId] = useState(
    order.payment?.transactionId || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      status,
      method,
      transactionId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Payment Status">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Payment Method">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={inputStyle}
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m || "Select a method"}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Transaction ID">
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Payment reference / transaction ID"
          style={inputStyle}
        />
      </Field>

      {onProcessPayment && (
        <div
          style={{
            marginTop: "18px",
            paddingTop: "18px",
            borderTop: "1px dashed #cbd5e1",
          }}
        >
          <button
            type="button"
            onClick={onProcessPayment}
            disabled={processing}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: "#059669",
              color: "#fff",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {processing ? "Processing payment..." : "Pay Now with Card"}
          </button>
          <p style={{ color: "#64748b", fontSize: "12px", marginTop: "8px" }}>
            Creates a secure Stripe payment intent. When no Stripe key is
            configured, a simulated transaction is recorded so the flow stays
            testable.
          </p>
        </div>
      )}

      <div style={actionsStyle}>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} style={saveBtnStyle}>
          {submitting ? "Saving..." : "Save Payment"}
        </button>
      </div>
    </form>
  );
}

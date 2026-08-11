import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrders,
  createOrderFromQuote,
  initiatePayment,
  updateOrderStatus,
  updateDelivery,
  updateShipment,
  updateInvoice,
  updatePayment,
} from "../services/orderservice";
import OrderModal from "../components/orders/OrderModal";
import {
  DeliveryForm,
  ShipmentForm,
  InvoiceForm,
  PaymentForm,
} from "../components/orders/OrderEditForms";
import { downloadInvoicePdf } from "../components/orders/invoicePdfService";

const STATUS_TRANSITIONS = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const OrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");
  const [modal, setModal] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [createError, setCreateError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = storedUser?.role?.toLowerCase() || "buyer";

  const handleCreateOrder = async (e) => {
    e?.preventDefault?.();
    if (!quoteId.trim()) {
      setCreateError("Please paste an accepted Quote ID.");
      return;
    }

    try {
      setModalSubmitting(true);
      setCreateError("");

      await createOrderFromQuote(quoteId.trim());

      setCreateOpen(false);
      setQuoteId("");
      await loadOrders();
    } catch (err) {
      setCreateError(err.message || "Failed to create order");
    } finally {
      setModalSubmitting(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data.orders || data.data || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setSaving(orderId);
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setSaving("");
    }
  };

  const openModal = (type, order) => setModal({ type, order });
  const closeModal = () => {
    if (modalSubmitting) return;
    setModal(null);
  };

  const handleSubmit = async (values) => {
    const order = modal?.order;
    if (!order) return;

    try {
      setModalSubmitting(true);
      setError("");

      if (modal.type === "delivery") {
        await updateDelivery(order._id, values);
      } else if (modal.type === "shipment") {
        await updateShipment(order._id, values);
      } else if (modal.type === "invoice") {
        await updateInvoice(order._id, values);
      } else if (modal.type === "payment") {
        await updatePayment(order._id, values);
      }

      setModal(null);
      await loadOrders();
    } catch (err) {
      setError(err.message || "Failed to save changes");
    } finally {
      setModalSubmitting(false);
    }
  };

  const handlePayNow = async (order) => {
    try {
      setModalSubmitting(true);
      setError("");

      const result = await initiatePayment(order._id);

      await updatePayment(order._id, {
        status: "paid",
        method: "card",
        transactionId:
          result.transactionId || `SIM-${Date.now().toString().slice(-8)}`,
      });

      setModal(null);
      await loadOrders();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      await downloadInvoicePdf(order);
    } catch (err) {
      setError(err.message || "Failed to generate invoice PDF");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", fontSize: "18px" }}>
        Loading orders...
      </div>
    );
  }

  const quotesPath = role === "vendor" ? "/vendor/quotes" : "/buyer/quotes";

  return (
    <div
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            Order Management
          </h1>

          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Manage purchase orders, delivery, shipments, invoices and payments.
          </p>
        </div>

        {role === "buyer" && (
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              padding: "12px 22px",
              border: "none",
              borderRadius: "10px",
              background: "#635bff",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            + New Purchase Order
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: "20px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "10px",
          }}
        >
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "60px 30px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#111827" }}>No orders found</h2>

          <p style={{ color: "#64748b" }}>
            Orders will appear here when an accepted quote is converted into
            an order.
          </p>

          {role === "buyer" && (
            <button
              onClick={() => navigate(quotesPath)}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                border: "none",
                borderRadius: "10px",
                background: "#635bff",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              View Accepted Quotes
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "24px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, color: "#111827" }}>
                    {order.orderNumber || `Order #${order._id?.slice(-6)}`}
                  </h2>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#64748b",
                    }}
                  >
                    {role === "vendor" ? "Buyer" : "Vendor"}:{" "}
                    {role === "vendor"
                      ? order.buyer?.name || "N/A"
                      : order.vendor?.name || "N/A"}
                  </p>
                </div>

                <select
                  value={order.status}
                  disabled={saving === order._id}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontWeight: "600",
                  }}
                >
                  <option value={order.status}>
                    {STATUS_LABELS[order.status] || order.status}
                  </option>
                  {(STATUS_TRANSITIONS[order.status] || []).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              {/* ORDER INFO */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "25px",
                }}
              >
                <Info
                  title="Total"
                  value={`$${Number(order.total || 0).toFixed(2)}`}
                />

                <Info
                  title="Expected Delivery"
                  value={
                    order.delivery?.expectedDate
                      ? new Date(
                          order.delivery.expectedDate
                        ).toLocaleDateString()
                      : "Not set"
                  }
                />

                <Info
                  title="Payment"
                  value={order.payment?.status || "pending"}
                />

                <Info
                  title="Invoice"
                  value={
                    order.invoice?.invoiceNumber || "Not issued"
                  }
                />
              </div>

              {/* ITEMS */}
              <section style={sectionStyle}>
                <h3>Order Items</h3>

                {order.items?.length ? (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <strong>
                        {item.productName || "Product"}
                      </strong>{" "}
                      × {item.quantity} — $
                      {Number(item.unitPrice || 0).toFixed(2)}
                    </div>
                  ))
                ) : (
                  <p>No items available.</p>
                )}
              </section>

              {/* DELIVERY */}
              <section style={sectionStyle}>
                <h3>Delivery Information</h3>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.delivery?.address || "Not provided"}
                </p>

                <p>
                  <strong>Notes:</strong>{" "}
                  {order.delivery?.notes || "No notes"}
                </p>

                <button
                  onClick={() => openModal("delivery", order)}
                  disabled={saving === order._id}
                  style={buttonStyle}
                >
                  Update Delivery
                </button>
              </section>

              {/* SHIPMENT */}
              <section style={sectionStyle}>
                <h3>Shipment</h3>

                <p>
                  <strong>Carrier:</strong>{" "}
                  {order.shipment?.carrier || "Not assigned"}
                </p>

                <p>
                  <strong>Tracking:</strong>{" "}
                  {order.shipment?.trackingNumber ||
                    "Not available"}
                </p>

                <button
                  onClick={() => openModal("shipment", order)}
                  disabled={saving === order._id}
                  style={buttonStyle}
                >
                  Update Shipment
                </button>
              </section>

              {/* TIMELINE */}
              <section style={sectionStyle}>
                <h3>Shipment Timeline</h3>

                {order.shipment?.timeline?.length ? (
                  <div>
                    {order.shipment.timeline.map((event, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "14px",
                          padding: "12px 0",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#635bff",
                            marginTop: "6px",
                            flexShrink: 0,
                          }}
                        />

                        <div>
                          <strong>{event.status}</strong>

                          {event.location && (
                            <span> — {event.location}</span>
                          )}

                          {event.note && (
                            <div
                              style={{
                                color: "#64748b",
                                marginTop: "4px",
                              }}
                            >
                              {event.note}
                            </div>
                          )}

                          <small
                            style={{
                              color: "#94a3b8",
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            {event.timestamp
                              ? new Date(
                                  event.timestamp
                                ).toLocaleString()
                              : ""}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No shipment events yet.</p>
                )}
              </section>

              {/* INVOICE */}
              <section style={sectionStyle}>
                <h3>Invoice</h3>

                <p>
                  <strong>Invoice Number:</strong>{" "}
                  {order.invoice?.invoiceNumber || "Not issued"}
                </p>

                <p>
                  <strong>Amount:</strong> $
                  {Number(
                    order.invoice?.amount || order.total || 0
                  ).toFixed(2)}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {order.invoice?.status || "pending"}
                </p>

                <button
                  onClick={() => openModal("invoice", order)}
                  disabled={saving === order._id}
                  style={buttonStyle}
                >
                  Update Invoice
                </button>

                <button
                  onClick={() => handleDownloadInvoice(order)}
                  disabled={saving === order._id}
                  style={{
                    ...buttonStyle,
                    background: "#0f172a",
                    marginLeft: "10px",
                  }}
                >
                  Download PDF
                </button>
              </section>

              {/* PAYMENT */}
              <section style={sectionStyle}>
                <h3>Payment</h3>

                <p>
                  <strong>Status:</strong>{" "}
                  {order.payment?.status || "pending"}
                </p>

                <p>
                  <strong>Method:</strong>{" "}
                  {order.payment?.method || "Not provided"}
                </p>

                <p>
                  <strong>Transaction ID:</strong>{" "}
                  {order.payment?.transactionId || "Not available"}
                </p>

                <button
                  onClick={() => openModal("payment", order)}
                  disabled={saving === order._id}
                  style={buttonStyle}
                >
                  Update Payment
                </button>
              </section>

              {saving === order._id && (
                <p
                  style={{
                    color: "#6366f1",
                    fontWeight: "600",
                  }}
                >
                  Saving changes...
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {modal?.type === "delivery" && (
        <OrderModal
          title="Update Delivery"
          subtitle="Update the expected date, shipping address and notes."
          onClose={closeModal}
        >
          <DeliveryForm
            order={modal.order}
            submitting={modalSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </OrderModal>
      )}

      {modal?.type === "shipment" && (
        <OrderModal
          title="Update Shipment"
          subtitle="Update carrier/tracking details and add a timeline event."
          onClose={closeModal}
        >
          <ShipmentForm
            order={modal.order}
            submitting={modalSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </OrderModal>
      )}

      {modal?.type === "invoice" && (
        <OrderModal
          title="Update Invoice"
          subtitle="Manage the invoice number, amount, status and issue date."
          onClose={closeModal}
        >
          <InvoiceForm
            order={modal.order}
            submitting={modalSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </OrderModal>
      )}

      {modal?.type === "payment" && (
        <OrderModal
          title="Update Payment"
          subtitle="Record the payment status, method and transaction ID."
          onClose={closeModal}
        >
          <PaymentForm
            order={modal.order}
            submitting={modalSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            onProcessPayment={() => handlePayNow(modal.order)}
            processing={modalSubmitting}
          />
        </OrderModal>
      )}

      {createOpen && (
        <OrderModal
          title="New Purchase Order"
          subtitle="Create a purchase order from an accepted quote."
          onClose={() => {
            if (modalSubmitting) return;
            setCreateOpen(false);
            setCreateError("");
          }}
        >
          <form onSubmit={handleCreateOrder}>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Accepted Quote ID
              </label>
              <input
                type="text"
                value={quoteId}
                onChange={(e) => setQuoteId(e.target.value)}
                placeholder="Paste the accepted quote ID"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
                The quote must be marked as accepted before it can be converted.
              </p>
            </div>

            {createError && (
              <div
                style={{
                  padding: "10px 14px",
                  marginBottom: "14px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                {createError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setCreateOpen(false);
                  setCreateError("");
                }}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  background: "#fff",
                  color: "#334155",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalSubmitting}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#635bff",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {modalSubmitting ? "Creating..." : "Create Order"}
              </button>
            </div>
          </form>
        </OrderModal>
      )}
    </div>
  );
};

const Info = ({ title, value }) => (
  <div
    style={{
      padding: "16px",
      background: "#f8fafc",
      borderRadius: "10px",
    }}
  >
    <small style={{ color: "#64748b" }}>{title}</small>

    <div
      style={{
        marginTop: "5px",
        fontWeight: "600",
        color: "#111827",
      }}
    >
      {value}
    </div>
  </div>
);

const sectionStyle = {
  marginTop: "24px",
  paddingTop: "20px",
  borderTop: "1px solid #e5e7eb",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "9px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#635bff",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};

export default OrdersPage;

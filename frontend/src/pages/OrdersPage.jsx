import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
  updateDelivery,
  updateShipment,
  updateInvoice,
  updatePayment,
} from "../services/orderService";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

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

  const handleDeliveryUpdate = async (order) => {
    try {
      setSaving(order._id);

      await updateDelivery(order._id, {
        expectedDate: order.delivery?.expectedDate || "",
        address: order.delivery?.address || "",
        notes: order.delivery?.notes || "",
      });

      await loadOrders();
    } catch (err) {
      setError(err.message || "Failed to update delivery");
    } finally {
      setSaving("");
    }
  };

  const handleShipmentUpdate = async (order) => {
    try {
      setSaving(order._id);

      const trackingNumber = prompt(
        "Enter tracking number:",
        order.shipment?.trackingNumber || ""
      );

      if (trackingNumber === null) {
        setSaving("");
        return;
      }

      const carrier = prompt(
        "Enter carrier:",
        order.shipment?.carrier || ""
      );

      if (carrier === null) {
        setSaving("");
        return;
      }

      await updateShipment(order._id, {
        carrier,
        trackingNumber,
      });

      await loadOrders();
    } catch (err) {
      setError(err.message || "Failed to update shipment");
    } finally {
      setSaving("");
    }
  };

  const handleInvoiceUpdate = async (order) => {
    try {
      setSaving(order._id);

      const invoiceNumber = prompt(
        "Enter invoice number:",
        order.invoice?.invoiceNumber || ""
      );

      if (invoiceNumber === null) {
        setSaving("");
        return;
      }

      const status = prompt(
        "Invoice status: pending / issued / paid / cancelled",
        order.invoice?.status || "pending"
      );

      if (status === null) {
        setSaving("");
        return;
      }

      await updateInvoice(order._id, {
        invoiceNumber,
        amount: Number(order.invoice?.amount || order.total || 0),
        status,
        issuedAt:
          status === "issued" || status === "paid"
            ? new Date().toISOString()
            : order.invoice?.issuedAt || undefined,
      });

      await loadOrders();
    } catch (err) {
      setError(err.message || "Failed to update invoice");
    } finally {
      setSaving("");
    }
  };

  const handlePaymentUpdate = async (order) => {
    try {
      setSaving(order._id);

      const status = prompt(
        "Payment status: pending / paid / failed / refunded",
        order.payment?.status || "pending"
      );

      if (status === null) {
        setSaving("");
        return;
      }

      const method = prompt(
        "Payment method:",
        order.payment?.method || ""
      );

      if (method === null) {
        setSaving("");
        return;
      }

      const transactionId = prompt(
        "Transaction ID:",
        order.payment?.transactionId || ""
      );

      if (transactionId === null) {
        setSaving("");
        return;
      }

      await updatePayment(order._id, {
        status,
        method,
        transactionId,
      });

      await loadOrders();
    } catch (err) {
      setError(err.message || "Failed to update payment");
    } finally {
      setSaving("");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", fontSize: "18px" }}>
        Loading orders...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
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
                    Order #{order._id?.slice(-6)}
                  </h2>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#64748b",
                    }}
                  >
                    Vendor: {order.vendor?.name || "N/A"}
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
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
                  onClick={() => handleDeliveryUpdate(order)}
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
                  onClick={() => handleShipmentUpdate(order)}
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
                    {order.shipment.timeline.map(
                      (event, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "12px 0",
                            borderBottom:
                              "1px solid #e5e7eb",
                          }}
                        >
                          <strong>{event.status}</strong>

                          {event.location && (
                            <span>
                              {" "}
                              — {event.location}
                            </span>
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
                      )
                    )}
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
                  {order.invoice?.invoiceNumber ||
                    "Not issued"}
                </p>

                <p>
                  <strong>Amount:</strong> $
                  {Number(
                    order.invoice?.amount ||
                      order.total ||
                      0
                  ).toFixed(2)}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {order.invoice?.status || "pending"}
                </p>

                <button
                  onClick={() => handleInvoiceUpdate(order)}
                  disabled={saving === order._id}
                  style={buttonStyle}
                >
                  Update Invoice
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
                  {order.payment?.transactionId ||
                    "Not available"}
                </p>

                <button
                  onClick={() => handlePaymentUpdate(order)}
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
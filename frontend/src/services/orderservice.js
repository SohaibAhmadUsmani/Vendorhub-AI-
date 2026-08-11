const API_URL = 'http://localhost:5000/api/orders';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Get all orders
export const getOrders = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch orders');
  }

  return data;
};

// Get single order
export const getOrderById = async (orderId) => {
  const response = await fetch(`${API_URL}/${orderId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch order');
  }

  return data;
};

// Create order from accepted quote
export const createOrderFromQuote = async (quoteId) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quoteId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create order');
  }

  return data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${API_URL}/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update order status');
  }

  return data;
};

// Update delivery information
export const updateDelivery = async (
  orderId,
  deliveryData
) => {
  const response = await fetch(`${API_URL}/${orderId}/delivery`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(deliveryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to update delivery'
    );
  }

  return data;
};

// Update shipment information
export const updateShipment = async (
  orderId,
  shipmentData
) => {
  const response = await fetch(`${API_URL}/${orderId}/shipment`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(shipmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to update shipment'
    );
  }

  return data;
};

// Update invoice
export const updateInvoice = async (
  orderId,
  invoiceData
) => {
  const response = await fetch(`${API_URL}/${orderId}/invoice`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(invoiceData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to update invoice'
    );
  }

  return data;
};

// Initiate a card payment (Stripe PaymentIntent) for an order
export const initiatePayment = async (orderId) => {
  const response = await fetch(`${API_URL}/${orderId}/payment-intent`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to initiate payment'
    );
  }

  return data;
};

// Update payment
export const updatePayment = async (
  orderId,
  paymentData
) => {
  const response = await fetch(`${API_URL}/${orderId}/payment`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to update payment'
    );
  }

  return data;
};
const API_URL = "http://localhost:5000/api/risk-analysis";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
};

export const analyzeVendorRisk = async (vendorId) => {
  const response = await fetch(
    `${API_URL}/${vendorId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to analyze vendor risk"
    );
  }

  return data;
};
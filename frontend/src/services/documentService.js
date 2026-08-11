const API_URL = 'http://localhost:5000/api/documents';

const getAuthHeaders = (multipart = false) => {
  const token = localStorage.getItem('token');

  return {
    ...(multipart ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Get all documents (optional ?type= and ?q= filters)
export const getDocuments = async (params = {}) => {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  ).toString();

  const response = await fetch(
    `${API_URL}${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch documents');
  }

  return data;
};

// Get single document
export const getDocumentById = async (documentId) => {
  const response = await fetch(`${API_URL}/${documentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch document');
  }

  return data;
};

// Upload a new document (multipart form data)
export const uploadDocument = async (formData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload document');
  }

  return data;
};

// Generate AI summary for a document
export const generateDocumentSummary = async (documentId) => {
  const response = await fetch(`${API_URL}/${documentId}/summary`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate summary');
  }

  return data;
};

// Update a document's summary
export const updateDocumentSummary = async (documentId, summary) => {
  const response = await fetch(`${API_URL}/${documentId}/summary`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ summary }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update summary');
  }

  return data;
};

// Keyword search
export const searchDocuments = async (query, type) => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (type) params.append('type', type);

  const response = await fetch(`${API_URL}/search?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to search documents');
  }

  return data;
};

// AI-powered search with insight
export const aiSearchDocuments = async (query, type) => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (type) params.append('type', type);

  const response = await fetch(`${API_URL}/ai-search?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to AI search documents');
  }

  return data;
};

// Delete a document
export const deleteDocument = async (documentId) => {
  const response = await fetch(`${API_URL}/${documentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete document');
  }

  return data;
};

import { httpClient, API_BASE_URL } from './httpClient';

export async function createRFQ(rfqData) {
  const res = await httpClient.post(`${API_BASE_URL}/rfq`, rfqData);
  return res.data;
}

export async function exportRFQPdf(rfqData) {
  const res = await httpClient.post(`${API_BASE_URL}/rfq/export-pdf`, rfqData, {
    responseType: 'blob'
  });
  return res.data;
}

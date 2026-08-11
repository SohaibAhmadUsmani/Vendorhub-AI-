/**
 * invoicePdfService.js — Client-side invoice PDF generator for orders.
 * Uses the same html2pdf.js approach as the existing pdfExportService.
 */
export async function downloadInvoicePdf(order) {
  const html2pdfModule = (await import('html2pdf.js')).default;

  const vendor = order.vendor || {};
  const buyer = order.buyer || {};
  const invoice = order.invoice || {};
  const payment = order.payment || {};
  const delivery = order.delivery || {};

  const number = (value) => `$${Number(value || 0).toFixed(2)}`;
  const date = (value) =>
    value ? new Date(value).toLocaleDateString() : '—';

  const container = document.createElement('div');
  container.style.padding = '30px';
  container.style.fontFamily = 'Helvetica, Arial, sans-serif';
  container.style.color = '#0F172A';
  container.style.backgroundColor = '#FFFFFF';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #635BFF; padding-bottom: 15px; margin-bottom: 20px;">
      <div>
        <h1 style="margin: 0; font-size: 22px; color: #635BFF; font-weight: 800;">INVOICE</h1>
        <p style="margin: 5px 0 0; font-size: 12px; color: #64748B;">${invoice.invoiceNumber || order.orderNumber || 'Invoice'}</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #475569;">
        <strong style="color: #0F172A;">${vendor.name || 'VendorHub AI Vendor'}</strong><br/>
        ${vendor.location || ''}<br/>
        Issue Date: ${date(invoice.issuedAt || order.createdAt)}
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 11px; color: #475569;">
      <div>
        <strong style="color: #0F172A;">BILL TO</strong><br/>
        ${buyer.name || 'Buyer'}<br/>
        ${buyer.email || ''}
      </div>
      <div style="text-align: right;">
        <strong style="color: #0F172A;">ORDER</strong><br/>
        ${order.orderNumber || order._id}<br/>
        Status: ${order.status || 'pending'}
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
      <thead>
        <tr style="background-color: #0B1021; color: #FFFFFF; text-align: left;">
          <th style="padding: 10px; border: 1px solid #1E293B;">Item</th>
          <th style="padding: 10px; border: 1px solid #1E293B;">Qty</th>
          <th style="padding: 10px; border: 1px solid #1E293B;">Unit Price</th>
          <th style="padding: 10px; border: 1px solid #1E293B;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || []).map((item, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
            <td style="padding: 10px; border: 1px solid #E2E8F0;">${item.productName || 'Product'}</td>
            <td style="padding: 10px; border: 1px solid #E2E8F0;">${item.quantity || 0}</td>
            <td style="padding: 10px; border: 1px solid #E2E8F0;">${number(item.unitPrice)}</td>
            <td style="padding: 10px; border: 1px solid #E2E8F0;">${number((item.quantity || 0) * (item.unitPrice || 0))}</td>
          </tr>
        `).join('') || '<tr><td colspan="4" style="padding: 10px; border: 1px solid #E2E8F0;">No items</td></tr>'}
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px;">
      <div style="flex: 1; background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; font-size: 11px; color: #475569;">
        <strong style="color: #0F172A;">DELIVERY</strong><br/>
        ${delivery.address || 'Address not set'}<br/>
        Expected: ${date(delivery.expectedDate)}
      </div>
      <div style="flex: 1; background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; font-size: 11px; color: #475569; text-align: right;">
        <div>Subtotal: <strong>${number(order.subtotal || order.total)}</strong></div>
        <div style="font-size: 15px; color: #0F172A; margin-top: 4px;">Total: <strong>${number(invoice.amount || order.total)}</strong></div>
        <div>Payment: <strong>${payment.status || 'pending'}</strong>${payment.transactionId ? ` · ${payment.transactionId}` : ''}</div>
      </div>
    </div>

    <div style="border-top: 1px solid #E2E8F0; padding-top: 12px; text-align: center; font-size: 10px; color: #94A3B8;">
      Generated via <strong>VendorHub AI Platform</strong> • Module 12 Order Management
    </div>
  `;

  const opt = {
    margin: 0.5,
    filename: `${(order.orderNumber || 'Invoice').replace(/[^a-z0-9]/gi, '_')}_Invoice.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  await html2pdfModule().set(opt).from(container).save();
  return true;
}

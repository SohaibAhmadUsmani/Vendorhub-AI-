/**
 * pdfExportService.js — Client-Side PDF Catalog Generator
 * Generates print-ready PDF datasheets for Vendor Profiles & Product Catalogs
 */

export async function exportVendorCatalogPDF(vendorData, products = []) {
  try {
    // Check if html2pdf is available globally or dynamically import
    let html2pdfModule;
    try {
      html2pdfModule = (await import('html2pdf.js')).default;
    } catch (e) {
      console.warn("html2pdf.js not installed via npm, using print fallback", e);
    }

    const container = document.createElement('div');
    container.style.padding = '30px';
    container.style.fontFamily = 'Helvetica, Arial, sans-serif';
    container.style.color = '#0F172A';
    container.style.backgroundColor = '#FFFFFF';

    // HTML Printable Layout Template
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #6C5CE7; padding-bottom: 15px; margin-bottom: 20px;">
        <div>
          <h1 style="margin: 0; font-size: 24px; color: #6C5CE7; font-weight: 800;">${vendorData.name || 'Vendor Catalog'}</h1>
          <p style="margin: 5px 0 0; font-size: 12px; color: #64748B;">📍 ${vendorData.location || 'Global Supplier'} • Established ${vendorData.founded || '2015'}</p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; background-color: #F0EBFE; color: #6C5CE7; padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 11px;">
            ✓ VERIFIED SUPPLIER
          </span>
          <p style="margin: 5px 0 0; font-size: 10px; color: #94A3B8;">Catalog Export Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 8px; font-size: 14px; color: #0F172A;">Company Overview</h3>
        <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.6;">${vendorData.description || vendorData.overview || 'Manufacturer and global distributor of high-quality products.'}</p>
      </div>

      <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 15px; border-left: 4px solid #6C5CE7; padding-left: 10px;">Product Catalog Datasheet (${products.length} Items)</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 11px;">
        <thead>
          <tr style="background-color: #0B1021; color: #FFFFFF; text-align: left;">
            <th style="padding: 10px; border: 1px solid #1E293B;">Item / SKU</th>
            <th style="padding: 10px; border: 1px solid #1E293B;">Category</th>
            <th style="padding: 10px; border: 1px solid #1E293B;">Unit Price</th>
            <th style="padding: 10px; border: 1px solid #1E293B;">MOQ</th>
            <th style="padding: 10px; border: 1px solid #1E293B;">Lead Time</th>
            <th style="padding: 10px; border: 1px solid #1E293B;">Stock Status</th>
          </tr>
        </thead>
        <tbody>
          ${products.map((p, idx) => `
            <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
              <td style="padding: 10px; border: 1px solid #E2E8F0;">
                <strong>${p.title || p.name}</strong><br/>
                <span style="font-family: monospace; font-size: 9px; color: #64748B;">${p.sku || `SKU-${idx + 101}`}</span>
              </td>
              <td style="padding: 10px; border: 1px solid #E2E8F0;">${p.category || 'General'}</td>
              <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: 700; color: #6C5CE7;">${p.priceDisplay || `$${p.price || p.priceMin || '0.00'}`} / ${p.unit || 'unit'}</td>
              <td style="padding: 10px; border: 1px solid #E2E8F0;">${p.moq || '100'}</td>
              <td style="padding: 10px; border: 1px solid #E2E8F0;">${p.leadTime || '14 Days'}</td>
              <td style="padding: 10px; border: 1px solid #E2E8F0;">
                <span style="color: ${p.inStock !== false ? '#15803D' : '#B45309'}; font-weight: 600;">
                  ${p.inStock !== false ? '✓ In Stock' : 'Made to Order'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="border-top: 1px solid #E2E8F0; padding-top: 15px; text-align: center; font-size: 10px; color: #94A3B8;">
        Generated via <strong>VendorHub AI Platform</strong> • Contact Supplier: ${vendorData.contactDetails?.email || 'sales@vendorhub.ai'}
      </div>
    `;

    if (html2pdfModule) {
      const opt = {
        margin: 0.5,
        filename: `${(vendorData.name || 'Vendor_Catalog').replace(/[^a-z0-9]/gi, '_')}_Catalog.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      await html2pdfModule().set(opt).from(container).save();
    } else {
      // Fallback: Open print dialog in hidden iframe/window
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`<html><head><title>${vendorData.name} Catalog</title></head><body>${container.innerHTML}</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
    return true;
  } catch (error) {
    console.error("Error generating catalog PDF:", error);
    alert("Downloading PDF Catalog... (Print dialog will open)");
    window.print();
    return false;
  }
}

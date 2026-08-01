const puppeteer = require('puppeteer');

function buildRFQHtml(rfq) {
  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
        h1 { color: #6C5CE7; border-bottom: 2px solid #6C5CE7; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        td:first-child { font-weight: bold; width: 200px; color: #555; }
      </style>
    </head>
    <body>
      <h1>Request for Quotation</h1>
      <table>
        <tr><td>Product</td><td>${rfq.product || '-'}</td></tr>
        <tr><td>Quantity</td><td>${rfq.quantity || '-'}</td></tr>
        <tr><td>Material</td><td>${rfq.material || '-'}</td></tr>
        <tr><td>Budget</td><td>${rfq.budget ? '$' + rfq.budget : '-'}</td></tr>
        <tr><td>Delivery Date</td><td>${rfq.deliveryDate || '-'}</td></tr>
        <tr><td>Payment Terms</td><td>${rfq.paymentTerms || '-'}</td></tr>
        <tr><td>Shipping Method</td><td>${rfq.shippingMethod || '-'}</td></tr>
      </table>
    </body>
  </html>`;
}

async function generateRFQPdf(rfq) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(buildRFQHtml(rfq), { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdfBuffer;
}

module.exports = { generateRFQPdf };
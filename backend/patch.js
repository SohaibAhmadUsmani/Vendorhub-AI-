const fs = require('fs');
const path = 'm:/Intership Development/vendor hub ai/backend/services/dashboardService.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'async function resolveVendor(vendorId) {',
  'async function resolveVendor(vendorId) {\n  if (vendorId === "admin") return { _id: "admin", name: "Global Platform", riskBreakdown: { overallScore: 100 } };'
);

content = content.replace(/\{ vendor: vid \}/g, "(vid === 'admin' ? {} : { vendor: vid })");

fs.writeFileSync(path, content);
console.log('Replacements done!');

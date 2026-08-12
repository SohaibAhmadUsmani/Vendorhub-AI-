const fs = require('fs');
const path = 'm:/Intership Development/vendor hub ai/backend/services/dashboardService.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `async function resolveVendorForRequest(req) {
  const token = req?.header ? req.header('Authorization')?.replace('Bearer ', '') : null;
  if (token && process.env.JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded?.id) {
        const user = await UserModel.findById(decoded.id).lean();
        if (user?.email && user.role === 'vendor') {
          const owned = await Vendor.findOne({ 'contact.email': user.email });
          if (owned) return owned;
        }
      }
    } catch {
      /* Invalid/expired token — fall through to the default resolution. */
    }
  }
  return resolveVendor(req?.query?.vendorId);
}`;

const replacementStr = `async function resolveVendorForRequest(req) {
  if (req?.user) {
    if (req.user.role === 'vendor' && req.user.email) {
      const owned = await Vendor.findOne({ 'contact.email': req.user.email });
      if (owned) return owned;
    }
  } else {
    const token = req?.header ? req.header('Authorization')?.replace('Bearer ', '') : null;
    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.id) {
          const user = await UserModel.findById(decoded.id).lean();
          if (user?.email && user.role === 'vendor') {
            const owned = await Vendor.findOne({ 'contact.email': user.email });
            if (owned) return owned;
          }
        }
      } catch {
        // Fall through
      }
    }
  }
  return resolveVendor(req?.query?.vendorId);
}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(path, content);
console.log('resolveVendorForRequest updated!');

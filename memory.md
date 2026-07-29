# VendorHub AI — Project Memory

## Overview
AI-powered B2B sourcing platform connecting businesses with verified suppliers, manufacturers, wholesalers, and service providers. Buyers describe needs in natural language → AI finds matching vendors, compares them, generates RFQs, and manages the full sourcing workflow.

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (shared cluster, single connection string for all) |
| Real-time | Socket.io (chat + notifications) |
| AI | Groq API (instead of OpenAI) |
| Auth | JWT + bcrypt, OAuth via Passport.js (Google, LinkedIn, Microsoft) |
| File storage | Multer + Cloudinary/S3 |
| PDF generation | Puppeteer or pdf-lib (RFQ export) |

---

## Git Branching Strategy
```
main
 └── development  ← integration branch, all PRs merge here
      ├── feature/khadija-auth-dashboard
      ├── feature/ayyan-vendor-search
      ├── feature/muzammil-profiles-catalog
      ├── feature/shanza-matching-rfq
      ├── feature/maira-quotes-negotiation-chat
      ├── feature/namra-orders-risk-docs
      └── feature/aiman-reviews-notifications-analytics
```

- **`main`** — stable/release-ready. Only updated from `development` once stable.
- **`development`** — integration branch. All feature PRs merge here. Must build shared foundation first.
- **`feature/<name>-<section>`** — each team member works on their own branch off `development`.
- PRs reviewed & merged by project lead (you).

---

## Team Assignments (7 Members, 17 Modules)

| Member | Branch | Modules | Key Deliverables |
|--------|--------|---------|-----------------|
| **Khadija** | `feature/khadija-auth-dashboard` | 1. Auth, 2. Buyer Dashboard | Login/Signup, OAuth, 2FA, Email Verify, Buyer Dashboard widgets |
| **Ayyan** | `feature/ayyan-vendor-search` | 3. Vendor Dashboard, 4. AI Supplier Search | Vendor Dashboard, AI search bar, filters, ranked results |
| **Muzammil** | `feature/muzammil-profiles-catalog` | 5. Vendor Profiles, 6. Product Catalog | Profile page, media, products CRUD, catalog |
| **Shanza** | `feature/shanza-matching-rfq` | 7. AI Vendor Matching, 8. RFQ Generator | Match scores, RFQ form, PDF export |
| **Maira** | `feature/maira-quotes-negotiation-chat` | 9. Quote Comparison, 10. AI Negotiation, 11. Messaging | Quote table, AI negotiation, Socket.io chat |
| **Namra** | `feature/namra-orders-risk-docs` | 12. Order Management, 13. AI Risk Analysis, 14. Documents | Orders, risk scores, document upload/search |
| **Aiman** | `feature/aiman-reviews-notifications-analytics` | 15. Reviews & Ratings, 16. Notifications, 17. Analytics, Integrations, Pricing | Reviews, notifications, analytics dashboards, Stripe billing |

---

## Shared Foundation (Must be built & merged into `development` FIRST)

### Files owned by lead (you) — no one else edits these directly:
1. **`server/models/User.js`** — Central User schema (see exact code in prompt)
2. **`server/middleware/authMiddleware.js`** — JWT auth + role middleware (see exact code in prompt)
3. **`.env.example`** — Template with placeholders for all keys
4. **`server/config/db.js`** — MongoDB Atlas connection
5. **`server/index.js`** — Express server bootstrap

### `server/models/User.js`
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['buyer', 'vendor', 'admin'], required: true },
  oauthProvider: { type: String, enum: ['google', 'linkedin', 'microsoft', null], default: null },
  isVerified: { type: Boolean, default: false },
  twoFAEnabled: { type: Boolean, default: false },
  savedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### `server/middleware/authMiddleware.js`
```js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };
```

### `server/services/groqClient.js` — Shared AI wrapper (Groq instead of OpenAI)
```js
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function groqChat(messages, options = {}) {
  const completion = await groq.chat.completions.create({
    model: options.model || 'llama3-70b-8192',
    messages,
    temperature: options.temperature ?? 0.7,
  });
  return completion.choices[0]?.message?.content || '';
}

module.exports = { groqChat };
```

---

## Cross-Module Dependencies (Critical!)
- **Khadija's dashboard** → pulls from Shanza's `rfqs`, Namra's `orders`, Ayyan's AI search
- **Muzammil's vendor profile** → displays Aiman's `reviews` + Namra's risk/verification data
- **Shanza's match score** → pulls from Aiman's reviews, Namra's risk score, Ayyan/Muzammil's vendor data
- **Maira's quotes** → come from vendors responding to Shanza's RFQs
- **Aiman's notifications** → need event hooks from Khadija, Shanza, Maira, Namra modules

---

## Schema Change Rule
No one edits `User.js`, `authMiddleware.js`, or any shared model in their own branch. Schema changes go through the lead → merged into `development` → everyone pulls.

---

## Setup Instructions (for all team members)

### 1. Clone & Branch
```bash
git clone <repo-url>
cd VendorHub-AI-
git checkout development
git checkout -b feature/<your-name>-<section>
```

### 2. Environment Variables (create `.env`)
```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/vendorhub
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=gsk_your_groq_key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

### 3. Install & Run
```bash
# Server
cd server
npm install
npm run dev

# Client (separate terminal)
cd client
npm install
npm start
```
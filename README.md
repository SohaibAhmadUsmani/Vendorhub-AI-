# VendorHub AI 

*"Find the Right Supplier. Faster. Smarter."*

**VendorHub AI** is an AI-powered B2B sourcing platform designed to connect businesses with verified suppliers, manufacturers, wholesalers, and service providers worldwide. Unlike traditional directories, it acts as an **AI Procurement Assistant**, managing the entire sourcing process—from discovering vendors to negotiating and generating RFQs.

---

## 🚀 Key Features (Core Modules)

The platform consists of 17 core modules structured around the complete procurement lifecycle:

1. **Authentication:** Secure Login/Signup, OAuth (Google, LinkedIn, Microsoft), 2FA, and Email Verification.
2. **Buyer Dashboard:** Manage Active RFQs, Pending Quotes, Orders, and AI Recommendations.
3. **Vendor Dashboard:** Handle New RFQs, Active Orders, Revenue tracking, and Customer Requests.
4. **AI Supplier Search:** Natural language search with intelligent filtering (Country, Industry, MOQ, Lead Time).
5. **Vendor Profiles:** Comprehensive profiles containing media, certifications, capacity, reviews, and verified badges.
6. **Product Catalog:** Extensive product listings with SKUs, MOQ, Price Range, and Specs.
7. **AI Vendor Matching:** Generates an AI Match Score based on Price, Quality, Delivery Time, and Past Performance.
8. **RFQ Generator:** AI creates professional Request for Quotations, with PDF export.
9. **Quote Comparison:** Automated comparison matrices for different vendor quotes (Price, MOQ, Delivery).
10. **AI Negotiation Assistant:** AI-generated negotiation emails, counter-offers, and discount requests.
11. **Messaging:** Real-time chat via Socket.io with file sharing, voice notes, and auto-translation.
12. **Order Management:** Track Purchase Orders, Delivery Status, Shipments, and Invoices.
13. **AI Risk Analysis:** Evaluates supplier verification, business age, and missing certifications to generate a risk score.
14. **Documents:** Upload and search through Contracts, Invoices, and POs with AI summarization.
15. **Reviews & Ratings:** Buyer feedback on Product Quality, Communication, and Delivery.
16. **Notifications:** Real-time alerts for RFQs, Quotes, Shipments, and Expirations.
17. **Analytics:** Insights into spending, cost savings, supplier revenue, and RFQ conversion rates.

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS (Vite build system) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Shared Cluster) |
| **Real-time** | Socket.io (Chat & Notifications) |
| **AI Integration**| Groq API (LLaMA 3 Models) |
| **Authentication**| JWT + bcrypt, Passport.js (OAuth) |
| **File Storage** | Multer + Cloudinary/S3 |
| **PDF Generation**| Puppeteer / pdf-lib / Browser Print |

---

## 📂 Folder Structure

```
VendorHub-AI-/
├── backend/
│   ├── config/          # Database and environment configs
│   ├── controllers/     # API route logic
│   ├── middleware/      # Auth, Role, and Security middlewares
│   ├── models/          # MongoDB Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── seeders/         # Mock data injection
│   ├── services/        # Business logic (Groq API, email, etc.)
│   └── index.js         # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI widgets and layout
    │   ├── hooks/       # Custom React hooks
    │   ├── pages/       # Route-level components
    │   ├── services/    # Client-side API wrappers
    │   ├── App.jsx      # Router definitions
    │   └── main.jsx     # Entry point
    └── package.json
```

---

## 👥 User Roles

VendorHub AI implements strict Role-Based Access Control (RBAC):

- **Buyer:** Can search for suppliers, send RFQs, compare quotes, manage orders, and chat with vendors.
- **Vendor:** Can manage company profile, list products, receive RFQs, send quotes, and view analytics.
- **Admin:** Manages platform users, verifies vendors, handles categories, monitors fraud, and oversees subscription plans.

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd VendorHub-AI-
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory using the `.env.example` template:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/vendorhub
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=gsk_your_groq_key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# ... other OAuth/Cloudinary/Stripe keys
```

### 3. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend will run on `http://localhost:5000`*

### 4. Run the Frontend Client
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🤝 Contribution Guidelines (Team Workflow)

We utilize a strict branching strategy to prevent merge conflicts and ensure code quality:

- **`main`**: Production-ready code only.
- **`development`**: Integration branch. All features merge here first.
- **`feature/<your-name>-<section>`**: Dedicated branches for individual modules.

### Development Rules:
1. **Never edit shared files** (e.g., `server/models/User.js`, `server/middleware/authMiddleware.js`) on your feature branch. Schema changes must be approved by the project lead and merged into `development` first.
2. Always pull the latest `development` branch before opening a Pull Request.
3. Reuse existing UI components and strictly adhere to the defined Tailwind CSS design system. 

---
*Developed with ❤️ by the VendorHub AI Team*
/**
 * vendorService.js — Async Mock Service Layer for Module 5 (Vendor Profiles)
 * Simulates NoSQL MongoDB Atlas Queries & Mutations
 */

let mockVendorStore = {
  "v-sialkot-101": {
    id: "v-sialkot-101",
    name: "Sialkot Sports Ltd",
    verificationBadge: "Verified Platinum",
    location: "Sialkot, Pakistan",
    rating: 4.8,
    reviewCount: 124,
    founded: "1982",
    staff: "500-1,000",
    businessType: "Manufacturer / Exporter",
    region: "Sialkot, Pakistan",
    languages: "English, Urdu, German",
    industryRank: "#12 in Regional Exports",
    compliance: "Social & Environmental",
    matchScore: 94,
    matchReason: "Strong alignment with your \"High-Volume Performance Gear\" procurement criteria.",
    leadTimeMatch: "Excellent",
    costVariance: "-12% vs Avg",
    responseTime: "Under 2 hours",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80",
    description: "Established in 1982, Sialkot Sports Ltd has evolved from a small workshop into a premier industrial manufacturing hub. Specializing in high-performance sports equipment and industrial sub-components, we leverage advanced production lines to serve over 45 markets worldwide.",
    certifications: [
      { id: "c1", title: "ISO 9001:2015", desc: "Certified Quality Management System for manufacturing processes.", badge: "Active" },
      { id: "c2", title: "BSCI Audited", desc: "Social compliance & ethical workplace audit.", validThru: "Valid through 2025" },
      { id: "c3", title: "CE Safety Mark", desc: "European safety & EU health standard compliance.", validThru: "Valid through 2025" }
    ],
    manufacturingCapabilities: {
      capacity: "50k pcs/mo",
      leadTime: "7-10 Days",
      rndDept: "15 Engineers",
      customTooling: "Available"
    },
    similarSuppliers: [
      { name: "Atlas Industrial", rating: 4.5 },
      { name: "Precision Gear Co.", rating: 4.2 }
    ]
  }
};

export async function fetchVendorProfile(vendorId = "v-sialkot-101") {
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockVendorStore[vendorId] || mockVendorStore["v-sialkot-101"];
}

export async function updateVendorProfile(vendorId, updateData) {
  await new Promise(resolve => setTimeout(resolve, 200));

  if (mockVendorStore[vendorId]) {
    mockVendorStore[vendorId] = {
      ...mockVendorStore[vendorId],
      ...updateData
    };
  }

  return mockVendorStore[vendorId];
}

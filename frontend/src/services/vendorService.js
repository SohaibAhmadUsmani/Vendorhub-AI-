/**
 * vendorService.js — Async Mock Service Layer for Module 5 (Vendor Profiles)
 * Simulates NoSQL MongoDB Atlas Queries & Mutations (100% Scope with 6 Distinct Profiles)
 */

let mockVendorStore = {
  "v-sialkot-101": {
    id: "v-sialkot-101",
    name: "Sialkot Sports Ltd",
    verificationBadge: "Verified Platinum",
    location: "Sialkot, Punjab, Pakistan",
    rating: 4.8,
    reviewCount: 124,
    founded: "1982",
    staff: "500-1,000 Employees",
    businessType: "Manufacturer & OEM Exporter",
    region: "South Asia / Global Export",
    languages: "English, German, Urdu",
    industryRank: "#12 in Regional Exports",
    compliance: "ISO 9001, BSCI, CE Compliant",
    matchScore: 94,
    matchReason: "Strong alignment with your 'High-Volume Performance Gear' procurement criteria.",
    leadTimeMatch: "Excellent (< 7 Days)",
    costVariance: "-12% vs Regional Avg",
    responseTime: "Under 2 hours",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80",
    description: "Established in 1982, Sialkot Sports Ltd has evolved from a specialized precision workshop into a global industrial manufacturing hub. Equipped with 6 automated CNC assembly lines and over 120,000 sq ft of plant space, we supply ISO-certified electronic components, mechanical gearboxes, and custom tooling to buyers in North America, Europe, and the Middle East.",
    certifications: [
      { id: "c1", title: "ISO 9001:2015", desc: "Certified Quality Management System for manufacturing processes.", badge: "Active", validThru: "2026" },
      { id: "c2", title: "BSCI Audited", desc: "Social compliance & ethical workplace audit passed with Grade A.", badge: "Verified", validThru: "2025" },
      { id: "c3", title: "CE Safety Mark", desc: "European safety & EU health standard compliance certificate.", badge: "Active", validThru: "2026" }
    ],
    manufacturingCapabilities: {
      capacity: "50,000 Units / Month",
      leadTime: "7 - 10 Days Standard",
      rndDept: "15 Specialized R&D Engineers",
      customTooling: "Available within 5 Days",
      factoryArea: "120,000 sq ft",
      cncMachines: "45 Haas Units",
      automatedLines: "6 Assembly Lines"
    },
    exportCountries: [
      { country: "Germany", code: "DE", flag: "🇩🇪", percent: 40 },
      { country: "United States", code: "US", flag: "🇺🇸", percent: 35 },
      { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 15 },
      { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 10 }
    ],
    teamMembers: [
      { id: "t1", name: "Tariq Malik", role: "VP of Plant Operations", email: "tariq@sialkotsports.com", phone: "+92 300 1234567", languages: "English, German", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { id: "t2", name: "Ayesha Khan", role: "Head of International Exports", email: "ayesha@sialkotsports.com", phone: "+92 300 7654321", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 96, status: "Low Risk (Platinum)", verifiedSince: "2018", auditHistory: "Passed 2024 Audit by TÜV SÜD", missingCerts: 0, financialHealth: "A+ Rated" },
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: "Sialkot Sports Factory Floor & Automated CNC Operations",
    contactDetails: { address: "Plot 42, Small Industrial Estate, Sialkot, Pakistan", phone: "+92 52 4567890", email: "inquiry@sialkotsports.com", operatingHours: "Mon - Sat: 08:00 - 18:00 (GMT+5)", whatsApp: "+92 300 1234567" }
  },

  "v-atlas-102": {
    id: "v-atlas-102",
    name: "Atlas Industrial Corp",
    verificationBadge: "Verified Gold",
    location: "Frankfurt, Germany",
    rating: 4.9,
    reviewCount: 98,
    founded: "1994",
    staff: "1,000-2,500 Employees",
    businessType: "Aerospace & Metallurgy Manufacturer",
    region: "Central Europe / Global",
    languages: "German, English, French",
    industryRank: "#3 in EU Metals",
    compliance: "ISO 14001, AS9100D Certified",
    matchScore: 97,
    matchReason: "Top precision rating for high-tensile structural metals and aerospace raw alloys.",
    leadTimeMatch: "Optimal (10-14 Days)",
    costVariance: "-5% vs EU Market",
    responseTime: "Under 1 hour",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=150&auto=format&fit=crop&q=80",
    description: "Atlas Industrial Corp is a leading European metallurgist specializing in 7075-T6 grade aluminum, nickel-alloy gear forged assemblies, and aerospace structural beams.",
    certifications: [
      { id: "c1", title: "AS9100D Aerospace", desc: "Aerospace Quality Management Standard", badge: "Verified", validThru: "2027" },
      { id: "c2", title: "ISO 14001:2015", desc: "Environmental Management Certification", badge: "Active", validThru: "2026" }
    ],
    manufacturingCapabilities: { capacity: "120,000 Sheets / Month", leadTime: "10-14 Days", rndDept: "42 Engineers", customTooling: "Available", factoryArea: "250,000 sq ft", cncMachines: "80 Units", automatedLines: "10 Lines" },
    exportCountries: [
      { country: "France", code: "FR", flag: "🇫🇷", percent: 45 },
      { country: "United States", code: "US", flag: "🇺🇸", percent: 30 },
      { country: "Japan", code: "JP", flag: "🇯🇵", percent: 25 }
    ],
    teamMembers: [
      { id: "t1", name: "Dr. Hans Weber", role: "Chief Metallurgy Officer", email: "h.weber@atlasindustrial.de", phone: "+49 69 1234567", languages: "German, English", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 98, status: "Low Risk (Gold)", verifiedSince: "2015", auditHistory: "Passed 2024 Audit by DNV GL", missingCerts: 0, financialHealth: "AAA Rated" },
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: "Atlas Industrial Plant Walkthrough",
    contactDetails: { address: "Industriestrasse 14, Frankfurt, Germany", phone: "+49 69 987654", email: "sales@atlasindustrial.de", operatingHours: "Mon - Fri: 08:00 - 17:00 (GMT+1)", whatsApp: "+49 170 1234567" }
  },

  "v-precision-103": {
    id: "v-precision-103",
    name: "Precision Gear Co",
    verificationBadge: "Verified Platinum",
    location: "Nagoya, Japan",
    rating: 5.0,
    reviewCount: 210,
    founded: "1978",
    staff: "250-500 Employees",
    businessType: "High Precision Gear & Actuator Specialist",
    region: "East Asia",
    languages: "Japanese, English",
    industryRank: "#1 Precision Tooling in Japan",
    compliance: "JIS Q 9100, ISO 9001",
    matchScore: 98,
    matchReason: "Zero defect rating with sub-micron tolerance capabilities for heavy industrial robotics.",
    leadTimeMatch: "Under 14 Days",
    costVariance: "+3% vs Regional Avg (Premium Quality)",
    responseTime: "Under 30 mins",
    coverImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80",
    description: "Precision Gear Co is a renowned Japanese precision engineering firm producing high torque actuators, zero-backlash gearboxes, and micro-stepper motors.",
    certifications: [
      { id: "c1", title: "JIS Q 9100", desc: "Japanese Aerospace & Defense Quality Mark", badge: "Active", validThru: "2027" }
    ],
    manufacturingCapabilities: { capacity: "15,000 Actuators / Month", leadTime: "12-15 Days", rndDept: "28 Engineers", customTooling: "Available within 3 Days", factoryArea: "85,000 sq ft", cncMachines: "35 Mazak 5-Axis", automatedLines: "4 Robotics Lines" },
    exportCountries: [
      { country: "United States", code: "US", flag: "🇺🇸", percent: 50 },
      { country: "Germany", code: "DE", flag: "🇩🇪", percent: 35 },
      { country: "South Korea", code: "KR", flag: "🇰🇷", percent: 15 }
    ],
    teamMembers: [
      { id: "t1", name: "Kenji Sato", role: "Director of Quality Engineering", email: "sato@precisiongear.jp", phone: "+81 52 1234567", languages: "Japanese, English", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 99, status: "Zero Risk (Platinum)", verifiedSince: "2012", auditHistory: "Passed 2024 Audit by JQA", missingCerts: 0, financialHealth: "AAA Rated" },
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: "Precision Gear Sub-Micron Testing Facility",
    contactDetails: { address: "1-2-3 Meieki, Nakamura-ku, Nagoya, Japan", phone: "+81 52 9876543", email: "info@precisiongear.jp", operatingHours: "Mon - Fri: 09:00 - 18:00 (GMT+9)", whatsApp: "+81 90 12345678" }
  },

  "v-apex-104": {
    id: "v-apex-104",
    name: "Apex Textile & Apparel Mills",
    verificationBadge: "Verified Gold",
    location: "Dhaka, Bangladesh",
    rating: 4.7,
    reviewCount: 156,
    founded: "2001",
    staff: "3,000-5,000 Employees",
    businessType: "Industrial Garment & Fabric Manufacturer",
    region: "South Asia / Worldwide",
    languages: "English, Bengali",
    industryRank: "Top 5 Exporters in South Asia",
    compliance: "OEKO-TEX Standard 100, WRAP Certified",
    matchScore: 91,
    matchReason: "High capacity textile weaver for industrial protective workwear and custom uniforms.",
    leadTimeMatch: "15-20 Days",
    costVariance: "-22% vs Global Market",
    responseTime: "Under 4 hours",
    coverImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80",
    description: "Apex Textile Mills operates 3 fully compliant vertical spinning and weaving facilities supplying fire-retardant industrial fabrics and workwear globally.",
    certifications: [
      { id: "c1", title: "OEKO-TEX 100", desc: "Non-toxic chemical textiles safety standard", badge: "Verified", validThru: "2026" }
    ],
    manufacturingCapabilities: { capacity: "500,000 Yards / Month", leadTime: "15-20 Days", rndDept: "12 Textile Engineers", customTooling: "N/A", factoryArea: "400,000 sq ft", cncMachines: "120 Automated Looms", automatedLines: "14 Dyeing Lines" },
    exportCountries: [
      { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 40 },
      { country: "United States", code: "US", flag: "🇺🇸", percent: 40 },
      { country: "Canada", code: "CA", flag: "🇨🇦", percent: 20 }
    ],
    teamMembers: [
      { id: "t1", name: "Rahim Chowdhury", role: "Head of Commercial Accounts", email: "rahim@apextextile.bd", phone: "+880 2 1234567", languages: "English, Bengali", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 93, status: "Low Risk (Gold)", verifiedSince: "2017", auditHistory: "Passed 2024 Audit by Accord", missingCerts: 0, financialHealth: "A Rated" },
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: "Apex Textile Weaving Line",
    contactDetails: { address: "Gazipur Industrial Zone, Dhaka, Bangladesh", phone: "+880 2 9876543", email: "export@apextextile.bd", operatingHours: "Mon - Sat: 08:00 - 19:00 (GMT+6)", whatsApp: "+880 17 12345678" }
  },

  "v-eurotech-105": {
    id: "v-eurotech-105",
    name: "EuroTech Automation Systems",
    verificationBadge: "Verified Platinum",
    location: "Milan, Italy",
    rating: 4.9,
    reviewCount: 88,
    founded: "2010",
    staff: "150-300 Employees",
    businessType: "Industrial IoT & Controller OEM",
    region: "Southern Europe / EU",
    languages: "Italian, English, Spanish",
    industryRank: "#2 Automation OEM in Italy",
    compliance: "CE, RoHS, UL 508A Certified",
    matchScore: 96,
    matchReason: "Specialized OEM of PLC units, Modbus sensor arrays, and Industry 4.0 IoT gateways.",
    leadTimeMatch: "Under 7 Days",
    costVariance: "-8% vs Regional Avg",
    responseTime: "Under 1 hour",
    coverImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80",
    description: "EuroTech Automation Systems designs and manufactures high-performance programmable logic controllers, industrial bus gateways, and smart sensor suites.",
    certifications: [
      { id: "c1", title: "UL 508A", desc: "Industrial Control Panel Electrical Safety Mark", badge: "Active", validThru: "2026" }
    ],
    manufacturingCapabilities: { capacity: "30,000 PLC Units / Month", leadTime: "5-7 Days", rndDept: "35 Hardware Engineers", customTooling: "Available", factoryArea: "60,000 sq ft", cncMachines: "12 SMT Lines", automatedLines: "4 Test Chambers" },
    exportCountries: [
      { country: "Germany", code: "DE", flag: "🇩🇪", percent: 45 },
      { country: "United States", code: "US", flag: "🇺🇸", percent: 35 },
      { country: "Spain", code: "ES", flag: "🇪🇸", percent: 20 }
    ],
    teamMembers: [
      { id: "t1", name: "Marco Rossi", role: "VP of Product Development", email: "m.rossi@eurotech.it", phone: "+39 02 1234567", languages: "Italian, English", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 97, status: "Low Risk (Platinum)", verifiedSince: "2019", auditHistory: "Passed 2024 Audit by IMQ", missingCerts: 0, financialHealth: "A+ Rated" },
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: "EuroTech SMT Assembly Facility",
    contactDetails: { address: "Via Innovatione 8, Milan, Italy", phone: "+39 02 9876543", email: "contact@eurotech.it", operatingHours: "Mon - Fri: 08:30 - 17:30 (GMT+1)", whatsApp: "+39 335 1234567" }
  },

  "v-nexus-106": {
    id: "v-nexus-106",
    name: "Nexus Chemical & Polymers Ltd",
    verificationBadge: "Verified Gold",
    location: "Houston, Texas, USA",
    rating: 4.8,
    reviewCount: 142,
    founded: "1988",
    staff: "1,500-3,000 Employees",
    businessType: "Industrial Resins & Chemical Polymer Refiner",
    region: "North America",
    languages: "English, Spanish",
    industryRank: "#8 Polymer Refiner in US",
    compliance: "ISO 9001, OSHA VPP Star",
    matchScore: 93,
    matchReason: "High purity bulk chemical supply with ISO-certified tanker bulk shipping setup.",
    leadTimeMatch: "10-15 Days",
    costVariance: "-10% vs US Spot Rate",
    responseTime: "Under 3 hours",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=150&auto=format&fit=crop&q=80",
    description: "Nexus Chemical & Polymers produces high-performance epoxy resins, polyurethanes, and conductive copper chemical reagents for industrial compounding.",
    certifications: [
      { id: "c1", title: "OSHA VPP Star", desc: "Highest US Workplace Safety Standard", badge: "Active", validThru: "2027" }
    ],
    manufacturingCapabilities: { capacity: "200,000 Gallons / Month", leadTime: "10-12 Days", rndDept: "50 Chemical Engineers", customTooling: "N/A", factoryArea: "350,000 sq ft", cncMachines: "18 Distillation Columns", automatedLines: "8 Bulk Lines" },
    exportCountries: [
      { country: "Mexico", code: "MX", flag: "🇲🇽", percent: 40 },
      { country: "Canada", code: "CA", flag: "🇨🇦", percent: 35 },
      { country: "Brazil", code: "BR", flag: "🇧🇷", percent: 25 }
    ],
    teamMembers: [
      { id: "t1", name: "Sarah Jenkins", role: "Director of Chemical Logistics", email: "s.jenkins@nexuschem.com", phone: "+1 713 1234567", languages: "English", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 95, status: "Low Risk (Gold)", verifiedSince: "2014", auditHistory: "Passed 2024 Audit by EPA & OSHA", missingCerts: 0, financialHealth: "AA Rated" },
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: "Nexus Polymer Refinery Tour",
    contactDetails: { address: "8800 Energy Corridor, Houston, TX, USA", phone: "+1 713 9876543", email: "orders@nexuschem.com", operatingHours: "Mon - Fri: 07:00 - 18:00 (GMT-6)", whatsApp: "+1 713 5550199" }
  }
};

export async function fetchVendorProfile(vendorId = "v-sialkot-101") {
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockVendorStore[vendorId] || mockVendorStore["v-sialkot-101"];
}

export async function fetchAllVendorProfiles() {
  await new Promise(resolve => setTimeout(resolve, 150));
  return Object.values(mockVendorStore);
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

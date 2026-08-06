/**
 * vendorService.js — Enterprise REST API & High-Fidelity Dataset Service
 */

const API_BASE_URL = 'http://localhost:5000/api/vendors';

export const INITIAL_VENDORS_DATA = [
  {
    id: "v-sialkot-101",
    _id: "v-sialkot-101",
    name: "Sialkot Sports Limited",
    verificationBadge: "Verified Platinum",
    verificationStatus: "Verified",
    location: "Sialkot, Pakistan",
    rating: 4.9,
    reviewCount: 142,
    founded: "1994",
    staff: "500-1,000 Employees",
    businessType: "Sports Goods & Activewear OEM Exporter",
    region: "Global Export",
    languages: "English, Urdu, German",
    industryRank: "#1 in Sporting Goods Exports",
    compliance: "ISO 9001:2015, FIFA Quality Pro, BSCI",
    matchScore: 96,
    matchReason: "Direct manufacturer match with FIFA Quality Pro certification and high production capacity.",
    leadTimeMatch: "Excellent (< 10 Days)",
    costVariance: "-15% vs Regional Avg",
    responseTime: "Under 1 hour",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80",
    description: "Sialkot Sports Limited is a world-class sporting goods manufacturer producing FIFA Quality Pro thermal bonded match balls, professional combat gear, and custom sublimated teamwear for top European leagues.",
    overview: "Sialkot Sports Limited is a world-class sporting goods manufacturer producing FIFA Quality Pro thermal bonded match balls, professional combat gear, and custom sublimated teamwear for top European leagues.",
    certifications: [
      { id: "c1", title: "ISO 9001:2015", desc: "Quality Management System Certified by SGS", badge: "Verified", validThru: "2026" },
      { id: "c2", title: "FIFA Quality Pro", desc: "Thermal Match Ball Aerodynamic Laboratory Clearance", badge: "Verified", validThru: "2026" },
      { id: "c3", title: "BSCI Social Audit", desc: "Amfori Ethical Labor & Workplace Safety Certified", badge: "Active", validThru: "2025" }
    ],
    manufacturingCapabilities: {
      capacity: "2,500,000 Units / Year",
      leadTime: "7 - 14 Days Standard",
      rndDept: "15 Specialized R&D Engineers",
      customTooling: "Available within 5 Days",
      factoryArea: "120,000 sq ft",
      cncMachines: "12 Automated Lines",
      automatedLines: "12 Stitching & Bonding Lines"
    },
    exportCountries: [
      { country: "Germany", code: "DE", flag: "🇩🇪", percent: 40 },
      { country: "United States", code: "US", flag: "🇺🇸", percent: 35 },
      { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 15 },
      { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 10 }
    ],
    teamMembers: [
      { id: "t1", name: "Tariq Mehmood", role: "Managing Director", email: "tariq@sialkotsports.com", phone: "+92 52 3551234", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
      { id: "t2", name: "Usman Ali", role: "Head of Quality Assurance", email: "usman.qa@sialkotsports.com", phone: "+92 300 8611123", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: {
      score: 96,
      status: "Low Risk",
      verifiedSince: "2018",
      auditHistory: "Passed 2024 FIFA & SGS Audit",
      missingCerts: 0,
      financialHealth: "A+ Rated"
    },
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: "Sialkot Sports Factory Floor & Thermal Bonding Automated Assembly",
    contactDetails: {
      address: "Sambrial Road, Sialkot Industrial Zone, Pakistan",
      phone: "+92 52 3551234",
      email: "export@sialkotsports.com",
      operatingHours: "Mon - Sat: 08:00 - 18:00 (GMT+5)",
      whatsApp: "+92 300 8611122"
    }
  },
  {
    id: "v-atlas-102",
    _id: "v-atlas-102",
    name: "Atlas Industrial Corp",
    verificationBadge: "Verified Gold",
    verificationStatus: "Verified",
    location: "Karachi, Pakistan",
    rating: 4.7,
    reviewCount: 98,
    founded: "1988",
    staff: "250-500 Employees",
    businessType: "Industrial Pumps & Valves Manufacturer",
    region: "Global Export",
    languages: "English, Urdu",
    industryRank: "#3 in Heavy Machinery Casting",
    compliance: "ISO 14001:2015, API 6D Specification",
    matchScore: 92,
    matchReason: "API 6D certified oil & gas valve foundry with hydro-testing clearance.",
    leadTimeMatch: "Good (< 14 Days)",
    costVariance: "-8% vs Regional Avg",
    responseTime: "Under 2 hours",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=300&auto=format&fit=crop&q=80",
    description: "Atlas Industrial Corp manufactures heavy industrial centrifugal pumps, stainless steel gate valves, and high-pressure oil/gas pipeline fittings for chemical and energy sector enterprises.",
    overview: "Atlas Industrial Corp manufactures heavy industrial centrifugal pumps, stainless steel gate valves, and high-pressure oil/gas pipeline fittings for chemical and energy sector enterprises.",
    certifications: [
      { id: "c1", title: "ISO 14001:2015", desc: "Environmental Management Certified by TÜV Rheinland", badge: "Verified", validThru: "2026" },
      { id: "c2", title: "API 6D Specification", desc: "American Petroleum Institute Oil Pipeline Valve Certification", badge: "Verified", validThru: "2026" }
    ],
    manufacturingCapabilities: {
      capacity: "400,000 Valve Units / Year",
      leadTime: "10 - 20 Days Standard",
      rndDept: "20 Metallurgical Engineers",
      customTooling: "Sand & Investment Casting Facilities",
      factoryArea: "85,000 sq ft",
      cncMachines: "8 Heavy Machining Lines",
      automatedLines: "8 CNC Lathe & Milling Lines"
    },
    exportCountries: [
      { country: "Saudi Arabia", code: "SA", flag: "🇸🇦", percent: 45 },
      { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 30 },
      { country: "Qatar", code: "QA", flag: "🇶🇦", percent: 15 },
      { country: "Oman", code: "OM", flag: "🇴🇲", percent: 10 }
    ],
    teamMembers: [
      { id: "t1", name: "Khurram Shahzad", role: "Chief Technical Officer", email: "khurram@atlasind.com", phone: "+92 21 34567890", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 92, status: "Low Risk", verifiedSince: "2015", auditHistory: "Passed 2024 API Inspection", missingCerts: 0, financialHealth: "AA Rated" },
    videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ",
    videoTitle: "Atlas Industrial Heavy Foundry & Centrifugal Pump Hydro Testing",
    contactDetails: { address: "SITE Industrial Area, Karachi, Pakistan", phone: "+92 21 34567890", email: "sales@atlasind.com", operatingHours: "Mon - Sat: 08:30 - 17:30 (GMT+5)", whatsApp: "+92 321 4455667" }
  },
  {
    id: "v-precision-103",
    _id: "v-precision-103",
    name: "Precision Gear Co",
    verificationBadge: "Verified Platinum",
    verificationStatus: "Verified",
    location: "Lahore, Pakistan",
    rating: 4.8,
    reviewCount: 64,
    founded: "2005",
    staff: "100-250 Employees",
    businessType: "CNC Machining & Transmission Gear Manufacturer",
    region: "Global Export",
    languages: "English, Urdu",
    industryRank: "#2 in Precision Mechanical Parts",
    compliance: "IATF 16949 Automotive Certified",
    matchScore: 94,
    matchReason: "Automotive grade micro-tolerance CNC machining with IATF 16949 accreditation.",
    leadTimeMatch: "Excellent (< 8 Days)",
    costVariance: "-10% vs Regional Avg",
    responseTime: "Under 3 hours",
    coverImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80",
    description: "Precision Gear Co specializes in micro-tolerance helical gears, spur gears, and bevel gearboxes engineered for automotive and robotics assembly lines.",
    overview: "Precision Gear Co specializes in micro-tolerance helical gears, spur gears, and bevel gearboxes engineered for automotive and robotics assembly lines.",
    certifications: [
      { id: "c1", title: "IATF 16949 Automotive", desc: "Global Automotive Quality Management System Certified by Bureau Veritas", badge: "Verified", validThru: "2026" }
    ],
    manufacturingCapabilities: {
      capacity: "800,000 Gear Assemblies / Year",
      leadTime: "7 - 12 Days Standard",
      rndDept: "10 Mechanical CAD/CAM Engineers",
      customTooling: "5-Axis CNC Gear Hobbing & Grinding",
      factoryArea: "45,000 sq ft",
      cncMachines: "6 High-Precision CNC Lines",
      automatedLines: "6 Robotic Machine Tending Lines"
    },
    exportCountries: [
      { country: "Japan", code: "JP", flag: "🇯🇵", percent: 40 },
      { country: "Germany", code: "DE", flag: "🇩🇪", percent: 35 },
      { country: "United States", code: "US", flag: "🇺🇸", percent: 25 }
    ],
    teamMembers: [
      { id: "t1", name: "Hamza Niaz", role: "Head of Engineering", email: "hamza@precisiongear.pk", phone: "+92 42 35889900", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 94, status: "Low Risk", verifiedSince: "2019", auditHistory: "Passed 2024 IATF Audit", missingCerts: 0, financialHealth: "A+ Rated" },
    videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    videoTitle: "Precision Gear CNC 5-Axis Hobbing & Transmission Assembly Line",
    contactDetails: { address: "Sundar Industrial Estate, Lahore, Pakistan", phone: "+92 42 35889900", email: "info@precisiongear.pk", operatingHours: "Mon - Sat: 09:00 - 18:00 (GMT+5)", whatsApp: "+92 300 5566778" }
  },
  {
    id: "v-apex-104",
    _id: "v-apex-104",
    name: "Apex Textiles",
    verificationBadge: "Verified Gold",
    verificationStatus: "Verified",
    location: "Faisalabad, Pakistan",
    rating: 4.9,
    reviewCount: 210,
    founded: "1982",
    staff: "1,000+ Employees",
    businessType: "Organic Cotton & Home Textiles Manufacturer",
    region: "Global Export",
    languages: "English, Urdu, Arabic",
    industryRank: "#1 in Textile Weaving & Dyeing",
    compliance: "GOTS Organic, OEKO-TEX Standard 100",
    matchScore: 98,
    matchReason: "Vertically integrated GOTS organic cotton spinning, weaving, and eco-dyeing mill.",
    leadTimeMatch: "Excellent (< 10 Days)",
    costVariance: "-18% vs Regional Avg",
    responseTime: "Under 1 hour",
    coverImage: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80",
    description: "Apex Textiles is a vertically integrated textile spinning, weaving, and dyeing conglomerate exporting luxury organic bedding, bath towels, and denim fabrics worldwide.",
    overview: "Apex Textiles is a vertically integrated textile spinning, weaving, and dyeing conglomerate exporting luxury organic bedding, bath towels, and denim fabrics worldwide.",
    certifications: [
      { id: "c1", title: "GOTS Organic Certified", desc: "Global Organic Textile Standard Certified by Control Union", badge: "Verified", validThru: "2026" },
      { id: "c2", title: "OEKO-TEX Standard 100", desc: "Harmful Substances Testing Clearance by Hohenstein", badge: "Verified", validThru: "2026" }
    ],
    manufacturingCapabilities: {
      capacity: "15,000,000 Meters Fabric / Year",
      leadTime: "10 - 15 Days Standard",
      rndDept: "25 Textile Chemists & Designers",
      customTooling: "High-Speed Air-Jet Looms & Eco-Dyeing",
      factoryArea: "350,000 sq ft",
      cncMachines: "24 Automated Air-Jet Lines",
      automatedLines: "24 Shuttleless Weaving Lines"
    },
    exportCountries: [
      { country: "United States", code: "US", flag: "🇺🇸", percent: 50 },
      { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 25 },
      { country: "France", code: "FR", flag: "🇫🇷", percent: 15 },
      { country: "Italy", code: "IT", flag: "🇮🇹", percent: 10 }
    ],
    teamMembers: [
      { id: "t1", name: "Salman Ahmed", role: "Export Director", email: "salman@apextextiles.com", phone: "+92 41 8765432", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 98, status: "Low Risk", verifiedSince: "2012", auditHistory: "Passed 2024 GOTS Audit", missingCerts: 0, financialHealth: "AAA Rated" },
    videoUrl: "https://www.youtube.com/embed/K4TOrB7at0Y",
    videoTitle: "Apex Textiles High-Speed Automated Air-Jet Spinning & Weaving Mill",
    contactDetails: { address: "Sheikhupura Road, Faisalabad, Pakistan", phone: "+92 41 8765432", email: "sales@apextextiles.com", operatingHours: "Mon - Sat: 08:00 - 17:00 (GMT+5)", whatsApp: "+92 300 8765432" }
  },
  {
    id: "v-empire-105",
    _id: "v-empire-105",
    name: "Empire Mills",
    verificationBadge: "Verified Gold",
    verificationStatus: "Verified",
    location: "Gujranwala, Pakistan",
    rating: 4.6,
    reviewCount: 45,
    founded: "1999",
    staff: "250-500 Employees",
    businessType: "Structural Steel & Construction Rebar Mill",
    region: "Global Export",
    languages: "English, Urdu",
    industryRank: "#4 in Civil Infrastructure Steel",
    compliance: "ASTM A615 Grade 60 Certified",
    matchScore: 91,
    matchReason: "High-tensile Grade 60 rebar and pre-engineered steel structure mill.",
    leadTimeMatch: "Good (< 12 Days)",
    costVariance: "-12% vs Regional Avg",
    responseTime: "Under 4 hours",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80",
    description: "Empire Mills manufactures high-tensile structural steel I-beams, rebar grade 60, and custom industrial shed steel structures.",
    overview: "Empire Mills manufactures high-tensile structural steel I-beams, rebar grade 60, and custom industrial shed steel structures.",
    certifications: [
      { id: "c1", title: "ASTM A615 Grade 60", desc: "Deformed Steel Reinforcement Compliance by PCSIR", badge: "Verified", validThru: "2025" }
    ],
    manufacturingCapabilities: {
      capacity: "50,000 Metric Tons Steel / Year",
      leadTime: "7 - 14 Days Standard",
      rndDept: "8 Structural Metallurgists",
      customTooling: "Electric Arc Furnace & Hot Rolling Mill",
      factoryArea: "180,000 sq ft",
      cncMachines: "4 Steel Rolling Lines",
      automatedLines: "4 Hot Rolling & Bending Lines"
    },
    exportCountries: [
      { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 50 },
      { country: "Oman", code: "OM", flag: "🇴🇲", percent: 30 },
      { country: "Bahrain", code: "BH", flag: "🇧🇭", percent: 20 }
    ],
    teamMembers: [
      { id: "t1", name: "Bilal Chaudhry", role: "Operations Manager", email: "bilal@empiremills.pk", phone: "+92 55 4223344", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 91, status: "Low Risk", verifiedSince: "2016", auditHistory: "Passed 2023 ASTM Quality Audit", missingCerts: 0, financialHealth: "A Rated" },
    videoUrl: "https://www.youtube.com/embed/1vR_sW5h140",
    videoTitle: "Empire Mills Electric Arc Furnace & Structural Steel Rolling Plant",
    contactDetails: { address: "GT Road, Gujranwala, Pakistan", phone: "+92 55 4223344", email: "info@empiremills.pk", operatingHours: "Mon - Sat: 08:00 - 18:00 (GMT+5)", whatsApp: "+92 300 4223344" }
  },
  {
    id: "v-eurotech-106",
    _id: "v-eurotech-106",
    name: "EuroTech",
    verificationBadge: "Verified Platinum",
    verificationStatus: "Verified",
    location: "Islamabad, Pakistan",
    rating: 4.9,
    reviewCount: 78,
    founded: "2012",
    staff: "50-100 Employees",
    businessType: "Industrial IoT & Automation Electronics Manufacturer",
    region: "Global Export",
    languages: "English, Urdu",
    industryRank: "#1 in Industrial IoT Gateways",
    compliance: "CE Mark, RoHS Directive, ISO 9001",
    matchScore: 97,
    matchReason: "High-tech cleanroom SMT electronics assembly producing CE & RoHS compliant IoT gateways.",
    leadTimeMatch: "Excellent (< 7 Days)",
    costVariance: "-14% vs Regional Avg",
    responseTime: "Under 1 hour",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    logoImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80",
    description: "EuroTech designs custom PCB microcontrollers, industrial RS485 IoT sensors, and automated PLC control panels for smart factory deployment.",
    overview: "EuroTech designs custom PCB microcontrollers, industrial RS485 IoT sensors, and automated PLC control panels for smart factory deployment.",
    certifications: [
      { id: "c1", title: "CE Mark Compliance", desc: "European Electromagnetic Compatibility Clearance by Eurofins", badge: "Verified", validThru: "2026" },
      { id: "c2", title: "RoHS Directive", desc: "Hazardous Substance Restriction Clearance by SGS", badge: "Verified", validThru: "2025" }
    ],
    manufacturingCapabilities: {
      capacity: "150,000 IoT Modules / Year",
      leadTime: "5 - 10 Days Standard",
      rndDept: "12 Embedded Hardware & Firmware Engineers",
      customTooling: "High-Speed SMT Pick & Place Lines",
      factoryArea: "25,000 sq ft",
      cncMachines: "3 Automated SMT Lines",
      automatedLines: "3 SMT Cleanroom Assembly Lines"
    },
    exportCountries: [
      { country: "Germany", code: "DE", flag: "🇩🇪", percent: 45 },
      { country: "Netherlands", code: "NL", flag: "🇳🇱", percent: 35 },
      { country: "Sweden", code: "SE", flag: "🇸🇪", percent: 20 }
    ],
    teamMembers: [
      { id: "t1", name: "Dr. Shahbaz Khan", role: "Head of Embedded Systems", email: "shahbaz@eurotech.io", phone: "+92 51 2244668", languages: "English, Urdu", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" }
    ],
    riskMetrics: { score: 97, status: "Low Risk", verifiedSince: "2017", auditHistory: "Passed 2024 CE Compliance Audit", missingCerts: 0, financialHealth: "A+ Rated" },
    videoUrl: "https://www.youtube.com/embed/Vh4p3L0yQG4",
    videoTitle: "EuroTech Cleanroom Automated SMT Surface Mount Electronics Assembly",
    contactDetails: { address: "I-9 Industrial Area, Islamabad, Pakistan", phone: "+92 51 2244668", email: "contact@eurotech.io", operatingHours: "Mon - Fri: 09:00 - 18:00 (GMT+5)", whatsApp: "+92 300 2244668" }
  }
];

function normalizeVendor(v) {
  if (!v) return INITIAL_VENDORS_DATA[0];
  return {
    id: v._id || v.id || "v-sialkot-101",
    _id: v._id || v.id,
    name: v.name || "Sialkot Sports Limited",
    verificationBadge: v.verificationStatus || "Verified Platinum",
    verificationStatus: v.verificationStatus || "Verified",
    location: v.location || "Sialkot, Pakistan",
    rating: v.rating || 4.9,
    reviewCount: v.reviewCount || 142,
    founded: v.establishedYear ? String(v.establishedYear) : "1994",
    staff: v.employeeCount || "500-1,000 Employees",
    businessType: v.businessType || "Manufacturer & OEM Exporter",
    region: "Global Export",
    languages: Array.isArray(v.languages) ? v.languages.join(', ') : (v.languages || "English, Urdu"),
    industryRank: v.industryRank || "#12 in Regional Exports",
    compliance: v.compliance || (v.certifications?.map(c => c.name || c.title).join(', ') || "ISO 9001, BSCI, CE"),
    matchScore: v.matchScore || 96,
    matchReason: v.matchReason || "Strong alignment with procurement criteria.",
    leadTimeMatch: v.leadTimeMatch || "Excellent (< 7 Days)",
    costVariance: v.costVariance || "-12% vs Regional Avg",
    responseTime: v.responseTime || "Under 1 hour",
    coverImage: v.bannerImage || v.coverImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    logoImage: v.logo || v.logoImage || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80",
    description: v.overview || v.description || "Leading global exporter.",
    overview: v.overview || v.description,
    certifications: Array.isArray(v.certifications) && v.certifications.length ? v.certifications.map((c, i) => ({
      id: c._id || c.id || `c-${i}`,
      title: c.name || c.title || "ISO Certification",
      desc: c.desc || `${c.name || c.title} certified by ${c.issuer || 'SGS'}`,
      badge: c.verified || c.badge === 'Verified' ? "Verified" : "Active",
      validThru: c.year || c.validThru || "2026"
    })) : [
      { id: "c1", title: "ISO 9001:2015", desc: "Quality Management Certified", badge: "Verified", validThru: "2026" }
    ],
    manufacturingCapabilities: v.manufacturingCapabilities || {
      capacity: v.factoryDetails?.annualOutput || "50,000 Units / Month",
      leadTime: v.responseTime || "7 - 10 Days Standard",
      rndDept: "15 Specialized R&D Engineers",
      customTooling: "Available within 5 Days",
      factoryArea: v.factoryDetails?.area || "120,000 sq ft",
      cncMachines: `${v.factoryDetails?.productionLines || 12} Automated Lines`,
      automatedLines: `${v.factoryDetails?.productionLines || 12} Assembly Lines`
    },
    exportCountries: v.exportCountries || [
      { country: "Germany", code: "DE", flag: "🇩🇪", percent: 40 },
      { country: "United States", code: "US", flag: "🇺🇸", percent: 35 },
      { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 15 },
      { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 10 }
    ],
    teamMembers: Array.isArray(v.team) && v.team.length ? v.team.map((t, i) => ({
      id: t._id || t.id || `t-${i}`,
      name: t.name,
      role: t.role,
      email: t.email || "contact@vendor.com",
      phone: t.phone || "+92 300 0000000",
      languages: "English, Urdu",
      photo: t.avatar || t.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    })) : (v.teamMembers || []),
    riskMetrics: v.riskMetrics || {
      score: v.riskBreakdown?.overallScore || 96,
      status: `${v.riskBreakdown?.complianceRisk || 'Low'} Risk`,
      verifiedSince: "2018",
      auditHistory: "Passed 2024 Audit",
      missingCerts: 0,
      financialHealth: "A+ Rated"
    },
    videoUrl: v.factoryDetails?.videoTourUrl || v.videoUrl || "https://www.youtube.com/embed/5qap5aO4i9A",
    videoTitle: v.videoTitle || `${v.name} Plant Walkthrough`,
    contactDetails: v.contactDetails || {
      address: v.contact?.address || v.location,
      phone: v.contact?.phone || "+92 52 3551234",
      email: v.contact?.email || "export@vendor.com",
      operatingHours: "Mon - Sat: 08:00 - 18:00 (GMT+5)",
      whatsApp: v.contact?.phone || "+92 300 1234567"
    }
  };
}

export async function fetchAllVendorProfiles() {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch vendors from API');
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(normalizeVendor);
    }
    return INITIAL_VENDORS_DATA;
  } catch (error) {
    console.warn('Backend API unavailable, serving high-fidelity initial vendor datasets:', error);
    return INITIAL_VENDORS_DATA;
  }
}

export async function fetchVendorProfile(vendorId) {
  try {
    const res = await fetch(`${API_BASE_URL}/${vendorId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return normalizeVendor(json.data);
    }
    const localMatch = INITIAL_VENDORS_DATA.find(v => v.id === vendorId || v._id === vendorId);
    if (localMatch) return localMatch;
    const list = await fetchAllVendorProfiles();
    return list[0] || INITIAL_VENDORS_DATA[0];
  } catch (error) {
    console.warn('Error fetching vendor profile from API, fallback to local match:', error);
    const localMatch = INITIAL_VENDORS_DATA.find(v => v.id === vendorId || v._id === vendorId);
    return localMatch || INITIAL_VENDORS_DATA[0];
  }
}

export async function updateVendorProfile(vendorId, updateData) {
  try {
    const res = await fetch(`${API_BASE_URL}/${vendorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update vendor');
    const json = await res.json();
    return normalizeVendor(json.data);
  } catch (error) {
    console.warn('Error updating vendor profile on API, updating local data:', error);
    const idx = INITIAL_VENDORS_DATA.findIndex(v => v.id === vendorId || v._id === vendorId);
    if (idx !== -1) {
      INITIAL_VENDORS_DATA[idx] = {
        ...INITIAL_VENDORS_DATA[idx],
        ...updateData,
        logoImage: updateData.logoImage || INITIAL_VENDORS_DATA[idx].logoImage,
        coverImage: updateData.coverImage || INITIAL_VENDORS_DATA[idx].coverImage
      };
      return INITIAL_VENDORS_DATA[idx];
    }
    return updateData;
  }
}

export async function submitVendorReview(vendorId, reviewData) {
  try {
    const res = await fetch(`${API_BASE_URL}/${vendorId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    const json = await res.json();
    return normalizeVendor(json.data);
  } catch (error) {
    console.error('Error submitting vendor review:', error);
    return null;
  }
}

export async function updateVendorRiskScore(vendorId, riskData) {
  try {
    const res = await fetch(`${API_BASE_URL}/${vendorId}/risk`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(riskData)
    });
    if (!res.ok) throw new Error('Failed to update risk score');
    const json = await res.json();
    return normalizeVendor(json.data);
  } catch (error) {
    console.error('Error updating vendor risk score:', error);
    return null;
  }
}

export async function toggleSaveVendor(vendorId, isSaved) {
  try {
    const savedVendors = JSON.parse(localStorage.getItem('saved_vendors') || '[]');
    let updated;
    if (isSaved) {
      updated = savedVendors.filter(id => id !== vendorId);
    } else {
      updated = [...savedVendors, vendorId];
    }
    localStorage.setItem('saved_vendors', JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error toggling saved vendor:', error);
    return [];
  }
}


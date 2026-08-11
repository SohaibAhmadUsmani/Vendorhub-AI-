/**
 * productService.js — Enterprise REST API & 60+ Product Catalog Dataset Service
 */

const API_BASE_URL = 'http://localhost:5000/api/products';

export const INITIAL_PRODUCTS_DATA = [
  // --- 1. Sialkot Sports Limited (10 Products) ---
  {
    id: "p-ss-101",
    sku: "SS-FB-900",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "FIFA Pro Thermal Match Soccer Ball",
    category: "Sports & Outdoor",
    rating: 4.9,
    priceMin: 18.50,
    priceMax: 18.50,
    priceDisplay: "$18.50",
    unit: "piece",
    moq: 500,
    leadTimeDays: 15,
    leadTimeDisplay: "15 days",
    availableStock: 15000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["FIFA Quality Pro", "Thermal Bonded"],
    specifications: "Material: Microfiber PU • Size: 5 • Weight: 430g • FIFA Certified",
    imageUrl: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-102",
    sku: "SS-JK-102",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Custom Sublimated Football Jersey Kit",
    category: "Apparel & Textiles",
    rating: 4.8,
    priceMin: 9.80,
    priceMax: 9.80,
    priceDisplay: "$9.80",
    unit: "set",
    moq: 200,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 8000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Quick-Dry", "Sublimated"],
    specifications: "Fabric: 100% Polyester Mesh • GSM: 160 GSM • Full Custom Sublimation",
    imageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-103",
    sku: "SS-BG-304",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Professional Leather Boxing Gloves 16oz",
    category: "Sports & Outdoor",
    rating: 4.9,
    priceMin: 24.00,
    priceMax: 24.00,
    priceDisplay: "$24.00",
    unit: "pair",
    moq: 100,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 4500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Cowhide Leather", "High Density Foam"],
    specifications: "Outer: Genuine Cowhide Leather • Weight: 16oz • Wrist Strap: Hook & Loop",
    imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-104",
    sku: "SS-SH-501",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Carbon Fiber Field Hockey Stick",
    category: "Sports & Outdoor",
    rating: 4.7,
    priceMin: 42.50,
    priceMax: 42.50,
    priceDisplay: "$42.50",
    unit: "piece",
    moq: 50,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 2000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Japanese Toray Carbon", "95% Carbon"],
    specifications: "Carbon: 95% Japanese Toray • Bow: Low Bow 24mm • Length: 36.5 to 37.5 inch",
    imageUrl: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-105",
    sku: "SS-CR-202",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Premium English Willow Cricket Bat",
    category: "Sports & Outdoor",
    rating: 4.9,
    priceMin: 85.00,
    priceMax: 85.00,
    priceDisplay: "$85.00",
    unit: "piece",
    moq: 30,
    leadTimeDays: 20,
    leadTimeDisplay: "20 days",
    availableStock: 1200,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Grade 1 Willow", "Large Sweet Spot"],
    specifications: "Willow: Grade 1 English Willow • Weight: 2lb 8oz • Handle: 12-Piece Cane",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-106",
    sku: "SS-GK-701",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Elite Grip Goalkeeper Gloves",
    category: "Sports & Outdoor",
    rating: 4.8,
    priceMin: 15.00,
    priceMax: 15.00,
    priceDisplay: "$15.00",
    unit: "pair",
    moq: 150,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 6000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["4mm German Latex", "Fingersave"],
    specifications: "Palm: 4mm German Contact Latex • Cut: Negative Cut • Wrist: Double Wrap Strap",
    imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-107",
    sku: "SS-TS-404",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Performance Compression Base Layer",
    category: "Apparel & Textiles",
    rating: 4.6,
    priceMin: 7.50,
    priceMax: 7.50,
    priceDisplay: "$7.50",
    unit: "piece",
    moq: 300,
    leadTimeDays: 8,
    leadTimeDisplay: "8 days",
    availableStock: 10000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Thermal Spandex", "Moisture Wicking"],
    specifications: "Blend: 85% Polyester / 15% Spandex • Fit: Athletic Compression",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-108",
    sku: "SS-VB-108",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Tournament Volleyball Synthetic Leather",
    category: "Sports & Outdoor",
    rating: 4.7,
    priceMin: 12.00,
    priceMax: 12.00,
    priceDisplay: "$12.00",
    unit: "piece",
    moq: 250,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 7500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["18-Panel Laminated", "Microfiber"],
    specifications: "Panels: 18-Panel Laminated • Cover: Microfiber PU • Bladder: Butyl",
    imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-109",
    sku: "SS-BB-606",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Official Composite Leather Basketball",
    category: "Sports & Outdoor",
    rating: 4.8,
    priceMin: 16.50,
    priceMax: 16.50,
    priceDisplay: "$16.50",
    unit: "piece",
    moq: 200,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 5000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Size 7", "Composite Leather"],
    specifications: "Size: Official Size 7 • Cover: Premium Composite Leather • Indoor/Outdoor",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ss-110",
    sku: "SS-EQ-909",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Limited",
    title: "Heavy Duty Sports Equipment Team Bag",
    category: "Sports & Outdoor",
    rating: 4.9,
    priceMin: 28.00,
    priceMax: 28.00,
    priceDisplay: "$28.00",
    unit: "piece",
    moq: 100,
    leadTimeDays: 15,
    leadTimeDisplay: "15 days",
    availableStock: 3000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["600D Cordura", "Wheeled Team Duffel"],
    specifications: "Fabric: 600D Waterproof Cordura • Dimensions: 36x16x16 inches • Heavy Duty Wheels",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
  },

  // --- 2. Atlas Industrial Corp (10 Products) ---
  {
    id: "p-at-201",
    sku: "AIC-PUMP-500",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Industrial High-Pressure Centrifugal Pump",
    category: "INDUSTRIAL TOOLS",
    rating: 4.7,
    priceMin: 450.00,
    priceMax: 450.00,
    priceDisplay: "$450.00",
    unit: "unit",
    moq: 5,
    leadTimeDays: 20,
    leadTimeDisplay: "20 days",
    availableStock: 120,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["SS316 Slurry", "API 610 Rated"],
    specifications: "Flow Rate: 150 m3/h • Head: 80m • Motor Power: 15 kW • Material: Stainless Steel 316",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-202",
    sku: "AIC-VALVE-200",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Stainless Steel 316 Flanged Gate Valve",
    category: "MECHANICAL PARTS",
    rating: 4.8,
    priceMin: 125.00,
    priceMax: 125.00,
    priceDisplay: "$125.00",
    unit: "piece",
    moq: 20,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 800,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["API 6D", "Class 300 Flange"],
    specifications: "Rating: ANSI Class 300 • Flange Standard: ASME B16.5 • Body: SS316 CF8M",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-203",
    sku: "AIC-COMP-400",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Rotary Screw Air Compressor Unit 45kW",
    category: "INDUSTRIAL TOOLS",
    rating: 4.9,
    priceMin: 2850.00,
    priceMax: 2850.00,
    priceDisplay: "$2,850.00",
    unit: "unit",
    moq: 2,
    leadTimeDays: 25,
    leadTimeDisplay: "25 days",
    availableStock: 45,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["45kW Direct Drive", "Integrated Air Dryer"],
    specifications: "Capacity: 7.8 m3/min • Pressure: 10 Bar • Motor: 45 kW Premium Efficiency",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-204",
    sku: "AIC-PIPE-600",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Seamless Carbon Steel Hydraulic Piping",
    category: "RAW MATERIALS",
    rating: 4.6,
    priceMin: 38.00,
    priceMax: 38.00,
    priceDisplay: "$38.00",
    unit: "meter",
    moq: 100,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 5000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["ASTM A106", "Seamless Carbon Steel"],
    specifications: "Standard: ASTM A106 Grade B • Schedule: SCH 80 • OD: 219mm",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-205",
    sku: "AIC-FLOW-101",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Digital Magnetic Flowmeter Sensor",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.8,
    priceMin: 310.00,
    priceMax: 310.00,
    priceDisplay: "$310.00",
    unit: "unit",
    moq: 10,
    leadTimeDays: 15,
    leadTimeDisplay: "15 days",
    availableStock: 350,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["PTFE Lined", "Modbus RS485"],
    specifications: "Accuracy: 0.5% • Lining: PTFE • Output: 4-20mA / Pulse / RS485",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-206",
    sku: "AIC-ACT-303",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Pneumatic Heavy Duty Rotary Actuator",
    category: "MECHANICAL PARTS",
    rating: 4.7,
    priceMin: 210.00,
    priceMax: 210.00,
    priceDisplay: "$210.00",
    unit: "piece",
    moq: 15,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 400,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Rack & Pinion", "ISO 5211"],
    specifications: "Action: Double Acting • Torque: 350 Nm • Air Pressure: 4 to 8 Bar",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-207",
    sku: "AIC-FILT-808",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "High-Volume Duplex Oil Filter System",
    category: "INDUSTRIAL TOOLS",
    rating: 4.9,
    priceMin: 620.00,
    priceMax: 620.00,
    priceDisplay: "$620.00",
    unit: "unit",
    moq: 4,
    leadTimeDays: 18,
    leadTimeDisplay: "18 days",
    availableStock: 90,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Continuous Flow", "Dual Vessel"],
    specifications: "Filtration Rating: 10 Micron Absolute • Flow Capacity: 300 L/min",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-208",
    sku: "AIC-HEAT-505",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Shell & Tube Industrial Heat Exchanger",
    category: "INDUSTRIAL TOOLS",
    rating: 4.8,
    priceMin: 4200.00,
    priceMax: 4200.00,
    priceDisplay: "$4,200.00",
    unit: "unit",
    moq: 1,
    leadTimeDays: 30,
    leadTimeDisplay: "30 days",
    availableStock: 20,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["TEMA Class C", "SS304 Tubes"],
    specifications: "Heat Transfer Area: 50 m2 • Design Pressure: 16 Bar • Code: ASME Sec VIII",
    imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-209",
    sku: "AIC-PRESS-707",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Hydraulic Press Machine 200-Ton",
    category: "INDUSTRIAL TOOLS",
    rating: 4.9,
    priceMin: 9500.00,
    priceMax: 9500.00,
    priceDisplay: "$9,500.00",
    unit: "unit",
    moq: 1,
    leadTimeDays: 35,
    leadTimeDisplay: "35 days",
    availableStock: 10,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["200-Ton Pressure", "Four-Column Deep Draw"],
    specifications: "Nominal Pressure: 2000 kN • Stroke: 600mm • Daylight: 1000mm • Motor: 22 kW",
    imageUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-at-210",
    sku: "AIC-TANK-909",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "Stainless Steel Pressure Vessel Storage Tank",
    category: "RAW MATERIALS",
    rating: 4.7,
    priceMin: 3400.00,
    priceMax: 3400.00,
    priceDisplay: "$3,400.00",
    unit: "unit",
    moq: 2,
    leadTimeDays: 28,
    leadTimeDisplay: "28 days",
    availableStock: 30,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["5000L Capacity", "ASME Section VIII"],
    specifications: "Capacity: 5000 Liters • Material: SS304 • Design Pressure: 10 Bar",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80"
  },

  // --- 3. Precision Gear Co (10 Products) ---
  {
    id: "p-pg-301",
    sku: "PGC-GEAR-12",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Helical Reduction Gear Shaft Set",
    category: "MECHANICAL PARTS",
    rating: 4.8,
    priceMin: 32.00,
    priceMax: 32.00,
    priceDisplay: "$32.00",
    unit: "set",
    moq: 50,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 2500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Case Hardened Steel", "Low Noise Transmission"],
    specifications: "Module: 2.5 • Teeth: 38 • Hardness: 58-62 HRC • Tolerance: +/- 0.005mm",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-302",
    sku: "PGC-SPUR-44",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "High-Torque Spur Gear Drive Wheel",
    category: "MECHANICAL PARTS",
    rating: 4.7,
    priceMin: 18.50,
    priceMax: 18.50,
    priceDisplay: "$18.50",
    unit: "piece",
    moq: 100,
    leadTimeDays: 8,
    leadTimeDisplay: "8 days",
    availableStock: 6000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Ground Teeth Profile", "Hobbed Steel"],
    specifications: "Material: Carbon Steel 45# • Pitch: Mod 3.0 • Bore: 35mm Keyway",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-303",
    sku: "PGC-BEVEL-08",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Spiral Bevel Gearbox Set 90 Degree",
    category: "MECHANICAL PARTS",
    rating: 4.9,
    priceMin: 145.00,
    priceMax: 145.00,
    priceDisplay: "$145.00",
    unit: "set",
    moq: 10,
    leadTimeDays: 15,
    leadTimeDisplay: "15 days",
    availableStock: 450,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["90 Degree Right Angle", "Spiral Bevel"],
    specifications: "Ratio: 1:1 • Max Input RPM: 3000 • Efficiency: 98%",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-304",
    sku: "PGC-CNC-909",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Precision Machined Aluminum Shaft Coupling",
    category: "MECHANICAL PARTS",
    rating: 4.8,
    priceMin: 14.00,
    priceMax: 14.00,
    priceDisplay: "$14.00",
    unit: "piece",
    moq: 150,
    leadTimeDays: 7,
    leadTimeDisplay: "7 days",
    availableStock: 8500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["7075-T6 Aluminum", "CNC Flexible Jaw"],
    specifications: "Material: 7075-T6 Aluminum • Bore Range: 10mm to 25mm • Elastomer Spider",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-305",
    sku: "PGC-WORM-303",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Worm Gear Speed Reducer Assembly",
    category: "MECHANICAL PARTS",
    rating: 4.7,
    priceMin: 88.00,
    priceMax: 88.00,
    priceDisplay: "$88.00",
    unit: "unit",
    moq: 20,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 900,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Bronze Wheel", "Hardened Worm Shaft"],
    specifications: "Ratio: 50:1 • Wheel Material: ZCuSn10Pb1 Bronze • Shaft: 20CrMnTi",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-306",
    sku: "PGC-SPLN-505",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Involute Spline Shaft Drive Shaft",
    category: "MECHANICAL PARTS",
    rating: 4.8,
    priceMin: 46.00,
    priceMax: 46.00,
    priceDisplay: "$46.00",
    unit: "piece",
    moq: 40,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 1800,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["PTO Drive Shaft", "Broached Spline"],
    specifications: "Spline Teeth: 21 Teeth • Standard: DIN 5480 • Induction Hardened",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-307",
    sku: "PGC-BRG-202",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Industrial Tapered Roller Bearing Block",
    category: "MECHANICAL PARTS",
    rating: 4.9,
    priceMin: 28.00,
    priceMax: 28.00,
    priceDisplay: "$28.00",
    unit: "piece",
    moq: 80,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 3200,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Cast Iron Pillow Block", "Chrome Steel"],
    specifications: "Shaft Diameter: 40mm • Dynamic Load: 45 kN • Triple Lip Seal",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-308",
    sku: "PGC-PIN-707",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Hardened Steel Pinion Gear Shaft",
    category: "MECHANICAL PARTS",
    rating: 4.8,
    priceMin: 22.50,
    priceMax: 22.50,
    priceDisplay: "$22.50",
    unit: "piece",
    moq: 120,
    leadTimeDays: 9,
    leadTimeDisplay: "9 days",
    availableStock: 4000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["4140 Alloy Steel", "Induction Hardened"],
    specifications: "Material: AISI 4140 Steel • Module: 2.0 • Surface Finish: Ra 0.8",
    imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-309",
    sku: "PGC-RACK-101",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "CNC Precision Linear Gear Rack 1000mm",
    category: "MECHANICAL PARTS",
    rating: 4.7,
    priceMin: 55.00,
    priceMax: 55.00,
    priceDisplay: "$55.00",
    unit: "piece",
    moq: 30,
    leadTimeDays: 11,
    leadTimeDisplay: "11 days",
    availableStock: 1500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Module 2.0", "Ground Teeth"],
    specifications: "Length: 1000mm • Cross Section: 24x24mm • Precision Class: DIN 6",
    imageUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-pg-310",
    sku: "PGC-PLAN-808",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Planetary Gearbox Transmission Hub",
    category: "MECHANICAL PARTS",
    rating: 4.9,
    priceMin: 195.00,
    priceMax: 195.00,
    priceDisplay: "$195.00",
    unit: "unit",
    moq: 10,
    leadTimeDays: 18,
    leadTimeDisplay: "18 days",
    availableStock: 350,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Low Backlash", "Robotics Grade"],
    specifications: "Backlash: < 3 arcmin • Reduction Ratio: 10:1 • Max Output Torque: 120 Nm",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
  },

  // --- 4. Apex Textiles (10 Products) ---
  {
    id: "p-ap-401",
    sku: "AT-BED-800",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "100% Organic Egyptian Cotton Bedding Set",
    category: "RAW MATERIALS",
    rating: 4.9,
    priceMin: 24.50,
    priceMax: 24.50,
    priceDisplay: "$24.50",
    unit: "set",
    moq: 100,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 12000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["GOTS Organic", "800 TC Sateen"],
    specifications: "Thread Count: 800 TC • Weave: Sateen • Certification: GOTS Organic",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-402",
    sku: "AT-TWL-400",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Luxury Hotel Collection Bamboo Bath Towel",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 6.80,
    priceMax: 6.80,
    priceDisplay: "$6.80",
    unit: "piece",
    moq: 250,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 18000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["650 GSM", "Organic Bamboo Rayon"],
    specifications: "GSM: 650 GSM • Fiber: 70% Bamboo Rayon / 30% Organic Cotton • Size: 70x140cm",
    imageUrl: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-403",
    sku: "AT-DNM-140",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Heavyweight 14oz Selvedge Denim Fabric Roll",
    category: "RAW MATERIALS",
    rating: 4.9,
    priceMin: 4.20,
    priceMax: 4.20,
    priceDisplay: "$4.20",
    unit: "meter",
    moq: 500,
    leadTimeDays: 15,
    leadTimeDisplay: "15 days",
    availableStock: 35000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Shuttle Loom Woven", "14oz Indigo Denim"],
    specifications: "Weight: 14oz • Width: 32 inches • Dyeing: Pure Indigo Rope Dyed",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-404",
    sku: "AT-FAB-303",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Linen Upholstery Fabric Roll OEKO-TEX",
    category: "RAW MATERIALS",
    rating: 4.7,
    priceMin: 8.50,
    priceMax: 8.50,
    priceDisplay: "$8.50",
    unit: "meter",
    moq: 300,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 20000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["OEKO-TEX 100", "100% European Flax"],
    specifications: "Composition: 100% Flax Linen • GSM: 380 GSM • Martindale Rubs: 40,000",
    imageUrl: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-405",
    sku: "AT-CAN-505",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Heavy Duty Waterproof Canvas Tarp Roll",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 5.40,
    priceMax: 5.40,
    priceDisplay: "$5.40",
    unit: "meter",
    moq: 400,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 25000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["18oz Duck Canvas", "Wax Coated Waterproof"],
    specifications: "Weight: 18oz • Width: 60 inches • Finish: Paraffin Wax Water Repellent",
    imageUrl: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-406",
    sku: "AT-SILK-202",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Mulberry Raw Silk Weaving Yarn Cone",
    category: "RAW MATERIALS",
    rating: 4.9,
    priceMin: 45.00,
    priceMax: 45.00,
    priceDisplay: "$45.00",
    unit: "kg",
    moq: 50,
    leadTimeDays: 18,
    leadTimeDisplay: "18 days",
    availableStock: 1500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Grade 6A Mulberry Silk", "20/22 Denier"],
    specifications: "Grade: 6A Pure Mulberry Raw Silk • Denier: 20/22D • Cone Weight: 1.0kg",
    imageUrl: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-407",
    sku: "AT-FLN-606",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Brushed Flannel Cotton Fabric Roll",
    category: "RAW MATERIALS",
    rating: 4.7,
    priceMin: 3.80,
    priceMax: 3.80,
    priceDisplay: "$3.80",
    unit: "meter",
    moq: 600,
    leadTimeDays: 11,
    leadTimeDisplay: "11 days",
    availableStock: 40000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Double Brushed", "100% Cotton Flannel"],
    specifications: "GSM: 180 GSM • Width: 58 inches • Finish: Double Sided Napped Flannel",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-408",
    sku: "AT-VLV-808",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Royal Velvet Curtain & Drapery Textile",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 9.20,
    priceMax: 9.20,
    priceDisplay: "$9.20",
    unit: "meter",
    moq: 200,
    leadTimeDays: 16,
    leadTimeDisplay: "16 days",
    availableStock: 15000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Flame Retardant", "Luxurious Velvet"],
    specifications: "GSM: 420 GSM • Width: 140cm • Fire Standard: BS 5852 / CAL 117",
    imageUrl: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-409",
    sku: "AT-KNIT-101",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Spandex Activewear Jersey Knit Fabric",
    category: "RAW MATERIALS",
    rating: 4.9,
    priceMin: 6.20,
    priceMax: 6.20,
    priceDisplay: "$6.20",
    unit: "kg",
    moq: 300,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 28000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["4-Way Stretch", "88/12 Poly Spandex"],
    specifications: "Composition: 88% Polyester / 12% Spandex • GSM: 240 GSM • 4-Way Stretch",
    imageUrl: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-ap-410",
    sku: "AT-RUG-909",
    vendorId: "v-apex-104",
    vendorName: "Apex Textiles",
    title: "Woven Organic Jute Area Rug Fabric",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 12.50,
    priceMax: 12.50,
    priceDisplay: "$12.50",
    unit: "sqm",
    moq: 150,
    leadTimeDays: 15,
    leadTimeDisplay: "15 days",
    availableStock: 8000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Hand Braided", "100% Natural Jute"],
    specifications: "Material: 100% Organic Golden Jute Fiber • Thickness: 12mm",
    imageUrl: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=800&auto=format&fit=crop&q=80"
  },

  // --- 5. Empire Mills (10 Products) ---
  {
    id: "p-em-501",
    sku: "EM-STEEL-60",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "High-Tensile Steel Rebar Grade 60",
    category: "RAW MATERIALS",
    rating: 4.6,
    priceMin: 780.00,
    priceMax: 780.00,
    priceDisplay: "$780.00",
    unit: "ton",
    moq: 10,
    leadTimeDays: 7,
    leadTimeDisplay: "7 days",
    availableStock: 400,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["ASTM A615", "Grade 60 Deformed"],
    specifications: "Grade: ASTM A615 Grade 60 • Diameter: 12mm to 32mm • Length: 12 meters",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-502",
    sku: "EM-BEAM-250",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "Universal Structural Steel I-Beam 250mm",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 850.00,
    priceMax: 850.00,
    priceDisplay: "$850.00",
    unit: "ton",
    moq: 5,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 250,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Hot Rolled S355JR", "Structural I-Beam"],
    specifications: "Standard: EN 10025 S355JR • Section Height: 250mm • Length: 6m / 12m",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-503",
    sku: "EM-PLT-100",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "Carbon Steel Plate 20mm Hot Rolled",
    category: "RAW MATERIALS",
    rating: 4.7,
    priceMin: 720.00,
    priceMax: 720.00,
    priceDisplay: "$720.00",
    unit: "ton",
    moq: 8,
    leadTimeDays: 8,
    leadTimeDisplay: "8 days",
    availableStock: 500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["ASTM A36", "Hot Rolled Steel Sheet"],
    specifications: "Thickness: 20mm • Grade: ASTM A36 • Sheet Dimensions: 2000x6000mm",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-504",
    sku: "EM-PIPE-400",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "Galvanized ERW Steel Structural Pipe",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 18.50,
    priceMax: 18.50,
    priceDisplay: "$18.50",
    unit: "meter",
    moq: 100,
    leadTimeDays: 9,
    leadTimeDisplay: "9 days",
    availableStock: 6000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Hot-Dip Galvanized", "SCH 40 Pipe"],
    specifications: "Outer Diameter: 114mm (4 Inch) • Wall Thickness: 6.0mm • Coating: 500g/m2 Zinc",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-505",
    sku: "EM-ANG-303",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "Equal Leg Steel Angle Bar 75x75mm",
    category: "RAW MATERIALS",
    rating: 4.6,
    priceMin: 690.00,
    priceMax: 690.00,
    priceDisplay: "$690.00",
    unit: "ton",
    moq: 10,
    leadTimeDays: 7,
    leadTimeDisplay: "7 days",
    availableStock: 350,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Transmission Tower Steel", "Equal Angle"],
    specifications: "Size: 75x75x6mm • Steel Grade: Q235B / S235JR • Length: 6m",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-506",
    sku: "EM-CHAN-505",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "C-Channel Structural Steel Profile",
    category: "RAW MATERIALS",
    rating: 4.7,
    priceMin: 710.00,
    priceMax: 710.00,
    priceDisplay: "$710.00",
    unit: "ton",
    moq: 10,
    leadTimeDays: 8,
    leadTimeDisplay: "8 days",
    availableStock: 300,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Roof Purlin C-Channel", "Cold Formed"],
    specifications: "Dimensions: C200x75x20x2.5mm • Finish: Pre-Galvanized / Black Steel",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-507",
    sku: "EM-WIRE-202",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "High Carbon Steel Wire Rod Coils",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 640.00,
    priceMax: 640.00,
    priceDisplay: "$640.00",
    unit: "ton",
    moq: 15,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 800,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["5.5mm Wire Rod", "High Carbon SAE 1070"],
    specifications: "Diameter: 5.5mm • Carbon Content: 0.70% • Coil Weight: 2.0 Metric Tons",
    imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-508",
    sku: "EM-SHED-707",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "Pre-Engineered Steel Building Truss Frame",
    category: "RAW MATERIALS",
    rating: 4.9,
    priceMin: 12500.00,
    priceMax: 12500.00,
    priceDisplay: "$12,500.00",
    unit: "set",
    moq: 1,
    leadTimeDays: 25,
    leadTimeDisplay: "25 days",
    availableStock: 15,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["PEB Warehouse Structure", "Clear-Span Frame"],
    specifications: "Span: 30 meters • Eave Height: 8 meters • Wind Rating: 150 km/h",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-509",
    sku: "EM-MESH-808",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "Welded Concrete Reinforcement Wire Mesh",
    category: "RAW MATERIALS",
    rating: 4.7,
    priceMin: 4.50,
    priceMax: 4.50,
    priceDisplay: "$4.50",
    unit: "sqm",
    moq: 500,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 25000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["A393 Mesh", "Slab Reinforcement"],
    specifications: "Wire Diameter: 10mm • Mesh Pitch: 200x200mm • Sheet Size: 2.4x4.8 meters",
    imageUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-em-510",
    sku: "EM-TUBE-909",
    vendorId: "v-empire-105",
    vendorName: "Empire Mills",
    title: "Hollow Structural Rectangular Steel Tube",
    category: "RAW MATERIALS",
    rating: 4.8,
    priceMin: 740.00,
    priceMax: 740.00,
    priceDisplay: "$740.00",
    unit: "ton",
    moq: 8,
    leadTimeDays: 9,
    leadTimeDisplay: "9 days",
    availableStock: 420,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["RHS Steel Section", "Cold Formed Structural"],
    specifications: "Dimensions: 100x50x4.0mm • Grade: S275J2H • Length: 6 meters",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
  },

  // --- 6. EuroTech (10 Products) ---
  {
    id: "p-et-601",
    sku: "ET-IOT-GW",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "Industrial RS485 Wireless IoT Gateway",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.9,
    priceMin: 85.00,
    priceMax: 85.00,
    priceDisplay: "$85.00",
    unit: "unit",
    moq: 20,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 1800,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["DIN-Rail Mount", "4G LTE & MQTT"],
    specifications: "Protocol: Modbus RTU / MQTT • Enclosure: IP67 Waterproof • Power: 9-36V DC",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-602",
    sku: "ET-PLC-88",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "Programmable Logic Controller Panel PLC",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.8,
    priceMin: 340.00,
    priceMax: 340.00,
    priceDisplay: "$340.00",
    unit: "unit",
    moq: 5,
    leadTimeDays: 12,
    leadTimeDisplay: "12 days",
    availableStock: 600,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["24V DC Transistor", "24 I/O Points"],
    specifications: "Inputs: 14 Digital • Outputs: 10 Transistor • Communication: Ethernet / RS485",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-603",
    sku: "ET-SEN-303",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "Ultrasonic Liquid Level Sensor Modbus",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.7,
    priceMin: 65.00,
    priceMax: 65.00,
    priceDisplay: "$65.00",
    unit: "piece",
    moq: 15,
    leadTimeDays: 8,
    leadTimeDisplay: "8 days",
    availableStock: 2500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Non-Contact Tank Sensor", "Modbus RTU"],
    specifications: "Range: 0.3m to 10m • Output: RS485 Modbus • Housing: PVDF Corrosion Resistant",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-604",
    sku: "ET-HMI-700",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "10.1 Inch Touchscreen Industrial HMI Display",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.9,
    priceMin: 220.00,
    priceMax: 220.00,
    priceDisplay: "$220.00",
    unit: "unit",
    moq: 5,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 800,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["10.1 TFT Touchscreen", "IP65 Front Panel"],
    specifications: "Resolution: 1024x600 TFT • Processor: 32-bit RISC 800MHz • Ports: Ethernet, RS232, RS485",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-605",
    sku: "ET-DRV-505",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "Variable Frequency Drive VFD 15kW 380V",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.8,
    priceMin: 410.00,
    priceMax: 410.00,
    priceDisplay: "$410.00",
    unit: "unit",
    moq: 4,
    leadTimeDays: 15,
    leadTimeDisplay: "15 days",
    availableStock: 350,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["15kW Vector VFD", "3-Phase 380V"],
    specifications: "Power: 15 kW (20 HP) • Input: 3-Phase 380V • Control: Sensorless Vector Control",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-606",
    sku: "ET-MOD-202",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "DIN-Rail 16-Channel Relay Output Module",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.7,
    priceMin: 48.00,
    priceMax: 48.00,
    priceDisplay: "$48.00",
    unit: "piece",
    moq: 25,
    leadTimeDays: 7,
    leadTimeDisplay: "7 days",
    availableStock: 3000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Isolated Modbus RTU", "16 Relay Outputs"],
    specifications: "Outputs: 16 Form-A Relays (250V AC / 10A) • Protocol: Modbus RTU RS485",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-607",
    sku: "ET-TEMP-404",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "PT100 Temperature Transmitter Modbus RTU",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.9,
    priceMin: 38.00,
    priceMax: 38.00,
    priceDisplay: "$38.00",
    unit: "piece",
    moq: 30,
    leadTimeDays: 9,
    leadTimeDisplay: "9 days",
    availableStock: 4500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Class A PT100", "RS485 Probe"],
    specifications: "Sensor: Class A PT100 RTD • Temperature Range: -50°C to +300°C • Probe: SS316 100mm",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-608",
    sku: "ET-ENC-808",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "Incremental Optical Shaft Encoder 1024 PPR",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.8,
    priceMin: 52.00,
    priceMax: 52.00,
    priceDisplay: "$52.00",
    unit: "piece",
    moq: 20,
    leadTimeDays: 10,
    leadTimeDisplay: "10 days",
    availableStock: 2200,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["1024 PPR Optical", "CNC Shaft Encoder"],
    specifications: "Resolution: 1024 PPR • Shaft: Solid 8mm • Output: Push-Pull A B Z Phase",
    imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-609",
    sku: "ET-PWR-101",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "Industrial DIN-Rail Power Supply 24V 10A",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.9,
    priceMin: 35.00,
    priceMax: 35.00,
    priceDisplay: "$35.00",
    unit: "unit",
    moq: 40,
    leadTimeDays: 6,
    leadTimeDisplay: "6 days",
    availableStock: 5500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["240W 24V DC", "PFC Switching Supply"],
    specifications: "Output: 24V DC 10A (240W) • Input: 85-264V AC • Efficiency: 93%",
    imageUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p-et-610",
    sku: "ET-SER-909",
    vendorId: "v-eurotech-106",
    vendorName: "EuroTech",
    title: "AC Servo Motor & Smart Servo Drive Kit",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.9,
    priceMin: 290.00,
    priceMax: 290.00,
    priceDisplay: "$290.00",
    unit: "set",
    moq: 5,
    leadTimeDays: 14,
    leadTimeDisplay: "14 days",
    availableStock: 400,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["1.5kW 3000RPM", "Smart AC Servo"],
    specifications: "Power: 1.5 kW • Speed: 3000 RPM • Torque: 4.77 Nm • Encoder: 17-bit Absolute",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
  }
];

function getLocalProductsStore() {
  const base = INITIAL_PRODUCTS_DATA;
  try {
    const cached = localStorage.getItem('vendorhub_products_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Find custom products (ones not in base)
        const baseIds = new Set(base.map(p => p.id));
        const customProducts = parsed.filter(p => !baseIds.has(p.id));
        return [...customProducts, ...base];
      }
    }
  } catch (e) {
    console.error('Error reading products cache:', e);
  }
  return base;
}

function saveLocalProductsStore(list) {
  try {
    localStorage.setItem('vendorhub_products_cache', JSON.stringify(list));
  } catch (e) {
    console.error('Error saving products cache:', e);
  }
}

export async function fetchProducts(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
    if (filters.searchQuery) queryParams.append('search', filters.searchQuery);
    if (filters.stockStatus && filters.stockStatus !== 'All') queryParams.append('stockStatus', filters.stockStatus);
    if (filters.vendorId) queryParams.append('vendorId', filters.vendorId);

    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      let products = (json.data || []).map(normalizeProduct);
      if (products.length === 0) {
        products = filterLocalProducts(getLocalProductsStore(), filters);
      } else {
        if (filters.vendorId) {
          const targetId = String(filters.vendorId).toLowerCase();
          products = products.filter(p => {
            const pVId = String(p.vendorId || '').toLowerCase();
            const pVName = String(p.vendorName || '').toLowerCase();
            if (pVId === targetId) return true;
            if (targetId.includes('sialkot') && pVName.includes('sialkot')) return true;
            if (targetId.includes('atlas') && pVName.includes('atlas')) return true;
            if (targetId.includes('precision') && pVName.includes('precision')) return true;
            if (targetId.includes('apex') && pVName.includes('apex')) return true;
            if (targetId.includes('empire') && pVName.includes('empire')) return true;
            if (targetId.includes('eurotech') && pVName.includes('eurotech')) return true;
            return false;
          });
        }
      }
      return products;
    }

    return filterLocalProducts(getLocalProductsStore(), filters);
  } catch (error) {
    console.warn('Backend API unavailable for products, serving full local catalog:', error);
    return filterLocalProducts(getLocalProductsStore(), filters);
  }
}

function filterLocalProducts(list, filters) {
  let filtered = [...list];

  if (filters.vendorId) {
    const targetId = String(filters.vendorId).toLowerCase();
    filtered = filtered.filter(p => {
      const pVId = String(p.vendorId || '').toLowerCase();
      const pVName = String(p.vendorName || '').toLowerCase();
      if (pVId === targetId) return true;
      if (targetId.includes('sialkot') && pVName.includes('sialkot')) return true;
      if (targetId.includes('atlas') && pVName.includes('atlas')) return true;
      if (targetId.includes('precision') && pVName.includes('precision')) return true;
      if (targetId.includes('apex') && pVName.includes('apex')) return true;
      if (targetId.includes('empire') && pVName.includes('empire')) return true;
      if (targetId.includes('eurotech') && pVName.includes('eurotech')) return true;
      return false;
    });
  }

  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(p => p.category && p.category.toLowerCase() === filters.category.toLowerCase());
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) || 
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  if (filters.stockStatus && filters.stockStatus !== 'All') {
    filtered = filtered.filter(p => p.stockStatus === filters.stockStatus);
  }

  if (filters.minPrice) {
    filtered = filtered.filter(p => p.priceMin >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(p => p.priceMin <= Number(filters.maxPrice));
  }

  if (filters.maxMoq) {
    filtered = filtered.filter(p => p.moq <= Number(filters.maxMoq));
  }

  if (filters.maxLeadTime) {
    filtered = filtered.filter(p => p.leadTimeDays <= Number(filters.maxLeadTime));
  }

  return filtered;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function addProduct(productData) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: productData.title || productData.name,
        title: productData.title || productData.name,
        category: productData.category || 'Apparel & Textiles',
        price: Number(productData.priceMin || productData.price || 50),
        priceMin: Number(productData.priceMin || productData.price || 50),
        priceMax: Number(productData.priceMax || productData.priceMin || 50),
        priceDisplay: `$${productData.priceMin || 50}`,
        unit: productData.unit || 'piece',
        moq: Number(productData.moq || 100),
        leadTime: `${productData.leadTimeDays || 14} days`,
        leadTimeDays: Number(productData.leadTimeDays || 14),
        stockQuantity: Number(productData.availableStock || 1000),
        availableStock: Number(productData.availableStock || 1000),
        stockStatus: productData.stockStatus || 'In Stock',
        image: productData.imageUrl || productData.image,
        imageUrl: productData.imageUrl || productData.image,
        description: productData.specifications || ''
      })
    });
    if (res.ok) {
      const json = await res.json();
      const norm = normalizeProduct(json.data);
      const currentList = getLocalProductsStore();
      saveLocalProductsStore([norm, ...currentList]);
      return norm;
    }
    throw new Error('API add failed');
  } catch (error) {
    console.warn('Backend API unavailable, adding to local product dataset:', error);
    const newProd = {
      id: `p-custom-${Date.now()}`,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId: productData.vendorId || 'v-sialkot-101',
      vendorName: productData.vendorName || 'Sialkot Sports Limited',
      title: productData.title,
      category: productData.category || 'Apparel & Textiles',
      rating: 4.8,
      priceMin: Number(productData.priceMin || 50),
      priceMax: Number(productData.priceMin || 50),
      priceDisplay: `$${productData.priceMin || 50}`,
      unit: productData.unit || 'piece',
      moq: Number(productData.moq || 100),
      leadTimeDays: Number(productData.leadTimeDays || 14),
      leadTimeDisplay: `${productData.leadTimeDays || 14} days`,
      availableStock: Number(productData.availableStock || 1000),
      stockStatus: productData.stockStatus || 'In Stock',
      isVerified: true,
      tags: ['Custom Upload'],
      specifications: productData.specifications || '',
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      multiImages: productData.imageUrl ? [productData.imageUrl] : []
    };
    const currentList = getLocalProductsStore();
    const updated = [newProd, ...currentList];
    saveLocalProductsStore(updated);
    return newProd;
  }
}

export async function updateProduct(productId, updateData) {
  const currentList = getLocalProductsStore();
  const idx = currentList.findIndex(p => p.id === productId || p._id === productId);
  
  let updatedProductObj = null;
  if (idx !== -1) {
    const newImg = updateData.imageUrl || updateData.image || currentList[idx].imageUrl;
    updatedProductObj = {
      ...currentList[idx],
      ...updateData,
      title: updateData.title || currentList[idx].title,
      priceMin: Number(updateData.priceMin || currentList[idx].priceMin),
      priceDisplay: updateData.priceMin ? `$${updateData.priceMin}` : currentList[idx].priceDisplay,
      imageUrl: newImg,
      multiImages: updateData.multiImages && updateData.multiImages.length > 0 ? updateData.multiImages : [newImg]
    };
    currentList[idx] = updatedProductObj;
    saveLocalProductsStore(currentList);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: updateData.title || updateData.name,
        title: updateData.title || updateData.name,
        category: updateData.category,
        price: Number(updateData.priceMin || updateData.price || 50),
        priceMin: Number(updateData.priceMin || updateData.price || 50),
        moq: Number(updateData.moq || 100),
        leadTime: typeof updateData.leadTimeDays === 'number' ? `${updateData.leadTimeDays} days` : updateData.leadTime,
        leadTimeDays: typeof updateData.leadTimeDays === 'number' ? updateData.leadTimeDays : 14,
        stockQuantity: Number(updateData.availableStock || updateData.stockQuantity || 1000),
        availableStock: Number(updateData.availableStock || updateData.stockQuantity || 1000),
        stockStatus: updateData.stockStatus || 'In Stock',
        inStock: updateData.stockStatus ? updateData.stockStatus === 'In Stock' : true,
        image: updateData.imageUrl || updateData.image,
        imageUrl: updateData.imageUrl || updateData.image,
        description: updateData.description || updateData.specifications
      })
    });
    if (res.ok) {
      const json = await res.json();
      return normalizeProduct(json.data);
    }
  } catch (error) {
    console.warn('Backend API unavailable, updated local dataset:', error);
  }

  return updatedProductObj || updateData;
}

export async function deleteProduct(productId) {
  try {
    const res = await fetch(`${API_BASE_URL}/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error deleting product in API:', error);
    return { success: false, message: error.message };
  }
}

export async function fetchProductCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('Backend categories API unavailable, using static fallback:', error);
    return [];
  }
}


/**
 * productService.js — Async Mock Service Layer for Module 6 (Product Catalog)
 * Simulates NoSQL MongoDB Atlas Queries & Mutations (100% Scope with Verified Images)
 */

let mockProductsStore = [
  {
    id: "prod-101",
    sku: "SKU-PLC-8841",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Ltd",
    title: "Precision Logic Controller V4",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.8,
    priceMin: 450.00,
    priceMax: 450.00,
    priceDisplay: "$450.00",
    unit: "Unit",
    moq: 10,
    leadTimeDays: 7,
    leadTimeDisplay: "< 7 Days",
    availableStock: 1200,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["IP67 Rated", "ARM Cortex-M4", "RS485 Support"],
    specifications: "Operating Voltage: 24V DC • Operating Temp: -20°C to +70°C • Enclosure: IP67 Aluminum Die-Cast • Communication: Modbus RTU / Ethernet IP",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    multiImages: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { minQty: 10, maxQty: 50, price: 450.00 },
      { minQty: 51, maxQty: 200, price: 415.00 },
      { minQty: 201, maxQty: 1000, price: 380.00 }
    ]
  },
  {
    id: "prod-102",
    sku: "SKU-ACT-120N",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Ltd",
    title: "Industrial Torque Actuator 120Nm",
    category: "MECHANICAL PARTS",
    rating: 4.9,
    priceMin: 1250.00,
    priceMax: 1400.00,
    priceDisplay: "$1,250.00",
    unit: "Unit",
    moq: 5,
    leadTimeDays: 10,
    leadTimeDisplay: "7-14 Days",
    availableStock: 450,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["120Nm Peak", "Brushless DC", "Steel Alloy"],
    specifications: "Peak Torque: 120 Nm • Gear Ratio: 50:1 • Weight: 4.2 kg • Motor Type: Brushless Servo • Protection Rating: IP65",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    multiImages: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { minQty: 5, maxQty: 20, price: 1250.00 },
      { minQty: 21, maxQty: 100, price: 1150.00 },
      { minQty: 101, maxQty: 500, price: 1020.00 }
    ]
  },
  {
    id: "prod-103",
    sku: "SKU-RAW-7075",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial Corp",
    title: "High-Tensile Aluminum Grade 7075-T6",
    category: "RAW MATERIALS",
    rating: 4.5,
    priceMin: 85.50,
    priceMax: 95.00,
    priceDisplay: "$85.50",
    unit: "Sheet",
    moq: 50,
    leadTimeDays: 14,
    leadTimeDisplay: "14-30 Days",
    availableStock: 25000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Aerospace Grade", "99.8% Pure", "Sheet Form"],
    specifications: "Alloy Grade: 7075-T6 • Tensile Strength: 572 MPa • Density: 2.81 g/cm³ • Standard Sheet Size: 1220mm x 2440mm",
    imageUrl: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&auto=format&fit=crop&q=80",
    multiImages: [
      "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { minQty: 50, maxQty: 200, price: 85.50 },
      { minQty: 201, maxQty: 1000, price: 78.00 },
      { minQty: 1001, maxQty: 5000, price: 69.50 }
    ]
  },
  {
    id: "prod-104",
    sku: "SKU-SNS-MSA2",
    vendorId: "v-eurotech-105",
    vendorName: "EuroTech Automation Systems",
    title: "Modular Sensor Array (MSA-2)",
    category: "ELECTRONIC COMPONENTS",
    rating: 4.7,
    priceMin: 320.00,
    priceMax: 350.00,
    priceDisplay: "$320.00",
    unit: "Unit",
    moq: 25,
    leadTimeDays: 5,
    leadTimeDisplay: "< 7 Days",
    availableStock: 3500,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["Humidity/Temp", "I2C Interface", "Ultra-low Power"],
    specifications: "Sensors Included: Temperature, Humidity, Barometric Pressure, Gas Sensor • Power: 3.3V DC • Interface: I2C / SPI",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    multiImages: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { minQty: 25, maxQty: 100, price: 320.00 },
      { minQty: 101, maxQty: 500, price: 295.00 }
    ]
  },
  {
    id: "prod-105",
    sku: "SKU-GRB-4340",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co",
    title: "Heavy Duty Gear Assembly (AGMA 12)",
    category: "MECHANICAL PARTS",
    rating: 5.0,
    priceMin: 2100.00,
    priceMax: 2300.00,
    priceDisplay: "$2,100.00",
    unit: "Unit",
    moq: 2,
    leadTimeDays: 20,
    leadTimeDisplay: "14-30 Days",
    availableStock: 80,
    stockStatus: "Made to Order",
    isVerified: true,
    tags: ["Custom Ratio", "Hardened Steel", "Vibration Damping"],
    specifications: "Material: 4340 Nickel-Chromium Steel • Hardness: 58-62 HRC • Precision Class: AGMA 12 • Max Input RPM: 3,600",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    multiImages: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { minQty: 2, maxQty: 10, price: 2100.00 },
      { minQty: 11, maxQty: 50, price: 1950.00 }
    ]
  },
  {
    id: "prod-106",
    sku: "SKU-COP-9999",
    vendorId: "v-nexus-106",
    vendorName: "Nexus Chemical & Polymers",
    title: "Conductive Copper Ingot (ETP Grade)",
    category: "RAW MATERIALS",
    rating: 4.6,
    priceMin: 42.00,
    priceMax: 48.00,
    priceDisplay: "$42.00",
    unit: "Ingot",
    moq: 100,
    leadTimeDays: 30,
    leadTimeDisplay: "30+ Days",
    availableStock: 100000,
    stockStatus: "In Stock",
    isVerified: true,
    tags: ["High Conductivity", "ASTM B115", "Bulk Supply"],
    specifications: "Purity: 99.99% ETP Copper • Standard: ASTM B115 • Weight per Ingot: 15 kg • Electrical Conductivity: 101% IACS",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    multiImages: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { minQty: 100, maxQty: 500, price: 42.00 },
      { minQty: 501, maxQty: 2000, price: 38.50 }
    ]
  }
];

export async function fetchProducts(filters = {}) {
  await new Promise(resolve => setTimeout(resolve, 150));

  return mockProductsStore.filter(product => {
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }
    if (filters.vendorId && product.vendorId !== filters.vendorId) {
      return false;
    }
    if (filters.maxMoq !== undefined && product.moq > filters.maxMoq) {
      return false;
    }
    if (filters.minPrice && product.priceMin < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.priceMin > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.verifiedOnly && !product.isVerified) {
      return false;
    }
    if (filters.maxLeadTime && product.leadTimeDays > Number(filters.maxLeadTime)) {
      return false;
    }
    if (filters.stockStatus && filters.stockStatus !== 'All' && product.stockStatus !== filters.stockStatus) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(q);
      const matchesVendor = product.vendorName.toLowerCase().includes(q);
      const matchesCategory = product.category.toLowerCase().includes(q);
      const matchesSku = product.sku.toLowerCase().includes(q);
      if (!matchesTitle && !matchesVendor && !matchesCategory && !matchesSku) return false;
    }

    return true;
  });
}

export async function addProduct(productData) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const newProduct = {
    id: `prod-${Date.now()}`,
    sku: `SKU-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
    vendorId: productData.vendorId || "v-sialkot-101",
    vendorName: productData.vendorName || "Sialkot Sports Ltd",
    title: productData.title,
    category: productData.category || "ELECTRONIC COMPONENTS",
    rating: 5.0,
    priceMin: Number(productData.priceMin || 100),
    priceMax: Number(productData.priceMax || 150),
    priceDisplay: `$${Number(productData.priceMin || 100).toFixed(2)}`,
    unit: productData.unit || "Unit",
    moq: Number(productData.moq || 10),
    leadTimeDays: Number(productData.leadTimeDays || 7),
    leadTimeDisplay: `${productData.leadTimeDays || 7} Days`,
    availableStock: Number(productData.availableStock || 1000),
    stockStatus: "In Stock",
    isVerified: true,
    tags: productData.tags ? productData.tags.split(',').map(t => t.trim()) : ["ISO Certified"],
    specifications: productData.specifications || "Standard B2B Specifications",
    imageUrl: productData.imageUrl || "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    multiImages: [
      productData.imageUrl || "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { minQty: Number(productData.moq || 10), maxQty: 100, price: Number(productData.priceMin || 100) }
    ]
  };

  mockProductsStore.unshift(newProduct);
  return newProduct;
}

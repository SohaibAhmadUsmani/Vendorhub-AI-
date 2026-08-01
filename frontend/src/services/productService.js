/**
 * productService.js — Async Mock Service Layer for Module 6 (Product Catalog)
 * Simulates NoSQL MongoDB Atlas Queries & Mutations
 */

let mockProductsStore = [
  {
    id: "prod-101",
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
    isVerified: true,
    tags: ["IP67 Rated", "ARM Cortex-M4", "RS485 Support"],
    specifications: "Operating Voltage: 24V DC • Operating Temp: -20°C to +70°C • Enclosure: IP67 Aluminum Die-Cast",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-102",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Ltd",
    title: "Industrial Torque Actuator",
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
    isVerified: true,
    tags: ["120Nm Peak", "Brushless DC", "Steel Alloy"],
    specifications: "Peak Torque: 120 Nm • Gear Ratio: 50:1 • Weight: 4.2 kg • Motor Type: Brushless Servo",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-103",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial",
    title: "High-Tensile Aluminum Grade 7",
    category: "RAW MATERIALS",
    rating: 4.5,
    priceMin: 85.50,
    priceMax: 95.00,
    priceDisplay: "$85.50",
    unit: "Unit",
    moq: 500,
    leadTimeDays: 14,
    leadTimeDisplay: "14-30 Days",
    availableStock: 25000,
    isVerified: true,
    tags: ["Aerospace Grade", "99.8% Pure", "Sheet Form"],
    specifications: "Alloy Grade: 7075-T6 • Tensile Strength: 572 MPa • Density: 2.81 g/cm³",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-104",
    vendorId: "v-sialkot-101",
    vendorName: "Sialkot Sports Ltd",
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
    isVerified: true,
    tags: ["Humidity/Temp", "I2C Interface", "Ultra-low Power"],
    specifications: "Sensors Included: Temperature, Humidity, Barometric Pressure, Gas Sensor • Power: 3.3V DC",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-105",
    vendorId: "v-atlas-102",
    vendorName: "Atlas Industrial",
    title: "Heavy Duty Gear Assembly",
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
    isVerified: true,
    tags: ["Custom Ratio", "Hardened Steel", "Vibration Damping"],
    specifications: "Material: 4340 Nickel-Chromium Steel • Hardness: 58-62 HRC • Precision Class: AGMA 12",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-106",
    vendorId: "v-precision-103",
    vendorName: "Precision Gear Co.",
    title: "Conductive Copper Ingot",
    category: "RAW MATERIALS",
    rating: 4.6,
    priceMin: 42.00,
    priceMax: 48.00,
    priceDisplay: "$42.00",
    unit: "Unit",
    moq: 1000,
    leadTimeDays: 30,
    leadTimeDisplay: "30+ Days",
    availableStock: 100000,
    isVerified: true,
    tags: ["High Conductivity", "ASTM B115", "Bulk Supply"],
    specifications: "Purity: 99.99% ETP Copper • Standard: ASTM B115 • Weight per Ingot: 15 kg",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80"
  }
];

export async function fetchProducts(filters = {}) {
  // Simulate network latency for NoSQL query
  await new Promise(resolve => setTimeout(resolve, 150));

  return mockProductsStore.filter(product => {
    // Filter by Category
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }
    // Filter by Vendor ID
    if (filters.vendorId && product.vendorId !== filters.vendorId) {
      return false;
    }
    // Filter by Max MOQ
    if (filters.maxMoq !== undefined && product.moq > filters.maxMoq) {
      return false;
    }
    // Filter by Price Range
    if (filters.minPrice && product.priceMin < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.priceMin > Number(filters.maxPrice)) {
      return false;
    }
    // Filter by Verified Only
    if (filters.verifiedOnly && !product.isVerified) {
      return false;
    }
    // Search Query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(q);
      const matchesVendor = product.vendorName.toLowerCase().includes(q);
      const matchesCategory = product.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesVendor && !matchesCategory) return false;
    }

    return true;
  });
}

export async function addProduct(productData) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const newProduct = {
    id: `prod-${Date.now()}`,
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
    isVerified: true,
    tags: productData.tags ? productData.tags.split(',').map(t => t.trim()) : ["ISO Certified"],
    specifications: productData.specifications || "Standard B2B Specifications",
    imageUrl: productData.imageUrl || "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80"
  };

  mockProductsStore.unshift(newProduct);
  return newProduct;
}

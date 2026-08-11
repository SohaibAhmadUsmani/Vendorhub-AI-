require('dotenv').config({ path: '../.env' });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google Public DNS to guarantee SRV resolution

const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://vendorhub:vendorhub123@cluster0.lxzbk8y.mongodb.net/vendorhub-ai?appName=Cluster0';
    console.log('Connecting to MongoDB Atlas at:', mongoUri);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB Atlas successfully.');

    // Clear existing Vendor and Product collections
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing Vendor and Product collections.');

    // 1. Sialkot Sports Limited
    const sialkotSports = await Vendor.create({
      name: 'Sialkot Sports Limited',
      tagline: 'Premier FIFA-grade match ball & activewear manufacturer',
      logo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      location: 'Sialkot, Pakistan',
      country: 'Pakistan',
      rating: 4.9,
      reviewCount: 142,
      verificationStatus: 'Verified',
      responseTime: '< 1 hour',
      languages: ['English', 'Urdu', 'German'],
      overview: 'Sialkot Sports Limited is a world-class sporting goods manufacturer producing FIFA Quality Pro thermal bonded match balls, professional combat gear, and custom sublimated teamwear for top European leagues.',
      establishedYear: 1994,
      employeeCount: '500-1,000 Employees',
      factoryDetails: {
        area: '120,000 sq ft',
        productionLines: 12,
        annualOutput: '2,500,000 units',
        factoryPhotos: [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
        ],
        videoTourUrl: 'https://www.youtube.com/embed/5qap5aO4i9A'
      },
      certifications: [
        { name: 'ISO 9001:2015', issuer: 'SGS International', year: '2023', verified: true },
        { name: 'FIFA Quality Pro', issuer: 'FIFA Laboratory', year: '2024', verified: true },
        { name: 'BSCI Social Audit', issuer: 'Amfori', year: '2023', verified: true }
      ],
      exportCountries: [
        { country: "Germany", code: "DE", flag: "🇩🇪", percent: 40 },
        { country: "United States", code: "US", flag: "🇺🇸", percent: 35 },
        { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 15 },
        { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 10 }
      ],
      team: [
        { name: 'Tariq Mehmood', role: 'Managing Director', email: 'tariq@sialkotsports.com', phone: '+92-300-8611122', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
        { name: 'Usman Ali', role: 'Head of Quality Assurance', email: 'usman.qa@sialkotsports.com', phone: '+92-300-8611123', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' }
      ],
      riskBreakdown: { overallScore: 96, complianceRisk: 'Low', operationalRisk: 'Low', financialRisk: 'Low' },
      contact: { email: 'export@sialkotsports.com', phone: '+92-52-3551234', website: 'https://sialkotsports.com', address: 'Sambrial Road, Sialkot Industrial Zone, Pakistan' }
    });

    await Product.create([
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'FIFA Pro Thermal Match Soccer Ball', category: 'Sports & Outdoor', sku: 'SS-FB-900', price: 18.50, unit: 'piece', moq: 500, leadTime: '15 days', inStock: true, stockQuantity: 15000, image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=600&q=80', description: 'Microfiber PU thermal bonded match ball engineered for zero water absorption.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Custom Sublimated Football Jersey Kit', category: 'Apparel & Textiles', sku: 'SS-JK-102', price: 9.80, unit: 'set', moq: 200, leadTime: '10 days', inStock: true, stockQuantity: 8000, image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=600&q=80', description: '100% moisture-wicking quick-dry polyester jersey set with full custom sublimation printing.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Professional Leather Boxing Gloves 16oz', category: 'Sports & Outdoor', sku: 'SS-BG-304', price: 24.00, unit: 'pair', moq: 100, leadTime: '12 days', inStock: true, stockQuantity: 4500, image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80', description: 'Genuine cowhide leather boxing gloves with multi-layer high-density foam padding.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Carbon Fiber Field Hockey Stick', category: 'Sports & Outdoor', sku: 'SS-SH-501', price: 42.50, unit: 'piece', moq: 50, leadTime: '14 days', inStock: true, stockQuantity: 2000, image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80', description: '95% Carbon Japanese Toray fiber composite hockey stick for maximum power transfer.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Premium English Willow Cricket Bat', category: 'Sports & Outdoor', sku: 'SS-CR-202', price: 85.00, unit: 'piece', moq: 30, leadTime: '20 days', inStock: true, stockQuantity: 1200, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80', description: 'Grade 1 English willow professional cricket bat with large sweet spot.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Elite Grip Goalkeeper Gloves', category: 'Sports & Outdoor', sku: 'SS-GK-701', price: 15.00, unit: 'pair', moq: 150, leadTime: '10 days', inStock: true, stockQuantity: 6000, image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80', description: '4mm German contact latex palms with removable finger protection spines.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Performance Compression Base Layer', category: 'Apparel & Textiles', sku: 'SS-TS-404', price: 7.50, unit: 'piece', moq: 300, leadTime: '8 days', inStock: true, stockQuantity: 10000, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80', description: 'Thermal spandex-polyester blend compression shirt for athletic performance.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Tournament Volleyball Synthetic Leather', category: 'Sports & Outdoor', sku: 'SS-VB-108', price: 12.00, unit: 'piece', moq: 250, leadTime: '12 days', inStock: true, stockQuantity: 7500, image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=600&q=80', description: '18-panel laminated microfiber synthetic leather volleyball for indoor championship tournaments.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Official Composite Leather Basketball', category: 'Sports & Outdoor', sku: 'SS-BB-606', price: 16.50, unit: 'piece', moq: 200, leadTime: '14 days', inStock: true, stockQuantity: 5000, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80', description: 'Size 7 deep channel composite leather basketball for superior grip.' },
      { vendorId: sialkotSports._id, vendorName: sialkotSports.name, name: 'Heavy Duty Sports Equipment Team Bag', category: 'Sports & Outdoor', sku: 'SS-EQ-909', price: 28.00, unit: 'piece', moq: 100, leadTime: '15 days', inStock: true, stockQuantity: 3000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', description: '600D Cordura waterproof nylon duffel bag with wheels and reinforced straps.' }
    ]);

    // 2. Atlas Industrial Corp
    const atlasIndustrial = await Vendor.create({
      name: 'Atlas Industrial Corp',
      tagline: 'Heavy-duty industrial pumps, valves & precision casting',
      logo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      location: 'Karachi, Pakistan',
      country: 'Pakistan',
      rating: 4.7,
      reviewCount: 98,
      verificationStatus: 'Verified',
      responseTime: '< 2 hours',
      languages: ['English', 'Urdu'],
      overview: 'Atlas Industrial Corp manufactures heavy industrial centrifugal pumps, stainless steel gate valves, and high-pressure oil/gas pipeline fittings for chemical and energy sector enterprises.',
      establishedYear: 1988,
      employeeCount: '250-500 Employees',
      factoryDetails: {
        area: '85,000 sq ft',
        productionLines: 8,
        annualOutput: '400,000 valve units',
        factoryPhotos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'],
        videoTourUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ'
      },
      certifications: [
        { name: 'ISO 14001:2015', issuer: 'TÜV Rheinland', year: '2023', verified: true },
        { name: 'API 6D Specification', issuer: 'American Petroleum Institute', year: '2024', verified: true }
      ],
      exportCountries: [
        { country: "Saudi Arabia", code: "SA", flag: "🇸🇦", percent: 45 },
        { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 30 },
        { country: "Qatar", code: "QA", flag: "🇶🇦", percent: 15 },
        { country: "Oman", code: "OM", flag: "🇴🇲", percent: 10 }
      ],
      team: [
        { name: 'Khurram Shahzad', role: 'Chief Technical Officer', email: 'khurram@atlasind.com', phone: '+92-321-4455667', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
      ],
      riskBreakdown: { overallScore: 92, complianceRisk: 'Low', operationalRisk: 'Low', financialRisk: 'Medium' },
      contact: { email: 'sales@atlasind.com', phone: '+92-21-34567890', website: 'https://atlasind.com', address: 'SITE Industrial Area, Karachi, Pakistan' }
    });

    await Product.create([
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Industrial High-Pressure Centrifugal Pump', category: 'INDUSTRIAL TOOLS', sku: 'AIC-PUMP-500', price: 450.00, unit: 'unit', moq: 5, leadTime: '20 days', inStock: true, stockQuantity: 120, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', description: 'Stainless steel 316 heavy duty centrifugal slurry pump rated for continuous industrial chemical transport.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Stainless Steel 316 Flanged Gate Valve', category: 'MECHANICAL PARTS', sku: 'AIC-VALVE-200', price: 125.00, unit: 'piece', moq: 20, leadTime: '12 days', inStock: true, stockQuantity: 800, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', description: 'API 6D certified ANSI Class 300 flanged gate valve for high-pressure oil pipelines.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Rotary Screw Air Compressor Unit 45kW', category: 'INDUSTRIAL TOOLS', sku: 'AIC-COMP-400', price: 2850.00, unit: 'unit', moq: 2, leadTime: '25 days', inStock: true, stockQuantity: 45, image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80', description: 'Direct drive industrial rotary screw compressor with integrated air dryer.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Seamless Carbon Steel Hydraulic Piping', category: 'RAW MATERIALS', sku: 'AIC-PIPE-600', price: 38.00, unit: 'meter', moq: 100, leadTime: '10 days', inStock: true, stockQuantity: 5000, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', description: 'ASTM A106 Grade B cold drawn seamless hydraulic steel pipe.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Digital Magnetic Flowmeter Sensor', category: 'ELECTRONIC COMPONENTS', sku: 'AIC-FLOW-101', price: 310.00, unit: 'unit', moq: 10, leadTime: '15 days', inStock: true, stockQuantity: 350, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', description: 'RS485 Modbus electromagnetic flow meter with PTFE lining for corrosive liquids.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Pneumatic Heavy Duty Rotary Actuator', category: 'MECHANICAL PARTS', sku: 'AIC-ACT-303', price: 210.00, unit: 'piece', moq: 15, leadTime: '14 days', inStock: true, stockQuantity: 400, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80', description: 'Rack and pinion pneumatic valve actuator with ISO 5211 mounting flange.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'High-Volume Duplex Oil Filter System', category: 'INDUSTRIAL TOOLS', sku: 'AIC-FILT-808', price: 620.00, unit: 'unit', moq: 4, leadTime: '18 days', inStock: true, stockQuantity: 90, image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80', description: 'Continuous flow dual vessel hydraulic oil filtration skid for power generation turbines.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Shell & Tube Industrial Heat Exchanger', category: 'INDUSTRIAL TOOLS', sku: 'AIC-HEAT-505', price: 4200.00, unit: 'unit', moq: 1, leadTime: '30 days', inStock: true, stockQuantity: 20, image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80', description: 'TEMA Class C stainless steel shell and tube heat exchanger for chemical refining.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Hydraulic Press Machine 200-Ton', category: 'INDUSTRIAL TOOLS', sku: 'AIC-PRESS-707', price: 9500.00, unit: 'unit', moq: 1, leadTime: '35 days', inStock: true, stockQuantity: 10, image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=600&q=80', description: 'Four-column heavy duty hydraulic deep drawing press machine for sheet metal stamping.' },
      { vendorId: atlasIndustrial._id, vendorName: atlasIndustrial.name, name: 'Stainless Steel Pressure Vessel Tank', category: 'RAW MATERIALS', sku: 'AIC-TANK-909', price: 3400.00, unit: 'unit', moq: 2, leadTime: '28 days', inStock: true, stockQuantity: 30, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80', description: 'ASME Section VIII certified 5000L SS304 pressure storage vessel.' }
    ]);

    // 3. Precision Gear Co
    const precisionGear = await Vendor.create({
      name: 'Precision Gear Co',
      tagline: 'High-precision CNC machined gears & transmission components',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      location: 'Lahore, Pakistan',
      country: 'Pakistan',
      rating: 4.8,
      reviewCount: 64,
      verificationStatus: 'Verified',
      responseTime: '< 3 hours',
      languages: ['English', 'Urdu'],
      overview: 'Precision Gear Co specializes in micro-tolerance helical gears, spur gears, and bevel gearboxes engineered for automotive and robotics assembly lines.',
      establishedYear: 2005,
      employeeCount: '100-250 Employees',
      factoryDetails: { area: '45,000 sq ft', productionLines: 6, annualOutput: '800,000 gear assemblies', videoTourUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk' },
      certifications: [{ name: 'IATF 16949 Automotive', issuer: 'Bureau Veritas', year: '2023', verified: true }],
      exportCountries: [
        { country: "Japan", code: "JP", flag: "🇯🇵", percent: 40 },
        { country: "Germany", code: "DE", flag: "🇩🇪", percent: 35 },
        { country: "United States", code: "US", flag: "🇺🇸", percent: 25 }
      ],
      team: [{ name: 'Hamza Niaz', role: 'Head of Engineering', email: 'hamza@precisiongear.pk' }],
      riskBreakdown: { overallScore: 94, complianceRisk: 'Low', operationalRisk: 'Low', financialRisk: 'Low' },
      contact: { email: 'info@precisiongear.pk', phone: '+92-42-35889900', address: 'Sundar Industrial Estate, Lahore, Pakistan' }
    });

    await Product.create([
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Helical Reduction Gear Shaft Set', category: 'MECHANICAL PARTS', sku: 'PGC-GEAR-12', price: 32.00, unit: 'set', moq: 50, leadTime: '12 days', inStock: true, stockQuantity: 2500, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80', description: 'Case-hardened alloy steel 8620 helical gear shaft designed for low-noise transmission assemblies.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'High-Torque Spur Gear Drive Wheel', category: 'MECHANICAL PARTS', sku: 'PGC-SPUR-44', price: 18.50, unit: 'piece', moq: 100, leadTime: '8 days', inStock: true, stockQuantity: 6000, image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80', description: 'Precision hobbed carbon steel spur gear wheel with ground teeth profile.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Spiral Bevel Gearbox Set 90 Degree', category: 'MECHANICAL PARTS', sku: 'PGC-BEVEL-08', price: 145.00, unit: 'set', moq: 10, leadTime: '15 days', inStock: true, stockQuantity: 450, image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80', description: 'Right angle spiral bevel gear set with 1:1 drive ratio.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Precision Machined Aluminum Shaft Coupling', category: 'MECHANICAL PARTS', sku: 'PGC-CNC-909', price: 14.00, unit: 'piece', moq: 150, leadTime: '7 days', inStock: true, stockQuantity: 8500, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', description: 'Flexible jaw coupling CNC machined from 7075-T6 aircraft grade aluminum.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Worm Gear Speed Reducer Assembly', category: 'MECHANICAL PARTS', sku: 'PGC-WORM-303', price: 88.00, unit: 'unit', moq: 20, leadTime: '14 days', inStock: true, stockQuantity: 900, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', description: 'Bronze worm wheel and hardened steel worm shaft 50:1 speed reducer.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Involute Spline Shaft Drive Shaft', category: 'MECHANICAL PARTS', sku: 'PGC-SPLN-505', price: 46.00, unit: 'piece', moq: 40, leadTime: '12 days', inStock: true, stockQuantity: 1800, image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=600&q=80', description: 'Precision broached splined drive shaft for agricultural machinery PTO.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Industrial Tapered Roller Bearing Block', category: 'MECHANICAL PARTS', sku: 'PGC-BRG-202', price: 28.00, unit: 'piece', moq: 80, leadTime: '10 days', inStock: true, stockQuantity: 3200, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80', description: 'Heavy duty pillow block housing with chrome steel tapered roller bearing.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Hardened Steel Pinion Gear Shaft', category: 'MECHANICAL PARTS', sku: 'PGC-PIN-707', price: 22.50, unit: 'piece', moq: 120, leadTime: '9 days', inStock: true, stockQuantity: 4000, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', description: 'Induction hardened 4140 alloy steel pinion gear shaft.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'CNC Precision Linear Gear Rack 1000mm', category: 'MECHANICAL PARTS', sku: 'PGC-RACK-101', price: 55.00, unit: 'piece', moq: 30, leadTime: '11 days', inStock: true, stockQuantity: 1500, image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80', description: 'Ground steel linear gear rack Module 2.0 for CNC router automation.' },
      { vendorId: precisionGear._id, vendorName: precisionGear.name, name: 'Planetary Gearbox Transmission Hub', category: 'MECHANICAL PARTS', sku: 'PGC-PLAN-808', price: 195.00, unit: 'unit', moq: 10, leadTime: '18 days', inStock: true, stockQuantity: 350, image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80', description: 'Low backlash high-precision planetary gearbox for servo motor robotics.' }
    ]);

    // 4. Apex Textiles
    const apexTextiles = await Vendor.create({
      name: 'Apex Textiles',
      tagline: 'OEKO-TEX certified 100% organic cotton fabrics & home textiles',
      logo: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80',
      location: 'Faisalabad, Pakistan',
      country: 'Pakistan',
      rating: 4.9,
      reviewCount: 210,
      verificationStatus: 'Verified',
      responseTime: '< 1 hour',
      languages: ['English', 'Urdu', 'Arabic'],
      overview: 'Apex Textiles is a vertically integrated textile spinning, weaving, and dyeing conglomerate exporting luxury organic bedding, bath towels, and denim fabrics worldwide.',
      establishedYear: 1982,
      employeeCount: '1,000+ Employees',
      factoryDetails: { area: '350,000 sq ft', productionLines: 24, annualOutput: '15,000,000 meters fabric', videoTourUrl: 'https://www.youtube.com/embed/K4TOrB7at0Y' },
      certifications: [
        { name: 'GOTS Organic Certified', issuer: 'Control Union', year: '2024', verified: true },
        { name: 'OEKO-TEX Standard 100', issuer: 'Hohenstein', year: '2024', verified: true }
      ],
      exportCountries: [
        { country: "United States", code: "US", flag: "🇺🇸", percent: 50 },
        { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 25 },
        { country: "France", code: "FR", flag: "🇫🇷", percent: 15 },
        { country: "Italy", code: "IT", flag: "🇮🇹", percent: 10 }
      ],
      team: [{ name: 'Salman Ahmed', role: 'Export Director', email: 'salman@apextextiles.com' }],
      riskBreakdown: { overallScore: 98, complianceRisk: 'Low', operationalRisk: 'Low', financialRisk: 'Low' },
      contact: { email: 'sales@apextextiles.com', phone: '+92-41-8765432', address: 'Sheikhupura Road, Faisalabad, Pakistan' }
    });

    await Product.create([
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: '100% Organic Egyptian Cotton Bedding Set', category: 'RAW MATERIALS', sku: 'AT-BED-800', price: 24.50, unit: 'set', moq: 100, leadTime: '14 days', inStock: true, stockQuantity: 12000, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80', description: '800 Thread Count sateen weave organic cotton sheet set with hypoallergenic finish.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Luxury Hotel Collection Bamboo Bath Towel', category: 'RAW MATERIALS', sku: 'AT-TWL-400', price: 6.80, unit: 'piece', moq: 250, leadTime: '10 days', inStock: true, stockQuantity: 18000, image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80', description: '650 GSM combed organic bamboo rayon bath towel with maximum absorbency.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Heavyweight 14oz Selvedge Denim Fabric Roll', category: 'RAW MATERIALS', sku: 'AT-DNM-140', price: 4.20, unit: 'meter', moq: 500, leadTime: '15 days', inStock: true, stockQuantity: 35000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', description: 'Authentic shuttle loom woven 14oz indigo dyed cotton selvedge denim fabric.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Linen Upholstery Fabric Roll OEKO-TEX', category: 'RAW MATERIALS', sku: 'AT-FAB-303', price: 8.50, unit: 'meter', moq: 300, leadTime: '12 days', inStock: true, stockQuantity: 20000, image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80', description: 'Heavy Duty 100% natural European flax linen fabric for sofa furniture upholstery.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Heavy Duty Waterproof Canvas Tarp Roll', category: 'RAW MATERIALS', sku: 'AT-CAN-505', price: 5.40, unit: 'meter', moq: 400, leadTime: '14 days', inStock: true, stockQuantity: 25000, image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=600&q=80', description: '18oz wax coated water resistant duck cotton canvas fabric.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Mulberry Raw Silk Weaving Yarn Cone', category: 'RAW MATERIALS', sku: 'AT-SILK-202', price: 45.00, unit: 'kg', moq: 50, leadTime: '18 days', inStock: true, stockQuantity: 1500, image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80', description: '100% pure Grade 6A mulberry raw silk yarn cones for luxury weaving mills.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Brushed Flannel Cotton Fabric Roll', category: 'RAW MATERIALS', sku: 'AT-FLN-606', price: 3.80, unit: 'meter', moq: 600, leadTime: '11 days', inStock: true, stockQuantity: 40000, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80', description: 'Soft double brushed 100% cotton flannel fabric for plaid shirts and sleepwear.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Royal Velvet Curtain & Drapery Textile', category: 'RAW MATERIALS', sku: 'AT-VLV-808', price: 9.20, unit: 'meter', moq: 200, leadTime: '16 days', inStock: true, stockQuantity: 15000, image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80', description: 'Flame retardant luxury velvet fabric for interior decor curtains and hotel drapes.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Spandex Activewear Jersey Knit Fabric', category: 'RAW MATERIALS', sku: 'AT-KNIT-101', price: 6.20, unit: 'kg', moq: 300, leadTime: '10 days', inStock: true, stockQuantity: 28000, image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80', description: '4-way stretch 88/12 polyester spandex circular knit fabric for yoga leggings.' },
      { vendorId: apexTextiles._id, vendorName: apexTextiles.name, name: 'Woven Organic Jute Area Rug Fabric', category: 'RAW MATERIALS', sku: 'AT-RUG-909', price: 12.50, unit: 'sqm', moq: 150, leadTime: '15 days', inStock: true, stockQuantity: 8000, image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=600&q=80', description: 'Hand-braided natural organic jute fiber floor rug material.' }
    ]);

    // 5. Empire Mills
    const empireMills = await Vendor.create({
      name: 'Empire Mills',
      tagline: 'Structural steel fabrication & heavy industrial mill products',
      logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      location: 'Gujranwala, Pakistan',
      country: 'Pakistan',
      rating: 4.6,
      reviewCount: 45,
      verificationStatus: 'Verified',
      responseTime: '< 4 hours',
      languages: ['English', 'Urdu'],
      overview: 'Empire Mills manufactures high-tensile structural steel I-beams, rebar grade 60, and custom industrial shed steel structures.',
      establishedYear: 1999,
      employeeCount: '250-500 Employees',
      factoryDetails: { area: '180,000 sq ft', productionLines: 4, annualOutput: '50,000 metric tons steel', videoTourUrl: 'https://www.youtube.com/embed/1vR_sW5h140' },
      certifications: [{ name: 'ASTM A615 Grade 60', issuer: 'PCSIR', year: '2023', verified: true }],
      exportCountries: [
        { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 50 },
        { country: "Oman", code: "OM", flag: "🇴🇲", percent: 30 },
        { country: "Bahrain", code: "BH", flag: "🇧🇭", percent: 20 }
      ],
      team: [{ name: 'Bilal Chaudhry', role: 'Operations Manager', email: 'bilal@empiremills.pk' }],
      riskBreakdown: { overallScore: 91, complianceRisk: 'Low', operationalRisk: 'Medium', financialRisk: 'Low' },
      contact: { email: 'info@empiremills.pk', phone: '+92-55-4223344', address: 'GT Road, Gujranwala, Pakistan' }
    });

    await Product.create([
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'High-Tensile Steel Rebar Grade 60', category: 'RAW MATERIALS', sku: 'EM-STEEL-60', price: 780.00, unit: 'ton', moq: 10, leadTime: '7 days', inStock: true, stockQuantity: 400, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', description: 'Deformed steel reinforcement bars conforming to ASTM A615 Grade 60.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'Universal Structural Steel I-Beam 250mm', category: 'RAW MATERIALS', sku: 'EM-BEAM-250', price: 850.00, unit: 'ton', moq: 5, leadTime: '10 days', inStock: true, stockQuantity: 250, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', description: 'Hot rolled S355JR structural steel I-beam section for building construction.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'Carbon Steel Plate 20mm Hot Rolled', category: 'RAW MATERIALS', sku: 'EM-PLT-100', price: 720.00, unit: 'ton', moq: 8, leadTime: '8 days', inStock: true, stockQuantity: 500, image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80', description: 'ASTM A36 heavy structural carbon steel sheet plate for storage tanks.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'Galvanized ERW Steel Structural Pipe', category: 'RAW MATERIALS', sku: 'EM-PIPE-400', price: 18.50, unit: 'meter', moq: 100, leadTime: '9 days', inStock: true, stockQuantity: 6000, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', description: 'Hot-dip galvanized schedule 40 steel pipe for scaffolding and trusses.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'Equal Leg Steel Angle Bar 75x75mm', category: 'RAW MATERIALS', sku: 'EM-ANG-303', price: 690.00, unit: 'ton', moq: 10, leadTime: '7 days', inStock: true, stockQuantity: 350, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80', description: 'Standard structural steel angle bar for transmission towers and frames.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'C-Channel Structural Steel Profile', category: 'RAW MATERIALS', sku: 'EM-CHAN-505', price: 710.00, unit: 'ton', moq: 10, leadTime: '8 days', inStock: true, stockQuantity: 300, image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80', description: 'Purlin C-channel steel section for commercial roof decking.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'High Carbon Steel Wire Rod Coils', category: 'RAW MATERIALS', sku: 'EM-WIRE-202', price: 640.00, unit: 'ton', moq: 15, leadTime: '12 days', inStock: true, stockQuantity: 800, image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80', description: '5.5mm high carbon steel wire rod coils for spring manufacturing.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'Pre-Engineered Steel Building Truss Frame', category: 'RAW MATERIALS', sku: 'EM-SHED-707', price: 12500.00, unit: 'set', moq: 1, leadTime: '25 days', inStock: true, stockQuantity: 15, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', description: 'Complete clear-span pre-engineered steel warehouse building structure kit.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'Welded Concrete Reinforcement Wire Mesh', category: 'RAW MATERIALS', sku: 'EM-MESH-808', price: 4.50, unit: 'sqm', moq: 500, leadTime: '10 days', inStock: true, stockQuantity: 25000, image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=600&q=80', description: 'A393 galvanized welded wire mesh sheets for slab concrete reinforcement.' },
      { vendorId: empireMills._id, vendorName: empireMills.name, name: 'Hollow Structural Rectangular Steel Tube', category: 'RAW MATERIALS', sku: 'EM-TUBE-909', price: 740.00, unit: 'ton', moq: 8, leadTime: '9 days', inStock: true, stockQuantity: 420, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', description: 'Cold formed welded structural hollow section steel tubing.' }
    ]);

    // 6. EuroTech
    const euroTech = await Vendor.create({
      name: 'EuroTech',
      tagline: 'Smart IoT controllers & industrial automation electronics',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      location: 'Islamabad, Pakistan',
      country: 'Pakistan',
      rating: 4.9,
      reviewCount: 78,
      verificationStatus: 'Verified',
      responseTime: '< 1 hour',
      languages: ['English', 'Urdu'],
      overview: 'EuroTech designs custom PCB microcontrollers, industrial RS485 IoT sensors, and automated PLC control panels for smart factory deployment.',
      establishedYear: 2012,
      employeeCount: '50-100 Employees',
      factoryDetails: { area: '25,000 sq ft', productionLines: 3, annualOutput: '150,000 IoT modules', videoTourUrl: 'https://www.youtube.com/embed/Vh4p3L0yQG4' },
      certifications: [
        { name: 'CE Mark Compliance', issuer: 'Eurofins', year: '2024', verified: true },
        { name: 'RoHS Directive', issuer: 'SGS', year: '2023', verified: true }
      ],
      exportCountries: [
        { country: "Germany", code: "DE", flag: "🇩🇪", percent: 45 },
        { country: "Netherlands", code: "NL", flag: "🇳🇱", percent: 35 },
        { country: "Sweden", code: "SE", flag: "🇸🇪", percent: 20 }
      ],
      team: [{ name: 'Dr. Shahbaz Khan', role: 'Head of Embedded Systems', email: 'shahbaz@eurotech.io' }],
      riskBreakdown: { overallScore: 97, complianceRisk: 'Low', operationalRisk: 'Low', financialRisk: 'Low' },
      contact: { email: 'contact@eurotech.io', phone: '+92-51-2244668', address: 'I-9 Industrial Area, Islamabad, Pakistan' }
    });

    await Product.create([
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'Industrial RS485 Wireless IoT Gateway', category: 'ELECTRONIC COMPONENTS', sku: 'ET-IOT-GW', price: 85.00, unit: 'unit', moq: 20, leadTime: '10 days', inStock: true, stockQuantity: 1800, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', description: 'DIN-rail mount RS485 Modbus to MQTT cellular/WiFi gateway with IP67 enclosure.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'Programmable Logic Controller Panel PLC', category: 'ELECTRONIC COMPONENTS', sku: 'ET-PLC-88', price: 340.00, unit: 'unit', moq: 5, leadTime: '12 days', inStock: true, stockQuantity: 600, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', description: '24V DC industrial PLC module with 14 digital inputs and 10 transistor outputs.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'Ultrasonic Liquid Level Sensor Modbus', category: 'ELECTRONIC COMPONENTS', sku: 'ET-SEN-303', price: 65.00, unit: 'piece', moq: 15, leadTime: '8 days', inStock: true, stockQuantity: 2500, image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80', description: 'Non-contact ultrasonic tank level transmitter for chemical process monitoring.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: '10.1 Inch Touchscreen Industrial HMI Display', category: 'ELECTRONIC COMPONENTS', sku: 'ET-HMI-700', price: 220.00, unit: 'unit', moq: 5, leadTime: '14 days', inStock: true, stockQuantity: 800, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', description: 'TFT LCD color touchscreen operator interface with Ethernet and RS232 ports.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'Variable Frequency Drive VFD 15kW 380V', category: 'ELECTRONIC COMPONENTS', sku: 'ET-DRV-505', price: 410.00, unit: 'unit', moq: 4, leadTime: '15 days', inStock: true, stockQuantity: 350, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80', description: 'Vector control VFD inverter for 3-phase AC induction motor speed regulation.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'DIN-Rail 16-Channel Relay Output Module', category: 'ELECTRONIC COMPONENTS', sku: 'ET-MOD-202', price: 48.00, unit: 'piece', moq: 25, leadTime: '7 days', inStock: true, stockQuantity: 3000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', description: 'Isolated Modbus RTU 16-channel digital relay isolation board for automation.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'PT100 Temperature Transmitter Modbus RTU', category: 'ELECTRONIC COMPONENTS', sku: 'ET-TEMP-404', price: 38.00, unit: 'piece', moq: 30, leadTime: '9 days', inStock: true, stockQuantity: 4500, image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80', description: 'High-accuracy RTD temperature sensor probe with RS485 digital output.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'Incremental Optical Shaft Encoder 1024 PPR', category: 'ELECTRONIC COMPONENTS', sku: 'ET-ENC-808', price: 52.00, unit: 'piece', moq: 20, leadTime: '10 days', inStock: true, stockQuantity: 2200, image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80', description: 'Rotary optical encoder for CNC motor positioning and speed measurement.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'Industrial DIN-Rail Power Supply 24V 10A', category: 'ELECTRONIC COMPONENTS', sku: 'ET-PWR-101', price: 35.00, unit: 'unit', moq: 40, leadTime: '6 days', inStock: true, stockQuantity: 5500, image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=600&q=80', description: '240W 24V DC regulated switching power supply with short circuit protection.' },
      { vendorId: euroTech._id, vendorName: euroTech.name, name: 'AC Servo Motor & Smart Servo Drive Kit', category: 'ELECTRONIC COMPONENTS', sku: 'ET-SER-909', price: 290.00, unit: 'set', moq: 5, leadTime: '14 days', inStock: true, stockQuantity: 400, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', description: '1.5kW 3000RPM high torque AC servo motor with matched digital drive.' }
    ]);

    console.log('Successfully seeded 6 Vendor Profiles and 60 Products into MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

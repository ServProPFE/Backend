// Seed script to populate the database with sample data
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Import models
const { User } = require("../models/User");
const { Service } = require("../models/Service");
const { Booking } = require("../models/Booking");
const { ReservationDetail } = require("../models/ReservationDetail");
const { Review } = require("../models/Review");
const { Offer } = require("../models/Offer");
const { Transaction } = require("../models/Transaction");

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  console.log("\n🗑️  Clearing existing data...");
  await User.deleteMany({});
  await Service.deleteMany({});
  await Booking.deleteMany({});
  await ReservationDetail.deleteMany({});
  await Review.deleteMany({});
  await Offer.deleteMany({});
  await Transaction.deleteMany({});
  console.log("✅ Database cleared");
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();
    await clearDatabase();

    // Hash password for all users
    const hashedPassword = await bcrypt.hash("password123", 10);

    console.log("\n👥 Creating users...");
    
    // Create Clients
    const clients = await User.create([
      {
        type: "CLIENT",
        name: "Ahmed Ben Ali",
        email: "ahmed@client.com",
        phone: "+216 98 123 456",
        passwordHash: hashedPassword,
      },
      {
        type: "CLIENT",
        name: "Fatima Mansour",
        email: "fatima@client.com",
        phone: "+216 98 234 567",
        passwordHash: hashedPassword,
      },
      {
        type: "CLIENT",
        name: "Mohamed Trabelsi",
        email: "mohamed@client.com",
        phone: "+216 98 345 678",
        passwordHash: hashedPassword,
      },
    ]);
    console.log(`✅ Created ${clients.length} clients`);

    // Create Providers
    const providers = await User.create([
      {
        type: "PROVIDER",
        name: "Hassan El Plombier",
        email: "hassan@provider.com",
        phone: "+216 98 456 789",
        passwordHash: hashedPassword,
        providerProfile: {
          companyName: "Hassan Plomberie Services",
          license: "PLB-2024-001",
          insurance: "INS-PLB-123456",
          experienceYears: 8,
          serviceRadius: 50,
          verificationStatus: "VERIFIED",
        },
      },
      {
        type: "PROVIDER",
        name: "Karim El Electricien",
        email: "karim@provider.com",
        phone: "+216 98 567 890",
        passwordHash: hashedPassword,
        providerProfile: {
          companyName: "Karim Électricité Pro",
          license: "ELEC-2024-002",
          insurance: "INS-ELEC-234567",
          experienceYears: 12,
          serviceRadius: 30,
          verificationStatus: "VERIFIED",
        },
      },
      {
        type: "PROVIDER",
        name: "Salah Climatisation",
        email: "salah@provider.com",
        phone: "+216 98 678 901",
        passwordHash: hashedPassword,
        providerProfile: {
          companyName: "Salah Clim Services",
          license: "CLIM-2024-003",
          insurance: "INS-CLIM-345678",
          experienceYears: 10,
          serviceRadius: 40,
          verificationStatus: "VERIFIED",
        },
      },
      {
        type: "PROVIDER",
        name: "Amira Nettoyage",
        email: "amira@provider.com",
        phone: "+216 98 789 012",
        passwordHash: hashedPassword,
        providerProfile: {
          companyName: "Amira Clean Pro",
          license: "CLEAN-2024-004",
          insurance: "INS-CLEAN-456789",
          experienceYears: 5,
          serviceRadius: 25,
          verificationStatus: "VERIFIED",
        },
      },
      {
        type: "PROVIDER",
        name: "Youssef Multi-Services",
        email: "youssef@provider.com",
        phone: "+216 98 890 123",
        passwordHash: hashedPassword,
        providerProfile: {
          companyName: "Youssef Services Généraux",
          license: "MULTI-2024-005",
          insurance: "INS-MULTI-567890",
          experienceYears: 15,
          serviceRadius: 60,
          verificationStatus: "VERIFIED",
        },
      },
    ]);
    console.log(`✅ Created ${providers.length} providers`);

    // Create Admin
    const admin = await User.create({
      type: "ADMIN",
      name: "Admin User",
      email: "admin@servpro.com",
      phone: "+216 98 000 000",
      passwordHash: hashedPassword,
    });
    console.log("✅ Created admin user");

    console.log("\n🛠️  Creating services...");
    
    // Services for each provider
    const services = await Service.create([
      // Hassan - Plomberie
      {
        provider: providers[0]._id,
        name: "Réparation fuite d'eau",
        category: "PLOMBERIE",
        priceMin: 50,
        duration: 60,
        currency: "TND",
      },
      {
        provider: providers[0]._id,
        name: "Installation sanitaire complète",
        category: "PLOMBERIE",
        priceMin: 200,
        duration: 180,
        currency: "TND",
      },
      {
        provider: providers[0]._id,
        name: "Débouchage canalisation",
        category: "PLOMBERIE",
        priceMin: 40,
        duration: 45,
        currency: "TND",
      },
      
      // Karim - Électricité
      {
        provider: providers[1]._id,
        name: "Installation électrique maison",
        category: "ELECTRICITE",
        priceMin: 300,
        duration: 240,
        currency: "TND",
      },
      {
        provider: providers[1]._id,
        name: "Réparation panne électrique",
        category: "ELECTRICITE",
        priceMin: 60,
        duration: 90,
        currency: "TND",
      },
      {
        provider: providers[1]._id,
        name: "Installation tableau électrique",
        category: "ELECTRICITE",
        priceMin: 150,
        duration: 120,
        currency: "TND",
      },
      
      // Salah - Climatisation
      {
        provider: providers[2]._id,
        name: "Installation climatiseur split",
        category: "CLIMATISATION",
        priceMin: 400,
        duration: 180,
        currency: "TND",
      },
      {
        provider: providers[2]._id,
        name: "Maintenance climatisation",
        category: "CLIMATISATION",
        priceMin: 80,
        duration: 60,
        currency: "TND",
      },
      {
        provider: providers[2]._id,
        name: "Réparation climatiseur",
        category: "CLIMATISATION",
        priceMin: 100,
        duration: 90,
        currency: "TND",
      },
      
      // Amira - Nettoyage
      {
        provider: providers[3]._id,
        name: "Nettoyage appartement complet",
        category: "NETTOYAGE",
        priceMin: 70,
        duration: 120,
        currency: "TND",
      },
      {
        provider: providers[3]._id,
        name: "Nettoyage après travaux",
        category: "NETTOYAGE",
        priceMin: 120,
        duration: 180,
        currency: "TND",
      },
      {
        provider: providers[3]._id,
        name: "Nettoyage vitres et façades",
        category: "NETTOYAGE",
        priceMin: 50,
        duration: 90,
        currency: "TND",
      },
      
      // Youssef - Multi-services
      {
        provider: providers[4]._id,
        name: "Dépannage urgent 24/7",
        category: "AUTRE",
        priceMin: 80,
        duration: 60,
        currency: "TND",
      },
      {
        provider: providers[4]._id,
        name: "Petits travaux de bricolage",
        category: "AUTRE",
        priceMin: 45,
        duration: 90,
        currency: "TND",
      },
    ]);
    console.log(`✅ Created ${services.length} services`);

    console.log("\n🎁 Creating offers...");
    
    // Create some offers with discounts
    const offers = await Offer.create([
      {
        title: "Promotion Plomberie - 20% de réduction",
        basePrice: services[0].priceMin,
        discount: 20,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        active: true,
        service: services[0]._id,
      },
      {
        title: "Offre Climatisation - 15% de réduction",
        basePrice: services[6].priceMin,
        discount: 15,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        active: true,
        service: services[6]._id,
      },
      {
        title: "Nettoyage Printemps - 25% de réduction",
        basePrice: services[9].priceMin,
        discount: 25,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        active: true,
        service: services[9]._id,
      },
    ]);
    console.log(`✅ Created ${offers.length} offers`);

    console.log("\n📋 Creating reservation details...");
    
    // Create reservation details
    const reservationDetails = await ReservationDetail.create([
      {
        description: "Fuite d'eau sous l'évier de la cuisine",
        address: "Rue de la République, Tunis",
        urgent: true,
      },
      {
        description: "Installation d'un nouveau climatiseur dans le salon",
        address: "Avenue Habib Bourguiba, Sfax",
        urgent: false,
      },
      {
        description: "Nettoyage complet de l'appartement avant emménagement",
        address: "Rue Ibn Khaldoun, Sousse",
        urgent: false,
      },
      {
        description: "Panne électrique dans toute la maison",
        address: "Avenue de la Liberté, Bizerte",
        urgent: true,
      },
      {
        description: "Débouchage des canalisations de la salle de bain",
        address: "Rue Mongi Slim, Nabeul",
        urgent: false,
      },
      {
        description: "Maintenance préventive climatisation",
        address: "Avenue Mohamed V, Monastir",
        urgent: false,
      },
    ]);
    console.log(`✅ Created ${reservationDetails.length} reservation details`);

    console.log("\n📅 Creating bookings...");
    
    // Create bookings with different statuses
    const bookings = await Booking.create([
      // DONE - completed booking
      {
        client: clients[0]._id,
        provider: providers[0]._id,
        service: services[0]._id,
        status: "DONE",
        expectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        totalPrice: 50,
        currency: "TND",
        detail: reservationDetails[0]._id,
      },
      // CONFIRMED - will be in progress
      {
        client: clients[1]._id,
        provider: providers[2]._id,
        service: services[6]._id,
        status: "CONFIRMED",
        expectedAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        totalPrice: 400,
        currency: "TND",
        detail: reservationDetails[1]._id,
      },
      // DONE - completed booking
      {
        client: clients[2]._id,
        provider: providers[3]._id,
        service: services[9]._id,
        status: "DONE",
        expectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        totalPrice: 70,
        currency: "TND",
        detail: reservationDetails[2]._id,
      },
      // IN_PROGRESS
      {
        client: clients[0]._id,
        provider: providers[1]._id,
        service: services[4]._id,
        status: "IN_PROGRESS",
        expectedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        totalPrice: 60,
        currency: "TND",
        detail: reservationDetails[3]._id,
      },
      // PENDING
      {
        client: clients[1]._id,
        provider: providers[0]._id,
        service: services[2]._id,
        status: "PENDING",
        expectedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        totalPrice: 40,
        currency: "TND",
        detail: reservationDetails[4]._id,
      },
      // CONFIRMED
      {
        client: clients[2]._id,
        provider: providers[2]._id,
        service: services[7]._id,
        status: "CONFIRMED",
        expectedAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
        totalPrice: 80,
        currency: "TND",
        detail: reservationDetails[5]._id,
      },
    ]);
    console.log(`✅ Created ${bookings.length} bookings`);

    console.log("\n⭐ Creating reviews...");
    
    // Create reviews for completed bookings
    const reviews = await Review.create([
      {
        reservation: bookings[0]._id,
        reviewer: clients[0]._id,
        provider: providers[0]._id,
        score: 5,
        comment: "Excellent service! Très professionnel et rapide. Je recommande vivement.",
      },
      {
        reservation: bookings[2]._id,
        reviewer: clients[2]._id,
        provider: providers[3]._id,
        score: 4,
        comment: "Bon travail, appartement bien nettoyé. Pourrait être un peu plus rapide.",
      },
    ]);
    console.log(`✅ Created ${reviews.length} reviews`);

    console.log("\n💳 Creating transactions...");
    
    // Create transactions for confirmed/completed bookings
    const transactions = await Transaction.create([
      {
        booking: bookings[0]._id,
        amount: bookings[0].totalPrice,
        currency: "TND",
        method: "CARD",
        status: "SUCCESS",
      },
      {
        booking: bookings[1]._id,
        amount: bookings[1].totalPrice,
        currency: "TND",
        method: "CASH",
        status: "PENDING",
      },
      {
        booking: bookings[2]._id,
        amount: bookings[2].totalPrice,
        currency: "TND",
        method: "PAYPAL",
        status: "SUCCESS",
      },
      {
        booking: bookings[5]._id,
        amount: bookings[5].totalPrice,
        currency: "TND",
        method: "KNET",
        status: "SUCCESS",
      },
    ]);
    console.log(`✅ Created ${transactions.length} transactions`);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("✅ DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📊 Summary:");
    console.log(`   • ${clients.length} Clients`);
    console.log(`   • ${providers.length} Providers`);
    console.log(`   • 1 Admin`);
    console.log(`   • ${services.length} Services`);
    console.log(`   • ${offers.length} Offers`);
    console.log(`   • ${bookings.length} Bookings`);
    console.log(`   • ${reviews.length} Reviews`);
    console.log(`   • ${transactions.length} Transactions`);
    
    console.log("\n🔐 Login Credentials:");
    console.log("   Password for all users: password123");
    console.log("\n   Clients:");
    console.log("   • ahmed@client.com");
    console.log("   • fatima@client.com");
    console.log("   • mohamed@client.com");
    console.log("\n   Providers:");
    console.log("   • hassan@provider.com (Plomberie)");
    console.log("   • karim@provider.com (Électricité)");
    console.log("   • salah@provider.com (Climatisation)");
    console.log("   • amira@provider.com (Nettoyage)");
    console.log("   • youssef@provider.com (Multi-services)");
    console.log("\n   Admin:");
    console.log("   • admin@servpro.com");
    console.log("\n" + "=".repeat(50) + "\n");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

// Run the seed script
seedData();

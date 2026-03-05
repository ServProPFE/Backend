//Importer les modeles et les utilitaires nécessaires
const { Booking } = require("../models/Booking");
const { Transaction } = require("../models/Transaction");
const { asyncHandler } = require("../utils/asyncHandler");

//Créer une nouvelle réservation
const createBooking = asyncHandler(async (req, res) => {
  const {
    client,
    provider,
    service,
    status,
    expectedAt,
    totalPrice,
    currency,
    detail,
    tracking,
  } = req.body;

  const booking = await Booking.create({
    client,
    provider,
    service,
    status,
    expectedAt,
    totalPrice,
    currency,
    detail,
    tracking,
  });

  // Automatically create a transaction if booking is created as CONFIRMED
  if (status === 'CONFIRMED') {
    try {
      await Transaction.create({
        booking: booking._id,
        amount: totalPrice,
        currency: currency || 'TND',
        method: 'CASH', // Default payment method
        status: 'PENDING',
      });
    } catch (transactionError) {
      // Log error but don't fail the booking creation
      console.error('Failed to create transaction:', transactionError);
    }
  }

  res.status(201).json(booking);
});

//Mettre à jour le statut d'une réservation
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id)
    .populate('client', 'name email phone')
    .populate('service', 'name')
    .populate('provider', 'name');

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  const oldStatus = booking.status;
  booking.status = status;

  await booking.save();

  // Automatically create a transaction when booking is confirmed
  if (status === 'CONFIRMED' && oldStatus !== 'CONFIRMED') {
    try {
      const existingTransaction = await Transaction.findOne({ booking: booking._id });
      
      // Only create if no transaction exists for this booking
      if (!existingTransaction) {
        await Transaction.create({
          booking: booking._id,
          amount: booking.totalPrice,
          currency: booking.currency || 'TND',
          method: 'CASH', // Default payment method
          status: 'PENDING',
        });
      }
    } catch (transactionError) {
      // Log error but don't fail the booking status update
      console.error('Failed to create transaction:', transactionError);
    }
  }

  res.json(booking);
});

//Supprimer une réservation
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Booking deleted" });
});

//Lister les réservations avec des filtres optionnels
const listBookings = asyncHandler(async (req, res) => {
  const { clientId, providerId, status } = req.query;
  const query = {};
  
  if (clientId) {
    query.client = clientId;
  }
  if (providerId) {
    query.provider = providerId;
  }
  if (status) {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate('client', 'name email phone')
    .populate('service', 'name')
    .populate('provider', 'name')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ items: bookings });
});

//Lister une réservation par ID
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('client', 'name email phone')
    .populate('service', 'name')
    .populate('provider', 'name')
    .lean();
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(booking);
});

//Exporter les fonctions du contrôleur
module.exports = { createBooking, updateBookingStatus, deleteBooking, listBookings, getBookingById };

//Importer les modeles et les utilitaires nécessaires
const { Booking } = require("../models/Booking");
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

  res.status(201).json(booking);
});

//Mettre à jour le statut d'une réservation
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  booking.status = status;

  await booking.save();

  res.json(booking);
});

//Supprimer une réservation
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }
    await booking.remove();
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

  const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();

  res.json({ items: bookings });
});

//Lister une réservation par ID
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).lean();
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(booking);
});

//Exporter les fonctions du contrôleur
module.exports = { createBooking, updateBookingStatus, deleteBooking, listBookings, getBookingById };

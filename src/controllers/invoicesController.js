//Importer les modeles et les utilitaires nécessaires
const { Invoice } = require("../models/Invoice");
const { Booking } = require("../models/Booking");
const { asyncHandler } = require("../utils/asyncHandler");

//Lister les factures avec un filtre optionnel
const listInvoices = asyncHandler(async (req, res) => {
  const { bookingId } = req.query;
  const query = {};

  if (bookingId) {
    query.booking = bookingId;
  }

  if (req.user?.type === "PROVIDER") {
    const bookings = await Booking.find({ provider: req.user.id })
      .select("_id")
      .lean();
    const bookingIds = bookings.map((b) => b._id.toString());

    if (bookingId && !bookingIds.includes(bookingId)) {
      return res.json({ items: [] });
    }

    if (bookingId) {
      query.booking = bookingId;
    } else {
      query.booking = { $in: bookingIds };
    }
  }

  const invoices = await Invoice.find(query).sort({ createdAt: -1 }).lean();

  res.json({ items: invoices });
});

//Obtenir une facture par ID
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).lean();
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(invoice);
});

//Créer une nouvelle facture
const createInvoice = asyncHandler(async (req, res) => {
  const { number, total, issuedAt, booking } = req.body;

  const invoice = await Invoice.create({ number, total, issuedAt, booking });

  res.status(201).json(invoice);
});

//Mettre à jour une facture
const updateInvoice = asyncHandler(async (req, res) => {
  const { number, total, issuedAt } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      const error = new Error("Invoice not found");
      error.statusCode = 404;
      throw error;
    }
    Object.assign(invoice, { number, total, issuedAt });
    await invoice.save();
    res.json(invoice);
});

//Supprimer une facture
const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      const error = new Error("Invoice not found");
      error.statusCode = 404;
      throw error;
    }
    await invoice.remove();
    res.json({ message: "Invoice deleted" });
});

//Exporter les fonctions du contrôleur
module.exports = { listInvoices, createInvoice, updateInvoice, deleteInvoice, getInvoiceById };

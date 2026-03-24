//Importer les modeles et les utilitaires nécessaires
const { Invoice } = require("../models/Invoice");
const { asyncHandler } = require("../utils/asyncHandler");

//Lister les factures avec un filtre optionnel
const listInvoices = asyncHandler(async (req, res) => {
  const { bookingId } = req.query;
  const query = {};

  if (bookingId) {
    query.booking = bookingId;
  }

  let invoices = await Invoice.find(query)
    .populate({
      path: 'booking',
      select: 'client provider service totalPrice',
      populate: [
        { path: 'client', select: 'name email' },
        { path: 'provider', select: 'name email' },
        { path: 'service', select: 'name' }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();

  if (req.user?.type === "PROVIDER") {
    const providerId = (req.user.id || req.user._id || '').toString();
    invoices = invoices.filter((invoice) => {
      const bookingProvider = invoice.booking?.provider;
      const bookingProviderId = (bookingProvider?._id || bookingProvider || '').toString();
      return bookingProviderId === providerId;
    });
  }

  res.json({ items: invoices });
});

//Obtenir une facture par ID
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate({
      path: 'booking',
      select: 'client provider service totalPrice',
      populate: [
        { path: 'client', select: 'name email' },
        { path: 'provider', select: 'name email' },
        { path: 'service', select: 'name' }
      ]
    })
    .lean();
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
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Invoice deleted" });
});

//Exporter les fonctions du contrôleur
module.exports = { listInvoices, createInvoice, updateInvoice, deleteInvoice, getInvoiceById };

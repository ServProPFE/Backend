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

  const invoices = await Invoice.find(query).sort({ createdAt: -1 }).lean();

  res.json({ items: invoices });
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
module.exports = { listInvoices, createInvoice, updateInvoice, deleteInvoice };

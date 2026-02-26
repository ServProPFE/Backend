const{Transaction} = require("../models/Transaction");
const { asyncHandler } = require("../utils/asyncHandler");

//Créer une nouvelle transaction
const createTransaction = asyncHandler(async (req, res) => {
  const { booking, amount, currency, method, status } = req.body;
    const transaction = await Transaction.create({
    booking,
    amount,
    currency,
    method: method || 'CASH',
    status,
  });
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate({
        path: 'booking',
        select: 'client provider service totalPrice expectedAt status',
        populate: [
          { path: 'service', select: 'name' },
          { path: 'provider', select: 'name' },
          { path: 'client', select: 'name' }
        ]
      });
    res.status(201).json(populatedTransaction);
});

//Obtenir une transaction par ID
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate({
      path: 'booking',
      select: 'client provider service totalPrice expectedAt status',
      populate: [
        { path: 'service', select: 'name' },
        { path: 'provider', select: 'name' },
        { path: 'client', select: 'name' }
      ]
    })
    .lean();
  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(transaction);
});

//Mettre à jour le statut d'une transaction
const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      const error = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }
    transaction.status = status;
    await transaction.save();
    const updatedTransaction = await Transaction.findById(req.params.id)
      .populate({
        path: 'booking',
        select: 'client provider service totalPrice expectedAt status',
        populate: [
          { path: 'service', select: 'name' },
          { path: 'provider', select: 'name' },
          { path: 'client', select: 'name' }
        ]
      });
    res.json(updatedTransaction);
});

//Supprimer une transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      const error = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }
    await transaction.remove();
    res.json({ message: "Transaction deleted" });
});

//Lister toutes les transactions
const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate({
      path: 'booking',
      select: 'client provider service totalPrice expectedAt status',
      populate: [
        { path: 'service', select: 'name' },
        { path: 'provider', select: 'name' },
        { path: 'client', select: 'name' }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ items: transactions });
});

//Exporter les fonctions du contrôleur
module.exports = { createTransaction, updateTransactionStatus, deleteTransaction, listTransactions, getTransactionById };
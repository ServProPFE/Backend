//Importer les modeles et les utilitaires nécessaires
const { Review } = require("../models/Review");
const { asyncHandler } = require("../utils/asyncHandler");

//Créer une nouvelle évaluation
const createReview = asyncHandler(async (req, res) => {
  const { reservation, reviewer, provider, score, comment } = req.body;
  const review = await Review.create({
    reservation,
    reviewer,
    provider,
    score,
    comment,
  });

  res.status(201).json(review);
});

//Lister les évaluations d'un prestataire
const listReviewsByProvider = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const reviews = await Review.find({ provider: providerId }).sort({ createdAt: -1 }).lean();
  res.json({ items: reviews });
});

//Lister les évaluations d'un client
const listReviewsByClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const reviews = await Review.find({ reviewer: clientId }).sort({ createdAt: -1 }).lean();
  res.json({ items: reviews });
});

//Supprimer une évaluation
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
    if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }
    await review.remove();
    res.json({ message: "Review deleted" });
});

//Mettre à jour une évaluation
const updateReview = asyncHandler(async (req, res) => {
  const { score, comment } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }
    Object.assign(review, { score, comment });
    await review.save();
    res.json(review);
});

//Lister tous les évaluations
const listReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).lean();
  res.json({ items: reviews });
});

//Exporter les fonctions du contrôleur
module.exports = { createReview, listReviewsByProvider, listReviewsByClient, deleteReview, updateReview, listReviews };

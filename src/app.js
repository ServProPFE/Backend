//Importer les modules nécessaires
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

//Importer les routes et le middleware
const { errorHandler } = require("./middleware/errorHandler");
const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const servicesRoutes = require("./routes/services");
const bookingsRoutes = require("./routes/bookings");
const reviewsRoutes = require("./routes/reviews");
const offersRoutes = require("./routes/offers");
const packagesRoutes = require("./routes/packages");
const invoicesRoutes = require("./routes/invoices");
const commissionsRoutes = require("./routes/commissions");
const reservationDetailsRoutes = require("./routes/reservationDetails");
const trackingRoutes = require("./routes/tracking");
const portfoliosRoutes = require("./routes/portfolios");
const competencesRoutes = require("./routes/competences");
const certificationsRoutes = require("./routes/certifications");
const availabilityRoutes = require("./routes/availability");
const notationsRoutes = require("./routes/notations");

//Créer une application Express
const app = express();

//Configurer les middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Définir les routes
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/services", servicesRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/offers", offersRoutes);
app.use("/packages", packagesRoutes);
app.use("/invoices", invoicesRoutes);
app.use("/commissions", commissionsRoutes);
app.use("/reservation-details", reservationDetailsRoutes);
app.use("/tracking", trackingRoutes);
app.use("/portfolios", portfoliosRoutes);
app.use("/competences", competencesRoutes);
app.use("/certifications", certificationsRoutes);
app.use("/availability", availabilityRoutes);
app.use("/notations", notationsRoutes);

//Configurer le middleware de gestion des erreurs
app.use(errorHandler);

//Exporter l'application Express
module.exports = { app };

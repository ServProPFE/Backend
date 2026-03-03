const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  getChatbotResponse,
  getChatbotSuggestions
} = require("../controllers/chatbotController");

const router = express.Router();

// Chatbot endpoints
router.post("/", authenticate, getChatbotResponse);
router.get("/suggestions", getChatbotSuggestions);

module.exports = router;

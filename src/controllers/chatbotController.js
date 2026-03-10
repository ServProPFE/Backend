const axios = require('axios');
const { Service } = require("../models/Service");
const { asyncHandler } = require("../utils/asyncHandler");

// Python AI service URL
const PYTHON_AI_SERVICE = process.env.PYTHON_AI_SERVICE || 'http://localhost:5000';

// Get chatbot response with Python AI analysis
const getChatbotResponse = asyncHandler(async (req, res) => {
  const { message, language = 'en' } = req.body;

  if (!message || message.trim() === '') {
    const error = new Error(language === 'ar' ? 'الرسالة فارغة' : 'Message cannot be empty');
    error.statusCode = 400;
    throw error;
  }

  let aiAnalysis;
  try {
    // Call Python AI service for NLP analysis
    const aiResponse = await axios.post(`${PYTHON_AI_SERVICE}/recommend`, {
      text: message,
      language: language
    }, { timeout: 5000 });

    aiAnalysis = aiResponse.data;
  } catch (aiError) {
    console.error('Python AI service error:', aiError.message);
    const error = new Error(
      language === 'ar' 
        ? 'خدمة الذكاء الاصطناعي غير متاحة' 
        : 'AI service is currently unavailable'
    );
    error.statusCode = 503;
    throw error;
  }

  const { detected_service, confidence, recommendations } = aiAnalysis;

  // If service detected, fetch actual service from DB
  let recommendedService = null;
  if (detected_service && confidence >= 0.08) {
    // Map detected service to category
    const categoryMap = {
      'plomberie': 'PLOMBERIE',
      'electricite': 'ELECTRICITE',
      'climatisation': 'CLIMATISATION',
      'nettoyage': 'NETTOYAGE'
    };

    const category = categoryMap[detected_service];
    if (category) {
      recommendedService = await Service.findOne({ category })
        .populate('provider', 'name email phone')
        .lean();
    }
  }

  // Generate bot message
  let botMessage = '';
  if (recommendations && recommendations.length > 0) {
    botMessage = recommendations[0].message;
  } else if (aiAnalysis.message) {
    // Use the message from Python AI (Gemini fallback or error message)
    botMessage = aiAnalysis.message;
  } else {
    botMessage = language === 'ar' 
      ? 'عذراً، لم أتمكن من فهم طلبك. يرجى تحديد الخدمة المطلوبة: السباكة، الكهرباء، التكييف، أو التنظيف.' 
      : 'Sorry, I couldn\'t understand your request. Please specify: plumbing, electrical, AC, or cleaning services.';
  }

  const response = {
    message: botMessage,
    detectedService: detected_service,
    confidence: confidence,
    recommendedService: recommendedService ? {
      id: recommendedService._id,
      name: recommendedService.name,
      category: recommendedService.category,
      priceMin: recommendedService.priceMin,
      duration: recommendedService.duration,
      provider: {
        _id: recommendedService.provider._id,
        name: recommendedService.provider.name,
        email: recommendedService.provider.email,
        phone: recommendedService.provider.phone
      },
      currency: recommendedService.currency || 'TND'
    } : null,
    aiModel: aiAnalysis.source === 'gemini_fallback' ? 'Gemini AI (Fallback)' : 'TF-IDF + Cosine Similarity (Python)',
    geminiUsed: aiAnalysis.fallback_used || false,
    allScores: aiAnalysis.all_scores,
    timestamp: new Date()
  };

  res.json(response);
});

// Analyze text in detail (for debugging/admin)
const analyzeChatbotInput = asyncHandler(async (req, res) => {
  const { text, language = 'en' } = req.body;

  if (!text) {
    const error = new Error('Text is required');
    error.statusCode = 400;
    throw error;
  }

  try {
    const analysisResponse = await axios.post(`${PYTHON_AI_SERVICE}/analyze`, {
      text: text,
      language: language
    }, { timeout: 5000 });

    res.json(analysisResponse.data);

  } catch (error) {
    console.error('Analysis error:', error.message);
    const err = new Error('Analysis failed');
    err.statusCode = 500;
    throw err;
  }
});

// Get chatbot suggestions based on service category
const getChatbotSuggestions = asyncHandler(async (req, res) => {
  const { language = 'en' } = req.query;

  const suggestions = {
    en: [
      "I need a plumber for a leaky faucet",
      "My air conditioning is not working",
      "I need an electrician for wiring",
      "Looking for cleaning services",
      "Need help with home repairs"
    ],
    ar: [
      "أحتاج سباك لحنفية تسرب",
      "جهاز التكييف لا يعمل",
      "أحتاج كهربائي للأسلاك",
      "أبحث عن خدمات التنظيف",
      "أحتاج مساعدة في إصلاحات المنزل"
    ]
  };

  res.json({
    suggestions: suggestions[language] || suggestions['en'],
    language: language || 'en'
  });
});

// Health check for Python AI service
const checkAIHealth = asyncHandler(async (req, res) => {
  try {
    const healthResponse = await axios.get(`${PYTHON_AI_SERVICE}/health`, { timeout: 3000 });
    
    res.json({
      status: 'online',
      nodeBackend: 'online',
      pythonAI: healthResponse.data,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('AI service health check failed:', error.message);
    
    res.status(503).json({
      status: 'degraded',
      nodeBackend: 'online',
      pythonAI: {
        status: 'offline',
        error: 'Python AI service is not responding',
        url: PYTHON_AI_SERVICE
      },
      timestamp: new Date()
    });
  }
});

module.exports = {
  getChatbotResponse,
  analyzeChatbotInput,
  getChatbotSuggestions,
  checkAIHealth
};

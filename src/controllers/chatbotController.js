const { Service } = require("../models/Service");
const { asyncHandler } = require("../utils/asyncHandler");

// Simple keyword-based service recommendation
// This is a simplified version that can be enhanced with Python AI integration
const getChatbotResponse = asyncHandler(async (req, res) => {
  const { message, language = 'en' } = req.body;

  if (!message) {
    const error = new Error("Message is required");
    error.statusCode = 400;
    throw error;
  }

  // Fetch all services for recommendation
  const services = await Service.find()
    .populate('provider', 'name')
    .lean();

  // Simple keyword matching for service categories
  const messageLower = message.toLowerCase();
  let recommendedService = null;
  let confidence = 0;
  let intent = 'GENERAL_INQUIRY';

  // Keyword matching for different service categories
  const keywords = {
    PLOMBERIE: ['plumb', 'plomberie', 'pipe', 'leak', 'faucet', 'water', 'drain', 'toilet', 'sink', 'تسرب', 'سباكة', 'أنبوب', 'حنفية', 'ماء'],
    ELECTRICITE: ['electric', 'électricité', 'wiring', 'power', 'outlet', 'circuit', 'breaker', 'light', 'electrician', 'كهرباء', 'كهربائي', 'أسلاك', 'مقبس'],
    CLIMATISATION: ['ac', 'air conditioning', 'climatisation', 'hvac', 'heating', 'cooling', 'thermostat', 'تكييف', 'تبريد', 'تدفئة'],
    NETTOYAGE: ['clean', 'nettoyage', 'cleaning', 'housekeeping', 'maid', 'تنظيف', 'نظافة']
  };

  // Find matching category
  let matchedCategory = null;
  let maxMatches = 0;

  for (const [category, words] of Object.entries(keywords)) {
    const matches = words.filter(word => messageLower.includes(word)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      matchedCategory = category;
      confidence = Math.min(matches * 0.25, 0.95);
      intent = category;
    }
  }

  // Find services matching the category
  if (matchedCategory) {
    const matchingServices = services.filter(s => s.category === matchedCategory);
    if (matchingServices.length > 0) {
      // Get the first matching service or prioritize based on rating
      recommendedService = matchingServices.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    }
  }

  // If no specific match, get general services
  if (!recommendedService && services.length > 0) {
    recommendedService = services[0];
    confidence = 0.3;
  }

  // Generate response based on language
  const responses = {
    en: {
      greeting: "Hello! I'm here to help you find the right service.",
      recommendation: recommendedService 
        ? `Great news! I found a highly recommended service for you: **${recommendedService.name}** by ${recommendedService.provider?.name || 'our provider'}.\n\nPrice: Starting from ${recommendedService.priceMin} ${recommendedService.currency || 'TND'}\nDuration: ${recommendedService.duration} minutes\nCategory: ${recommendedService.category}`
        : "I'm sorry, I couldn't find a specific service match. Please browse our available services or contact support for assistance.",
      confidence: confidence > 0.5 
        ? `I'm quite confident about this recommendation (Confidence: ${(confidence * 100).toFixed(0)}%).`
        : `While I'm suggesting this service, please feel free to browse more options (Confidence: ${(confidence * 100).toFixed(0)}%).`,
      help: "How else can I help you today? You can ask about plumbing, electrical work, air conditioning, or cleaning services."
    },
    ar: {
      greeting: "مرحبا! أنا هنا لمساعدتك في العثور على الخدمة المناسبة.",
      recommendation: recommendedService
        ? `أخبار رائعة! وجدت خدمة موصى بها بشدة لك: **${recommendedService.name}** من ${recommendedService.provider?.name || 'مزودنا'}.\n\nالسعر: ابتداءً من ${recommendedService.priceMin} ${recommendedService.currency || 'TND'}\nالمدة: ${recommendedService.duration} دقيقة\nالفئة: ${recommendedService.category}`
        : "أعتذر، لم أتمكن من العثور على خدمة محددة. يرجى تصفح خدماتنا المتاحة أو الاتصال بالدعم للحصول على المساعدة.",
      confidence: confidence > 0.5
        ? `أنا واثق تماماً من هذه التوصية (الثقة: ${(confidence * 100).toFixed(0)}%).`
        : `بينما أقترح هذه الخدمة، لا تتردد في تصفح المزيد من الخيارات (الثقة: ${(confidence * 100).toFixed(0)}%).`,
      help: "كيف يمكنني مساعدتك اليوم؟ يمكنك السؤال عن السباكة أو الأعمال الكهربائية أو تكييف الهواء أو خدمات التنظيف."
    }
  };

  const lang = language === 'ar' ? 'ar' : 'en';
  const response = {
    message: `${responses[lang].greeting}\n\n${responses[lang].recommendation}\n\n${responses[lang].confidence}\n\n${responses[lang].help}`,
    recommendedService: recommendedService ? {
      id: recommendedService._id,
      name: recommendedService.name,
      category: recommendedService.category,
      provider: recommendedService.provider?.name,
      priceMin: recommendedService.priceMin,
      duration: recommendedService.duration,
      currency: recommendedService.currency || 'TND'
    } : null,
    confidence: confidence,
    intent: intent,
    timestamp: new Date()
  };

  res.json(response);
});

// Get chatbot suggestions based on service category
const getChatbotSuggestions = asyncHandler(async (req, res) => {
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

  res.json(suggestions);
});

module.exports = {
  getChatbotResponse,
  getChatbotSuggestions
};

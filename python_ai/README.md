# Python AI Chatbot Service

This is a Flask-based microservice that provides intent detection for the chatbot using a lightweight pure-Python TF-IDF + cosine similarity engine (no scikit-learn / numpy required).

## Architecture

```
Frontend (React)
    ↓
Node.js Backend (Port 4000)
    ↓
Python AI Service (Port 5000) ← TF-IDF + Cosine Similarity
    ↓
MongoDB (Services Database)
```

## Features

- **Pure Python NLP Engine**: TF-IDF + cosine similarity implemented without external ML libraries
- **Hybrid Scoring**: Weighted score from cosine similarity + keyword overlap
- **Actionable Responses**: Returns service-specific guidance (not confidence only)
- **Issue Type Detection**: Detects subtype hints (e.g., leak, wiring, no cooling, dust)
- **Bilingual Support**: English and Arabic response generation, with multilingual keyword sets (EN/FR/AR)
- **Arabic Token Normalization**: Handles common prefixes to improve matching quality
- **Detailed Debug Output**: Per-service `all_scores` with `cosine_score`, `keyword_score`, and `matched_keywords`

## Installation

### Prerequisites

- Python 3.9+
- pip (Python package manager)

### Setup

1. **Install Dependencies**:
```bash
cd ServProBackend/python_ai
pip install -r requirements.txt
```

2. **Verify Installation**:
```bash
python -m flask --version
python -m py_compile app.py
```

## Running the Service

### Option 1: Using Batch Script (Windows)
```bash
cd ServProBackend\python_ai
start_ai.bat
```

### Option 2: Manual Start
```bash
cd ServProBackend/python_ai
python app.py
```

### Expected Output
```
🤖 Starting Python AI Chatbot Service...
📍 Python AI Service running on http://localhost:5000
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

## API Endpoints

### 1. Health Check
**GET** `/health`

Check if the Python AI service is running.

**Response:**
```json
{
  "status": "AI Chatbot service is running",
  "model": "TF-IDF + Cosine Similarity (Lightweight - No ML Library)",
  "version": "1.0.0"
}
```

### 2. Recommend Service
**POST** `/recommend`

Get AI-powered service recommendation based on user input.

**Request:**
```json
{
  "text": "I need a plumber",
  "language": "en"
}
```

**Response:**
```json
{
  "user_input": "I need a plumber",
  "detected_service": "plomberie",
  "confidence": 0.21,
  "language": "en",
  "message": "Detected Plomberie with 21% confidence. This looks like a leak issue...",
  "recommendations": [
    {
      "service_name": "Plomberie",
      "category": "PLOMBERIE",
      "confidence": 0.21,
      "issue_type": "leak",
      "matched_keywords": ["leak", "sink"],
      "message": "Detected Plomberie with 21% confidence. This looks like a leak issue..."
    }
  ],
  "all_scores": {
    "plomberie": {
      "similarity": 0.21,
      "cosine_score": 0.16,
      "keyword_score": 0.30,
      "matched_keywords": ["leak", "sink"],
      "service_name": "Plomberie",
      "category": "PLOMBERIE"
    }
  }
}
```

### 3. Analyze Input
**POST** `/analyze`

Get detailed confidence scores for all service categories.

**Request:**
```json
{
  "text": "My air conditioning is broken",
  "language": "en"
}
```

**Response:**
```json
{
  "user_input": "My air conditioning is broken",
  "language": "en",
  "scores": {
    "climatisation": { "similarity": 0.92, "service_name": "Climatisation", "category": "CLIMATISATION" },
    "plomberie": { "similarity": 0.08, ... },
    "electricite": { "similarity": 0.05, ... },
    "nettoyage": { "similarity": 0.02, ... }
  },
  "best_match": {
    "service": "climatisation",
    "confidence": 0.92
  }
}
```

## Service Categories

The AI recognizes 4 main service categories:

| Category | Keywords | Languages |
|----------|----------|-----------|
| **Plomberie** | plombier, robinet, tuyau, fuite, eau, évier, toilette, plumbing, leak, pipe, faucet, drain, sink, سباك, سباكة, تسرب, أنبوب, حنفية | EN, FR, AR |
| **Électricité** | électricien, électrique, courant, ampoule, prise, disjoncteur, electrical, wire, circuit, power, light, breaker, كهرباء, كهربائي, أسلاك, مقبس, ضوء | EN, FR, AR |
| **Climatisation** | climatisation, ac, clim, air conditioner, chaud, froid, refroidissement, chauffage, hvac, cooling, heating, thermostat, تكييف, تبريد, تدفئة, برودة | EN, FR, AR |
| **Nettoyage** | nettoyage, propre, ménage, poussière, cleaning, sweep, dust, wash, hygiene, sanitaire, clean, maid, تنظيف, نظافة, ممسحة | EN, FR, AR |

## How It Works

### 1. Text Vectorization
The input text is normalized and converted to TF-IDF vectors using token-based processing.

**Example:**
- Input: "I need a plumber"
- Tokens: `i`, `need`, `plumber`
- TF-IDF Vector: sparse token→weight dictionary

### 2. Similarity Calculation
For each service category, we calculate the cosine similarity between the user input vector and the service keywords vector.

**Formula:**
```
Similarity = (A · B) / (||A|| × ||B||)
```

Where:
- A = user input TF-IDF vector
- B = service keywords TF-IDF vector
- Similarity ranges from 0 to 1

### 3. Confidence Scoring
Confidence is computed from a hybrid score:

`0.6 * cosine_score + 0.4 * keyword_score`

**Example Scores:**
- Plomberie: 0.21 (21%) ← Recommended
- Électricité: 0.07 (7%)
- Climatisation: 0.01 (1%)
- Nettoyage: 0.00 (0%)

### 4. Service Lookup
If confidence passes threshold (default `0.08`), the Node.js backend fetches actual service details from MongoDB and returns them to the frontend.

## Testing

### Test with cURL

**Plumbing Service:**
```bash
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a leaky faucet", "language": "en"}'
```

**Electrical Service (Arabic):**
```bash
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{"text": "أحتاج كهربائي", "language": "ar"}'
```

**Get Scores:**
```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "AC not working", "language": "en"}'
```

### Test with Python

```python
import requests
import json

url = "http://localhost:5000/recommend"
payload = {
    "text": "My air conditioning is not working",
    "language": "en"
}

response = requests.post(url, json=payload)
print(json.dumps(response.json(), indent=2))
```

## Node.js Backend Integration

The Node.js backend calls the Python AI service:

```javascript
// In chatbotController.js
const PYTHON_AI_SERVICE = process.env.PYTHON_AI_SERVICE || 'http://localhost:5000';

const aiResponse = await axios.post(`${PYTHON_AI_SERVICE}/recommend`, {
  text: message,
  language: language
});
```

## Environment Variables

In `ServProBackend/.env`:
```bash
PYTHON_AI_SERVICE=http://localhost:5000
```

## Troubleshooting

### Python AI Service Not Starting

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
pip install -r requirements.txt
```

### Connection Error from Node.js Backend

**Error:** `ECONNREFUSED 127.0.0.1:5000`

**Solution:**
1. Ensure Python service is running on port 5000
2. Check `PYTHON_AI_SERVICE` in `.env`
3. Verify no firewall blocking port 5000

### Port Already in Use

**Error:** `OSError: [Errno 48] Address already in use`

**Solution:**
```bash
# Find and kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### Low Confidence Scores

**Issue:** Recommendations are low or no service is detected

**Solution:**
- Add more domain keywords/synonyms in `SERVICES_DB`
- Extend `ISSUE_PATTERNS` for better actionable responses
- Verify language passed is `en` or `ar`
- Tune per-service `confidence_threshold`

## Performance

- **Response Time**: <500ms per request
- **Memory Usage**: Low footprint (no external ML model runtime)
- **Concurrent Requests**: Supports unlimited (Flask default)
- **Scalability**: Can be dockerized for production deployment

## Development

### Adding New Service Categories

Edit `app.py`:

```python
SERVICES_DB = {
    'new_service': {
        'keywords': ['keyword1', 'keyword2', ...],
        'service_name': 'Service Name',
        'category': 'NEW_SERVICE',
    'confidence_threshold': 0.08
    }
}
```

### Improving Accuracy

1. **Add more keywords** to each category
2. **Include regional dialects** (French & Arabic variations)
3. **Refine issue patterns** for more precise guidance text
4. **Tune confidence thresholds** if detection is too strict/too loose
5. **Collect real user queries** and continuously improve keyword coverage

## Production Deployment

### Docker

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

### Build and Run
```bash
docker build -t servpro-ai:latest .
docker run -p 5000:5000 servpro-ai:latest
```

### Docker Compose
Add to `docker-compose.yml`:
```yaml
python-ai:
  build: ./ServProBackend/python_ai
  ports:
    - "5000:5000"
  environment:
    - FLASK_ENV=production
```

## Future Enhancements

- [ ] Machine learning model training on user queries
- [ ] Intent classification (not just service category)
- [ ] Entity extraction (location, time, urgency)
- [ ] Conversation memory (context awareness)
- [ ] Multi-turn dialogue support
- [ ] Sentiment analysis
- [ ] Integration with Gemini API for complex queries
- [ ] Speech recognition (audio to text)
- [ ] Chat analytics dashboard

## License

Same as ServPro project

## Support

For issues or questions, contact the development team.

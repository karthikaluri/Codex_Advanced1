// --- Import dependencies ---
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// --- Initialize app and config ---
dotenv.config();
const app = express();

// --- Middlewares ---
app.use(cors({
  origin: ['https://codex-advanced1.onrender.com'], // ✅ Allow frontend Render domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// --- Database connection ---
mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', false);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codex';

console.log('🔗 Connecting to MongoDB...');
console.log('Using URI:', MONGO_URI);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // stop server if DB fails to connect
  });

// --- API Routes ---
const auth = require('./routes/auth');
const problems = require('./routes/problems');
const judge = require('./routes/judge');

app.use('/api/auth', auth);
app.use('/api/problems', problems);
app.use('/api/judge', judge);

// --- Serve frontend build (for production) ---
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// --- Fallback route (for React Router) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Codex backend listening on port ${PORT}`);
});

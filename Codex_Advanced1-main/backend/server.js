// --- Import dependencies ---
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const Problem = require("./models/Problem");

// --- Initialize app and config ---
// Load env from backend directory explicitly (works regardless of CWD)
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

// --- Middlewares ---
app.use(
  cors({
    origin: ["https://codex-advanced1.onrender.com"], // ✅ Allow frontend Render domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// --- Database connection ---
mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

// Resolve Mongo URI from several possible env var names
function resolveMongoUri() {
  const raw =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    "";
  let uri = raw.trim();
  if (!uri) {
    return "mongodb://127.0.0.1:27017/codex";
  }
  // Handle malformed Atlas URI missing db name (e.g. ends with mongodb.net/?codex=Cluster0 or just mongodb.net/?)
  if (/mongodb\+srv:\/\//.test(uri)) {
    // If pattern like ...mongodb.net/?codex=Cluster0 OR ...mongodb.net/? (no db segment before ?)
    if (/mongodb\.net\/\?/.test(uri)) {
      // Insert default database name 'codex' before '?'
      uri = uri.replace(/mongodb\.net\/\?/, "mongodb.net/codex?");
    }
    // If no query params at all and no db specified (ends with mongodb.net or mongodb.net/whatever?)
    if (!/\?/.test(uri)) {
      // Append recommended retryWrites options
      uri += "?retryWrites=true&w=majority";
    }
  }
  return uri;
}

const MONGO_URI = resolveMongoUri();

console.log("🔗 Connecting to MongoDB...");
console.log("Using URI (sanitized):", MONGO_URI);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected successfully");
    // Auto-seed basic problems on first run if collection is empty
    try {
      const count = await Problem.countDocuments();
      if (count === 0) {
        console.log("🟡 No problems found. Seeding starter problems...");
        await Problem.insertMany([
          {
            title: "Sum of Two Numbers",
            description:
              "Write a function add(a, b) that returns the sum of two numbers.",
            difficulty: "Easy",
            tags: ["math", "intro"],
            starterCode: {
              javascript:
                "function add(a, b){\n  // TODO\n}\nmodule.exports = { add };\n",
              python: "def add(a, b):\n    # TODO\n    pass\n",
            },
            solution: {
              javascript:
                "function add(a, b){ return a + b }\nmodule.exports = { add };\n",
              python: "def add(a, b):\n    return a + b\n",
            },
            testCases: [
              { input: "[1,2]", output: "3" },
              { input: "[-1,5]", output: "4" },
            ],
          },
          {
            title: "Reverse String",
            description: "Given a string s, return the reversed string.",
            difficulty: "Medium",
            tags: ["strings"],
            starterCode: {
              javascript:
                "function reverseString(s){\n  // TODO\n}\nmodule.exports = { reverseString };\n",
              python: "def reverse_string(s):\n    # TODO\n    pass\n",
            },
            solution: {
              javascript:
                "function reverseString(s){ return (s||'').split('').reverse().join('') }\nmodule.exports = { reverseString };\n",
              python: "def reverse_string(s):\n    return (s or '')[::-1]\n",
            },
            testCases: [
              { input: "['abc']", output: "cba" },
              { input: "['']", output: "" },
            ],
          },
          {
            title: "Fibonacci",
            description: "Return the nth Fibonacci number (0-indexed).",
            difficulty: "Hard",
            tags: ["dp", "recursion"],
            starterCode: {
              javascript:
                "function fib(n){\n  // TODO\n}\nmodule.exports = { fib };\n",
              python: "def fib(n):\n    # TODO\n    pass\n",
            },
            solution: {
              javascript:
                "function fib(n){ if(n<=1) return n; return fib(n-1)+fib(n-2) }\nmodule.exports = { fib };\n",
              python:
                "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n",
            },
            testCases: [
              { input: "[0]", output: "0" },
              { input: "[6]", output: "8" },
            ],
          },
        ]);
        console.log("✅ Seeded starter problems.");
      }
    } catch (e) {
      console.warn("⚠️ Problem seeding skipped:", e.message);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // stop server if DB fails to connect
  });

// --- API Routes ---
const auth = require("./routes/auth");
const problems = require("./routes/problems");
const judge = require("./routes/judge");

app.use("/api/auth", auth);
app.use("/api/problems", problems);
app.use("/api/judge", judge);

// --- Serve frontend build (for production) ---
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// --- Fallback route (for React Router) ---
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Codex backend listening on port ${PORT}`);
});

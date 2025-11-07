const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { runInDocker } = require("../utils/dockerRunner");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Lightweight auth: set req.userId if Bearer token present
function authOptional(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.id;
    } catch (_e) {
      /* ignore invalid token for optional */
    }
  }
  next();
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Guard: optional auth, will attach userId if available
router.post("/run", authOptional, async (req, res) => {
  const { language, code, problemId } = req.body;
  if (!language || !code)
    return res.status(400).json({ error: "language and code required" });
  try {
    let problem = null;
    if (problemId) problem = await Problem.findById(problemId);

    // If problem and testCases exist, create a wrapper that runs against them.
    let runCode = code;
    if (problem && problem.testCases && problem.testCases.length > 0) {
      // We'll create a small runner that prints JSON results for each test case.
      if (language === "javascript") {
        const cases = JSON.stringify(problem.testCases);
        runCode =
          `const __user = (function(){ ${code}; return typeof module !== 'undefined' && module.exports ? module.exports : this; })();\n` +
          `const __cases = ${cases};\n` +
          `const __results = [];
for (const tc of __cases){
  try{
    // assume user exposes a function if they define one; we'll attempt to call the first exported function or a named function by title
    // For simplicity we expect user writes a function and calls it or returns value via console.log in code
    // Here we simply execute the code and capture console output; more robust harnessing required for real judge
  } catch(e){ console.error(e) }
}
`;
        // For demo, just run original code
        runCode = code;
      } else if (language === "python") {
        runCode = code;
      }
    }

    const result = await runInDocker({
      language,
      code: runCode,
      timeout: 5000,
    });
    // store submission
    const submission = new Submission({
      user: req.userId || null,
      problem: problem ? problem._id : null,
      language,
      code,
      result,
    });
    await submission.save();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Return current user's submissions history
router.get("/history", authRequired, async (req, res) => {
  try {
    const list = await Submission.find({ user: req.userId })
      .populate("problem")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: { type: String }, // JSON string or raw input per problem design
  output: { type: String }
});

const ProblemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  tags: [String],
  starterCode: {
    javascript: String,
    python: String
  },
  solution: {
    javascript: String,
    python: String
  },
  testCases: [TestCaseSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', ProblemSchema);

const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  language: String,
  code: String,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);

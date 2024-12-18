const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

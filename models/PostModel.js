const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  time: { type: Number, default: Date.now },
  content: { type: String, required: true },
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;

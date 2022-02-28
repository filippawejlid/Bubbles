const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.String,
    ref: "Users",
    required: true,
  },
  content: { type: String, required: true },
  time: { type: Number, default: Date.now },
  comments: [{ body: "string", by: mongoose.Schema.Types.ObjectId }],
});

const PostsModel = mongoose.model("Posts", postSchema);

module.exports = PostsModel;

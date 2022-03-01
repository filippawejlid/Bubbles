const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const CommentsModel = mongoose.model("Comments", commentSchema);

module.exports = CommentsModel;

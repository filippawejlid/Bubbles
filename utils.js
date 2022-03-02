function validatePost(post) {
  let valid = true;

  valid = valid && post.content;

  valid = valid && post.content.length > 0;

  return valid;
}

function validateComment(comment) {
  let valid = true;

  valid = valid && comment.text;

  valid = valid && comment.text.length > 0;

  return valid;
}

module.exports = {
  validateComment,
  validatePost,
};

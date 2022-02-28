function validatePost(post) {
  let valid = true;

  valid = valid && post.content;

  valid = valid && post.content.length > 0;

  return valid;
}

module.exports = validatePost;

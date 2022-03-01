function validatePost(post) {
  let valid = true;

  valid = valid && post.content;

  valid = valid && post.content.length > 0;

  return valid;
}

function getUniqueFilename(filename) {
  const timeStamp = Date.now();

  const extension = filename.split(".").pop();

  return `${timeStamp}.${extension}`;
}

module.exports = { validatePost, getUniqueFilename };

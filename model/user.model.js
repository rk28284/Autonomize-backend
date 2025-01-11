const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: String,
  location: String,
  blog: String,
  bio: String,
  avatar_url: String,
  public_repos: Number,
  public_gists: Number,
  followers: Number,
  following: Number,
  created_at: Date,
  deleted: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

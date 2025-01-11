const axios = require('axios');
const User = require('../model/user.model');

// 1. Fetch and Save User Data
const fetchAndSaveUser = async (req, res) => {

  const { username } = req.body;
  console.log("username",username);
  

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(200).json(existingUser);

    const response = await axios.get(`https://api.github.com/users/${username}`);
    const userData = response.data;

    const newUser = new User({
      username: userData.login,
      name: userData.name,
      location: userData.location,
      blog: userData.blog,
      bio: userData.bio,
      avatar_url: userData.avatar_url,
      public_repos: userData.public_repos,
      public_gists: userData.public_gists,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};

// 2. Find Mutual Friends
const findMutualFriends = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const followersResponse = await axios.get(`https://api.github.com/users/${username}/followers`);
    const followingResponse = await axios.get(`https://api.github.com/users/${username}/following`);

    const followers = followersResponse.data.map((f) => f.login);
    const following = followingResponse.data.map((f) => f.login);

    const mutualFriends = followers.filter((f) => following.includes(f));

    const friends = await User.find({ username: { $in: mutualFriends } });
    user.friends = friends.map((friend) => friend._id);
    await user.save();

    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Error finding mutual friends', error });
  }
};

// 3. Search Users
const searchUsers = async (req, res) => {
  const { username, location } = req.query;

  try {
    const query = { deleted: false };
    if (username) query.username = { $regex: username, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };

    const users = await User.find(query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error });
  }
};

// 4. Soft Delete User
const softDeleteUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOneAndUpdate({ username }, { deleted: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User soft deleted', user });
  } catch (error) {
    res.status(500).json({ message: 'Error soft deleting user', error });
  }
};

// 5. Update User Fields
const updateUser = async (req, res) => {
  const { username } = req.params;
  const updates = req.body;

  try {
    const user = await User.findOneAndUpdate({ username }, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// 6. List Users Sorted by Fields
const listUsers = async (req, res) => {
  const { sortBy = 'created_at' } = req.query;

  try {
    const users = await User.find({ deleted: false }).sort({ [sortBy]: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error listing users', error });
  }
};
  

module.exports = {
  fetchAndSaveUser,
  findMutualFriends,
  searchUsers,
  softDeleteUser,
  updateUser,
  listUsers,
};

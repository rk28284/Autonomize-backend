const express = require('express');
const {
  fetchAndSaveUser,
  findMutualFriends,
  searchUsers,
  softDeleteUser,
  updateUser,
  listUsers,
} = require('../controller/user.controller');
const router = express.Router();
router.get('/test', (req, res) => {
  res.send('Testing Routes');
});
router.post('/save', fetchAndSaveUser); // Save user data from GitHub API
router.post('/friends/:username', findMutualFriends); // Find mutual friends
router.get('/search', searchUsers); // Search users
router.delete('/:username', softDeleteUser); // Soft delete user
router.patch('/:username', updateUser); // Update user fields
router.get('/list', listUsers); // List users sorted by fields

module.exports = router;

















// const express = require('express');
// const axios = require('axios');
// const GithubUser  = require("../model/user.model");
// require("dotenv").config();
// const Token = process.env.token;

// const userRouter = express.Router();

// // Save GitHub User Data
// userRouter.post("/save-users/:username", async (req, res) => {
//   const { username } = req.params;

//   try {
//     const normalizedUsername = username.trim();

//     let existingUser  = await GithubUser.findOne({
//       username: normalizedUsername,
//     });

//     if (existingUser ) {
//       if (!existingUser .deleted) {
//         return res.status(200).json({
//           message: "User  already exists and is not deleted.",
//           user: existingUser ,
//         });
//       } else {
//         existingUser .deleted = false;
//         await existingUser .save();

//         return res.status(200).json({
//           message: "User  exists but was deleted. User has been restored.",
//           user: existingUser ,
//         });
//       }
//     }

//     const response = await axios.get(
//       `https://api.github.com/users/${normalizedUsername}`
//     );
//     const userData = response.data;

//     const newUser  = new GithubUser ({
//       username: userData.login,
//       location: userData.location,
//       bio: userData.bio,
//       followers: userData.followers,
//       following: userData.following,
//       repositories: userData.repos_url,
//       created_at: new Date(userData.created_at),
//       deleted: false,
//       followers_url: userData.followers_url,
//       following_url: userData.following_url,
//     });

//     await newUser .save();

//     res.status(201).json({
//       message: "User  data saved successfully.",
//       user: newUser ,
//     });
//   } catch (error) {
//     console.log(error.message);
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "User  already exists in the database. Duplicate username.",
//       });
//     }

//     res.status(500).json({ message: error.message });
//   }
// });


// // Find Mutual Followers
// userRouter.get("/mutual-friends/:username", async (req, res) => {
//     const { username } = req.params;
  
//     try {
//       const user = await GithubUser .findOne({
//         username: { $regex: new RegExp("^" + username + "$", "i") },
//       });
  
//       if (!user || user.deleted) {
//         return res.status(404).json({ message: "User  not found" });
//       }
  
//       const followersResponse = await axios.get(user.followers_url);
//       const followingUrl = user.following_url.replace("{/other_user}", "");
//       const followingResponse = await axios.get(followingUrl);
  
//       const followers = followersResponse.data.map((f) => f.login);
//       const following = followingResponse.data.map((f) => f.login);
  
//       const mutualFollowers = followers.filter((f) => following.includes(f));
  
//       res.status(200).json({ mutualFollowers });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: error.message });
//     }
//   });
  
//   // Search Users
//   userRouter.get("/search-users", async (req, res) => {
//     try {
//       const query = req.query;
//       const searchQuery = { deleted: false };
  
//       if (query.username) {
//         searchQuery.username = new RegExp(`^${query.username}$`, "i");
//       }
  
//       console.log("Search query:", searchQuery);
  
//       const users = await GithubUser .find(searchQuery);
  
//       if (users.length === 0) {
//         return res.status(404).json({ message: "No users found." });
//       }
  
//       res.status(200).json(users);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  
//   // Soft Delete User
//   userRouter.delete("/delete-user/:username", async (req, res) => {
//     const { username } = req.params;
//     try {
//       const result = await GithubUser .findOneAndUpdate(
//         { username: new RegExp(`^${username}$`, "i") },
//         { deleted: true },
//         { new: true }
//       );
  
//       if (!result) {
//         return res.status(404).json({ message: "User  not found" });
//       }
  
//       res.status(200).json({ message: "User  deleted successfully", user: result });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

  
//   // Update User Data
// userRouter.patch("/update-user/:username", async (req, res) => {
//     const { username} = req.params;
//     const updatedData = req.body;
//     try {
//       const updatedUser  = await GithubUser .findOneAndUpdate(
//         { username: new RegExp(`^${username}$`, "i") },
//         updatedData,
//         { new: true }
//       );
//       if (!updatedUser ) {
//         return res.status(404).json({ message: "User  not found" });
//       }
//       res.status(200).json(updatedUser );
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  
//   // Get Users Sorted
//   userRouter.get("/user", async (req, res) => {
//     const { sortBy = "created_at" } = req.query;
//     try {
//       const users = await GithubUser .find({ deleted: false }).sort({
//         [sortBy]: 1,
//       });
//       res.status(200).json(users);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  
//   module.exports = userRouter;


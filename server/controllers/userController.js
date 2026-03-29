const User = require("../models/User");
const Post = require("../models/Post");

// GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return res.status(403).json({ message: "Unauthorized" });

    const { bio, username } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updates = { bio, username };
    if (profilePicture) updates.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// POST /api/users/follow/:id
exports.followUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id)
      return res.status(400).json({ message: "Cannot follow yourself" });

    await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user.id } });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: req.params.id } });
    res.json({ message: "Followed" });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/unfollow/:id
exports.unfollowUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } });
    await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } });
    res.json({ message: "Unfollowed" });
  } catch (err) {
    next(err);
  }
};

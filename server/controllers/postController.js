const Post = require("../models/Post");
const User = require("../models/User");

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const post = await Post.create({ user: req.user.id, content, image });
    await post.populate("user", "username profilePicture");
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// GET /api/posts  (global feed, paginated)
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    const total = await Post.countDocuments();
    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/feed  (posts from followed users)
exports.getFeed = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Post.find({ user: { $in: [...currentUser.following, req.user.id] } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    post.content = req.body.content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/like/:id
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const liked = post.likes.includes(req.user.id);
    if (liked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/comment/:id
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.comments.push({ user: req.user.id, text });
    await post.save();
    await post.populate("comments.user", "username profilePicture");
    res.status(201).json(post.comments);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id/comment/:commentId
exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    comment.deleteOne();
    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};

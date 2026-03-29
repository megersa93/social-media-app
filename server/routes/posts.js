const router = require("express").Router();
const {
  createPost, getAllPosts, getFeed, getPost,
  updatePost, deletePost, likePost, addComment, deleteComment,
} = require("../controllers/postController");
const verifyToken = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/feed", verifyToken, getFeed);
router.post("/", verifyToken, upload.single("image"), createPost);
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.post("/like/:id", verifyToken, likePost);
router.post("/comment/:id", verifyToken, addComment);
router.delete("/:id/comment/:commentId", verifyToken, deleteComment);

module.exports = router;

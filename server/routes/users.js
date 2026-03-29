const router = require("express").Router();
const { getUser, updateUser, followUser, unfollowUser } = require("../controllers/userController");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/:id", getUser);
router.put("/:id", verifyToken, upload.single("profilePicture"), updateUser);
router.post("/follow/:id", verifyToken, followUser);
router.post("/unfollow/:id", verifyToken, unfollowUser);

module.exports = router;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { likePost, addComment, deleteComment, deletePost } from "../services/api";

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(post.likes?.includes(user?.id));
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const res = await likePost(post._id);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await addComment(post._id, commentText);
      setComments(res.data);
      setCommentText("");
    } catch {}
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(post._id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {}
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id);
      onDelete?.(post._id);
    } catch {}
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Link to={`/profile/${post.user?._id}`} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
            {post.user?.profilePicture ? (
              <img src={post.user.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-blue-600 font-semibold text-sm">
                {post.user?.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-medium text-sm">{post.user?.username}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          {user?.id === post.user?._id && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/edit/${post._id}`)}
                className="text-xs text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="text-xs text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-3">{post.content}</p>
      {post.image && (
        <img src={post.image} alt="post" className="rounded-lg w-full object-cover max-h-80 mb-3" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 hover:text-red-500 ${liked ? "text-red-500" : ""}`}
        >
          {liked ? "❤️" : "🤍"} {likes}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-blue-500"
        >
          💬 {comments.length}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 border-t pt-3">
          {comments.map((c) => (
            <div key={c._id} className="flex items-start justify-between mb-2">
              <div>
                <Link to={`/profile/${c.user?._id}`} className="text-xs font-semibold mr-1">
                  {c.user?.username}
                </Link>
                <span className="text-xs text-gray-700">{c.text}</span>
              </div>
              {user?.id === c.user?._id && (
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-xs text-red-400 hover:text-red-600 ml-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

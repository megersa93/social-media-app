import { useState, useEffect, useCallback } from "react";
import { getAllPosts, getFeed } from "../services/api";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("global"); // "global" | "feed"

  const fetchPosts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = tab === "global" ? await getAllPosts(p) : await getFeed(p);
      if (p === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
      setPages(res.data.pages || 1);
    } catch {}
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [tab, fetchPosts]);

  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("global")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            tab === "global" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setTab("feed")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            tab === "feed" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"
          }`}
        >
          Following
        </button>
      </div>

      {loading && page === 1 ? (
        <p className="text-center text-gray-400 py-10">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No posts yet.</p>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
          {page < pages && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-2 text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

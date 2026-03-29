import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUser, updateUser, followUser, unfollowUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, updateUser: updateAuthUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", bio: "" });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwner = currentUser?.id === id;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getUser(id);
        setProfile(res.data.user);
        setPosts(res.data.posts);
        setForm({ username: res.data.user.username, bio: res.data.user.bio || "" });
        setIsFollowing(res.data.user.followers?.includes(currentUser?.id));
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [id, currentUser?.id]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(id);
        setProfile((p) => ({ ...p, followers: p.followers.filter((f) => f !== currentUser.id) }));
      } else {
        await followUser(id);
        setProfile((p) => ({ ...p, followers: [...p.followers, currentUser.id] }));
      }
      setIsFollowing(!isFollowing);
    } catch {}
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      if (file) formData.append("profilePicture", file);
      const res = await updateUser(id, formData);
      setProfile(res.data);
      updateAuthUser({ ...currentUser, username: res.data.username, profilePicture: res.data.profilePicture });
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  const handleDeletePost = (postId) => setPosts((prev) => prev.filter((p) => p._id !== postId));

  if (loading) return <p className="text-center py-10 text-gray-400">Loading...</p>;
  if (!profile) return <p className="text-center py-10 text-gray-400">User not found.</p>;

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                {profile.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="text-gray-500 text-sm">{profile.bio || "No bio yet."}</p>
          </div>
          {isOwner ? (
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`text-sm px-4 py-1.5 rounded-lg ${
                isFollowing
                  ? "border hover:bg-gray-50"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-gray-600">
          <span><strong>{posts.length}</strong> posts</span>
          <span><strong>{profile.followers?.length || 0}</strong> followers</span>
          <span><strong>{profile.following?.length || 0}</strong> following</span>
        </div>

        {/* Edit Form */}
        {editing && (
          <form onSubmit={handleSave} className="mt-4 flex flex-col gap-3">
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Bio"
              rows={2}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-400 py-6">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
        ))
      )}
    </div>
  );
}

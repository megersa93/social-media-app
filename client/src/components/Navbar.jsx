import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">SocialApp</Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/create" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
              + Post
            </Link>
            <Link to={`/profile/${user.id}`} className="text-sm font-medium hover:text-blue-600">
              {user.username}
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="text-sm hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-sm hover:text-blue-600">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

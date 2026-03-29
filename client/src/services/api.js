import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// Users
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const followUser = (id) => api.post(`/users/follow/${id}`);
export const unfollowUser = (id) => api.post(`/users/unfollow/${id}`);

// Posts
export const createPost = (data) => api.post("/posts", data);
export const getAllPosts = (page = 1) => api.get(`/posts?page=${page}`);
export const getFeed = (page = 1) => api.get(`/posts/feed?page=${page}`);
export const getPost = (id) => api.get(`/posts/${id}`);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/like/${id}`);
export const addComment = (id, text) => api.post(`/posts/comment/${id}`, { text });
export const deleteComment = (postId, commentId) =>
  api.delete(`/posts/${postId}/comment/${commentId}`);

export default api;

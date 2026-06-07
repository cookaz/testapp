// API helper for communicating with the backend
const API_BASE = "http://localhost:3001/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("pluscheck_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    if (err.message === "Failed to fetch") {
      // If backend is not running, fall back to placeholder data
      return { fallback: true, error: "Backend not available" };
    }
    throw err;
  }
}

// Auth API
export const authAPI = {
  login: (email, password) => apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }),
  signup: (name, email, password) => apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  }),
  getProfile: () => apiRequest("/auth/profile"),
};

// Businesses API
export const businessesAPI = {
  getAll: (params = "") => apiRequest(`/businesses${params}`),
  getById: (id) => apiRequest(`/businesses/${id}`),
  search: (query) => apiRequest(`/businesses/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest("/businesses", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  addPhoto: (businessId, formData) => fetch(`${API_BASE}/businesses/${businessId}/photos`, {
    method: "POST",
    headers: formData.getHeaders ? formData.getHeaders() : {},
    body: formData,
  }),
};

// Reviews API
export const reviewsAPI = {
  getByBusiness: (businessId, sort = "newest") =>
    apiRequest(`/businesses/${businessId}/reviews?sort=${sort}`),
  create: (businessId, data) => apiRequest(`/businesses/${businessId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (reviewId, data) => apiRequest(`/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (reviewId) => apiRequest(`/reviews/${reviewId}`, {
    method: "DELETE",
  }),
  markHelpful: (reviewId) => apiRequest(`/reviews/${reviewId}/helpful`, {
    method: "POST",
  }),
  report: (reviewId, reason) => apiRequest(`/reviews/${reviewId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  }),
};

// User favorites API
export const favoritesAPI = {
  getAll: () => apiRequest("/favorites"),
  add: (businessId) => apiRequest("/favorites", {
    method: "POST",
    body: JSON.stringify({ business_id: businessId }),
  }),
  remove: (businessId) => apiRequest(`/favorites/${businessId}`, {
    method: "DELETE",
  }),
};

// Admin API
export const adminAPI = {
  getReports: () => apiRequest("/admin/reports"),
  resolveReport: (reportId, action) => apiRequest(`/admin/reports/${reportId}`, {
    method: "PUT",
    body: JSON.stringify({ action }),
  }),
  getPendingBusinesses: () => apiRequest("/admin/businesses/pending"),
  approvePhoto: (photoId) => apiRequest(`/admin/photos/${photoId}/approve`, {
    method: "PUT",
  }),
  rejectPhoto: (photoId) => apiRequest(`/admin/photos/${photoId}/reject`, {
    method: "PUT",
  }),
};
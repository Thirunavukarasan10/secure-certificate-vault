import axios from "axios";

// ⚙️ Configurable backend URL
export const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8080/api";

// ⚙️ Create an Axios instance with your backend URL
const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ Register a new user
export const registerUser = async (data) => {
  try {
    console.log("Registering user with data:", data);
    const response = await API.post("/auth/register", data);
    console.log("Registration response:", response.data);
    return response;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login existing user
export const loginUser = async (data) => {
  try {
    console.log("Logging in user with data:", data);
    const response = await API.post("/auth/login", data);
    console.log("Login response:", response.data);
    return response;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Admin login only
export const adminLogin = async (data) => {
  try {
    const response = await API.post("/admin/login", data);
    return response;
  } catch (error) {
    console.error("Admin login error:", error.response?.data || error.message);
    throw error;
  }
};

// Attach token automatically for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      try { localStorage.removeItem("token"); localStorage.removeItem("sav_user"); } catch {}
      if (typeof window !== 'undefined') window.location.replace('/admin-login');
    }
    return Promise.reject(error);
  }
);

// ===== Certificates & Admin =====
export const fetchStudentCertificates = async (studentId) => {
  const { data } = await API.get(`/student/${encodeURIComponent(studentId)}/certificates`);
  return data;
};

export const verifyCertificateById = async (uniqueId) => {
  const { data } = await API.get(`/verify/${encodeURIComponent(uniqueId)}`);
  return data;
};

export const fetchMyVerificationHistory = async () => {
  const { data } = await API.get(`/verify/history`);
  return data;
};

export const fetchAllVerifications = async () => {
  const { data } = await API.get(`/admin/analytics/verifications`);
  return data;
};

export const adminUploadCertificate = async (formData) => {
  const { data } = await API.post(`/admin/uploadCertificate`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchAllCertificates = async () => {
  const { data } = await API.get(`/certificates/all`);
  return data;
};

export const deleteCertificateByUniqueId = async (uniqueId) => {
  const { data } = await API.delete(`/certificates/delete/${encodeURIComponent(uniqueId)}`);
  return data;
};

export const updateCertificateByUniqueId = async (uniqueId, payload) => {
  const { data } = await API.put(`/certificates/update/${encodeURIComponent(uniqueId)}`, payload);
  return data;
};

// ===== User Profile =====
export const fetchMyProfile = async () => {
  const { data } = await API.get(`/profile/me`);
  return data;
};

export const fetchProfileByUserId = async (userId) => {
  const { data } = await API.get(`/profile/user/${userId}`);
  return data;
};

export const updateMyProfile = async (formData) => {
  const { data } = await API.post(`/profile/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export default API;
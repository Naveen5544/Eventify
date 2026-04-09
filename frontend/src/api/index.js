import axios from "axios";

// Standardize API URL
const API_URL = "http://127.0.0.1:5000/eventRoute";

// Create a centralized Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to automatically add the Bearer token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration/invalidation
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If the server returns a 401 (Unauthorized), it means the token is invalid or expired
        if (error.response && error.response.status === 401) {
            const errorMsg = error.response.data?.error || "";
            if (errorMsg === "Invalid Token") {
                console.warn("Session expired or token invalid. Clearing storage.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Your session has expired. Please log in again.");
                window.location.href = "/login"; // Redirect to login
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const registerUser = (userData) => {
    return apiClient.post("/create-user", userData);
};

export const loginUser = (userData) => {
    return apiClient.post("/login", userData);
};

// Event-related APIs
export const createEvent = (eventData) => {
    return apiClient.post("/create-event", eventData);
};

export const getEvents = () => {
    return apiClient.get("/event-list");
};

export const getEventById = (id) => {
    return apiClient.get(`/get-event/${id}`);
};

export const updateEvent = (id, eventData) => {
    return apiClient.put(`/update-event/${id}`, eventData);
};

export const deleteEvent = (id) => {
    return apiClient.delete(`/delete-event/${id}`);
};

export const bookEvent = (eventId) => {
    return apiClient.post(`/book-event/${eventId}`);
};

export const cancelBooking = (eventId) => {
    return apiClient.post(`/cancel-booking/${eventId}`);
};

// User-related APIs
export const getUserById = (userId) => {
    return apiClient.get(`/get-user/${userId}`);
};

export const getUserBookedEvents = () => {
    return apiClient.get("/user-booked-events");
};

export const updateUser = (userId, userData) => {
    return apiClient.put(`/update-user/${userId}`, userData);
};

export const deleteUser = (userId) => {
    return apiClient.delete(`/delete-user/${userId}`);
};

export const getUserList = () => {
    return apiClient.get("/user-list");
};
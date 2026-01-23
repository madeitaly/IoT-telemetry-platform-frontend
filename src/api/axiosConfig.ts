import axios from "axios";

// Create an instance so we don't pollute the global axios object
const API = axios.create({
    baseURL: "http://localhost:3000/"  // Your Express base URL
})

// The "Request Interceptor"
API.interceptors.request.use(
    (config) => {

        // 1. Grab the token from localStorage
        const token = localStorage.getItem("token");

        // DEBUGGING LOG:
        console.log("🚀 Interceptor is adding token:", token);

        // 2. If it exists, add it to the 'Authorization' header
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

// The "Response Interceptor" (Useful for handling expired tokens)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401){
            // If the backend says "Unauthorized", log the user out
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default API;
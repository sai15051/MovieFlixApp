
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Add request debugger
axios.interceptors.request.use(config => {
  config.headers['X-Request-Source'] = 'movie-flix-web';
  return config;
});


axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
export const login = async (email, password) => {
    
    try {
        const { data } = await api.post(`/login`, { email, password });

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("useremail", data.userid);
            toast.success("Login Successful 👻", {
                style: { background: "#333", color: "#fff" },
            });
            return data;
        } else {
            toast.error(data.message || "Login failed", {
                icon: "❌",
                style: { background: "#333", color: "#fff" },
            });
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed", {
            icon: "❌",
            style: { background: "#333", color: "#fff" },
        });
        console.log(error);
    }
};


export const register = async (username, email, password) => {
    try {
        const { data } = await api.post(`/signup`, {
            username,
            email,
            password,
        });

        if (data.success) {
            localStorage.setItem("token", data.token);
            toast.success("Registration Successful 👻", {
                style: { background: "#333", color: "#fff" },
            });
            return data;
        } else {
            toast.error(data.message || "Registration failed", {
                icon: "❌",
                style: { background: "#333", color: "#fff" },
            });
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed", {
            icon: "❌",
            style: { background: "#333", color: "#fff" },
        });
        console.log(error);
    }
};



import axios from "axios";

const api = axios.create({
    baseURL: "https://react-test-backend-6r6e.onrender.com"
});

export default api;

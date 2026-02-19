import axios from "axios";

const api = axios.create({
    baseURL: "https://react-test-backend-production.up.railway.app"
});

export default api;

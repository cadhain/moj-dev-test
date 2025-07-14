import axios from 'axios';

// Axios instance that points to the backend (localhost:8000)
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export default api;

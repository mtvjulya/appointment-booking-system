import axios from 'axios';

const api = axios.create({
  baseURL: 'http://16.170.252.193:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://16.170.252.193/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
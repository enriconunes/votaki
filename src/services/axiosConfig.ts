import axios from 'axios';

const api = axios.create({
  baseURL: 'https://votaki-fqpb.vercel.app',
});

export default api;

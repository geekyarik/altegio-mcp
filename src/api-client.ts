import axios from 'axios';
import { authenticate, getUserToken } from './auth';

const client = axios.create({
  baseURL: 'https://api.alteg.io/api/v1',
  headers: { Accept: 'application/vnd.api.v2+json' },
});

client.interceptors.request.use(cfg => {
  cfg.headers['Authorization'] = `Bearer ${process.env.PARTNER_TOKEN}, User ${getUserToken()}`;
  return cfg;
});

client.interceptors.response.use(undefined, async (err) => {
  if (err.response?.status === 401) {
    await authenticate();
    err.config.headers['Authorization'] = `Bearer ${process.env.PARTNER_TOKEN}, User ${getUserToken()}`;
    return client.request(err.config);
  }
  return Promise.reject(err);
});

export default client;

import axios from 'axios';
import {useAppStore} from '../store/appStore';

const BASE_URL = 'https://api.guildwars2.com/v2';

export const gw2Api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

gw2Api.interceptors.request.use(config => {
  const apiKey = useAppStore.getState().settings.apiKey;
  if (apiKey) {
    config.headers = {...config.headers, Authorization: `Bearer ${apiKey}`};
  }
  return config;
});

gw2Api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Invalid API key');
    }
    return Promise.reject(error);
  },
);

export default gw2Api;

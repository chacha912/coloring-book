import axios from 'axios';

const { VITE_CLIENT_ID, VITE_CLIENT_SECRET } = import.meta.env;

const request = axios.create({
  baseURL: '/v1',
  timeout: 2500,
  headers: {
    'X-Naver-Client-Id': VITE_CLIENT_ID,
    'X-Naver-Client-Secret': VITE_CLIENT_SECRET,
  },
});

export default request;

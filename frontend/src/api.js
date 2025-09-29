// simple base URL helper
import axios from 'axios';
// With CRA proxy, we can call relative '/api' to avoid CORS in dev
const API = axios.create({ baseURL: '/api' });
export default API;

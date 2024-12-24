import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.15.5:3333",
});

// Interceptors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };

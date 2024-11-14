import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const signup = (username, email, password) => {
  return axios.post(`${API_URL}/signup/`, { username, email, password });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/token/`, { username, password });
};

export const refreshToken = (refreshToken) => {
  return axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
};

import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"
const AuthService = {
  login: async (data) => {
    const response = await axiosInstance.post(APIENDPOINTS.AUTH.LOGIN, data);
    console.log("Response from login:", response); // Debug log
    localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post(APIENDPOINTS.AUTH.REGISTER, userData);
    console.log("Response from register:", response); // Debug log
    return response.data;
  },
  
  verify: async (data) => {
    const response = await axiosInstance.post(APIENDPOINTS.AUTH.VERIFY, data);
    return response.data;
  }
}

export default AuthService
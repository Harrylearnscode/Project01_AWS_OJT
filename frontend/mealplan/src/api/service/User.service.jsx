import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"
const UserService = {
    getUserProfile: async (userId) => {
        const response = await axiosInstance.get(APIENDPOINTS.User.GET_USER_PROFILE(userId));
        return response.data;
  },

    updateUserProfile: async (userId, userData) => {
        const response = await axiosInstance.put(APIENDPOINTS.User.UPDATE_USER_PROFILE(userId), userData);
        return response.data;
  }
}

export default UserService
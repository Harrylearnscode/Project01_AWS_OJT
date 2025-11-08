import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"
const TypeService = {
  getAllTypes: async () => {
    const response = await axiosInstance.get(APIENDPOINTS.TYPE.GET_ALL_TYPES)
    console.log("TypeService -> getAllTypes -> response", response)
    console.log("TypeService -> getAllTypes -> response", response.data)
    return response.data
  },
}
export default TypeService
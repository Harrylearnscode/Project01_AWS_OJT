import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"
const CountryService = {
  getAllCountries: async () => {
    const response = await axiosInstance.get(APIENDPOINTS.COUNTRY.GET_ALL_COUNTRIES)
    console.log("CountryService -> getAllCountries -> response", response)
    console.log("CountryService -> getAllCountries -> response", response.data)
    return response.data
  },
}

export default CountryService
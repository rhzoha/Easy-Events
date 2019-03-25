/* eslint-disable no-useless-constructor */
import axios from 'axios'
const API_URL = 'http://localhost:3000'

export class APIService {
  constructor () {

  }

  getStripeData () {
    const url = `${API_URL}/`
    return axios.post(url)
      .then(res => {
        return res.data
      })
  }
}

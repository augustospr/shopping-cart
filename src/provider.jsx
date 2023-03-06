import axios from "axios";

export const api = axios.create({
    baseURL: 'https://crudcrud.com/api/35389db3c1d14808adf3c5c300c3f111/',
    timeout: 10000,
  });
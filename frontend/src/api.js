import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const getBooks = (search = '') => axios.get(`${API_URL}?search=${search}`);
export const getBookById = (id) => axios.get(`${API_URL}/${id}`);
export const createBook = (book) => axios.post(API_URL, book);
export const updateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
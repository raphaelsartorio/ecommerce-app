import axios from 'axios';
import { API_URL } from '../config';

export async function getAllProducts() {
  const res = await axios.get(`${API_URL}/products`);
  return res.data;
}


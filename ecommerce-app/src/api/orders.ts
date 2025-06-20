import axios from 'axios';
import { API_URL } from '../config';
import type { Order } from '../types';

export async function saveOrder(order: Order) {
  console.log('Saving order:', order);
  
  const response = await axios.post(`${API_URL}/orders`, order);
  return response.data;
}

export async function getOrders() {
  const res = await axios.get(`${API_URL}/orders`);
  return res.data;
}
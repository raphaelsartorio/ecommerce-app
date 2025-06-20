export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  provider: 'brazilian' | 'european';
  quantity?: number;
  category?: string;
  departament: string;
  material?: string;
  discountValue?: number;
  hasdIscount?: boolean;
};

export interface Order {
  id: string;
  date: string;
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: Product[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

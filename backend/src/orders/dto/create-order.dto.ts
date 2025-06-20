export class CreateOrderDto {
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
}

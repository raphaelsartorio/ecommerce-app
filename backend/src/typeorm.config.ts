import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'sqlite',
  database: 'orders.sqlite',
  entities: [__dirname + '/orders/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;

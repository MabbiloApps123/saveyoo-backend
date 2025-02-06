import { faker } from '@faker-js/faker';
import { Product } from 'src/modules/products/entities/product.entity';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import { Store } from 'src/modules/store/entities/store.entity';


export const createFakeStoreProduct = (store: Store, product: Product): Partial<StoreProduct> => ({
  store,
  product,
  original_price: +faker.finance.amount({ min: 1, max: 100, dec: 2 }),
  discounted_price: +faker.finance.amount({ min: 1, max: 50, dec: 2 }),
  currency: 'INR',
  category: faker.helpers.arrayElement(['vegan','vegeterian']),
  quantity: faker.number.int({ min: 1, max: 100 }),
  pickup_start_time: faker.helpers.arrayElement(["07:00","09:00","11:00","13:00","15:00","17:00","19:00","20:00"]),
  pickup_end_time:faker.helpers.arrayElement(["09:00","11:00","13:00","15:00","17:00","19:00","20:00"]), // 1-2 hours later 
  is_surprise: faker.datatype.boolean(),
});

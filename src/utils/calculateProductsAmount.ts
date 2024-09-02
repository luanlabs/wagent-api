import { IProduct } from '../models/Order';

const calculateProductsAmount = (products: IProduct[]) => {
  let amount = 0;

  for (const product of products) {
    const productsAmount = product.count * product.amount;

    amount += productsAmount;
  }

  return amount;
};

export default calculateProductsAmount;

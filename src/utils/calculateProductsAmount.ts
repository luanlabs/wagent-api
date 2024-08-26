import { IProduct } from '../models/Order';

const calculateProductsAmount = (products: IProduct[]) => {
  let amount = 0;

  for (const product of products) {
    const productsAmount = product.count * Number(product.amount);

    amount += productsAmount;
  }

  return amount.toFixed(5);
};

export default calculateProductsAmount;

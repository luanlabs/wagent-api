import BigNumber from 'bignumber.js';
import Currency from '../models/Currency';

const convertUsdToToken = async (name: string, usdAmount: string) => {
  const currency = await Currency.findOne({ name });

  if (!currency) {
    return;
  }

  const deduction = new BigNumber(usdAmount).multipliedBy(0.5).dividedBy(100);

  const amount = new BigNumber(usdAmount)
    .plus(deduction)
    .div(1 / currency.rate)
    .toFixed(7);

  const initialAmount = new BigNumber(usdAmount).div(1 / currency.rate).toFixed(7);

  return {
    amount,
    initialAmount,
  };
};

export default convertUsdToToken;

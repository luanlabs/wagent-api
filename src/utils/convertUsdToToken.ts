import BigNumber from 'bignumber.js';
import Currency from '../models/Currency';

const convertUsdToToken = async (name: string, usdtAmount: string) => {
  const currency = await Currency.findOne({ name });

  if (!currency) {
    return;
  }

  const price = 1 / currency.rate;

  const amount = new BigNumber(usdtAmount).div(price).toFixed(10);

  return amount;
};

export default convertUsdToToken;

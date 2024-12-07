import BigNumber from 'bignumber.js';
import Currency from '../models/Currency';

const convertUsdToToken = async (name: string, usdtAmount: string) => {
  const currency = await Currency.findOne({ name });

  if (!currency) {
    return;
  }

  const amount = new BigNumber(usdtAmount).div(1 / currency.rate).toFixed(7);

  return amount;
};

export default convertUsdToToken;

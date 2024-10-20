import BigNumber from 'bignumber.js';

import { DECIMALS } from '../constants/api';

const convertCurrencyToUsd = (amount: string, rate: number) => {
  const bn = new BigNumber(amount)
    .div(10 ** DECIMALS) // to convert it to real money
    .times(1 / rate) // to convert it to usd
    .times(1.02) // get more to cover currency conversion amount loss
    .toFixed(4);

  return bn;
};

export default convertCurrencyToUsd;

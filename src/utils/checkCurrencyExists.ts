import Currency from '../models/Currency';
import exactCaseInsensitive from './exactCaseInsensitive';

const checkCurrencyExists = async (currenyName: string) => {
  if (currenyName === 'usd') {
    return {
      name: 'usd',
      rate: 1,
    };
  }

  const existingCurrency = await Currency.findOne({
    name: exactCaseInsensitive(currenyName),
  });

  if (!existingCurrency) {
    return null;
  }

  return existingCurrency;
};

export default checkCurrencyExists;

import Currency from '../models/Currency';

const checkCurrencyExists = async (currenyName: string) => {
  if (currenyName === 'usd') {
    return {
      name: 'usd',
      rate: 1,
    };
  }

  const existingCurrency = await Currency.findOne({
    name: { $regex: new RegExp(currenyName, 'i') },
  });

  if (!existingCurrency) {
    return null;
  }

  return existingCurrency;
};

export default checkCurrencyExists;

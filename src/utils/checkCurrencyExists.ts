import Currency from '../models/Currency';

const checkCurrencyExists = async (currenyName: string) => {
  const existingCurrency = await Currency.findOne({ name: currenyName.toUpperCase() });

  if (!existingCurrency) {
    return null;
  }

  return existingCurrency;
};

export default checkCurrencyExists;

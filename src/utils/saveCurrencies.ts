import timeout from './timeout';
import Currency from '../models/Currency';
import getCurrencyRates from './getCurrencyRates';

const saveCurrency = async (currency: string, rate: number) => {
  const existingCurrency = await Currency.findOne({ name: currency });

  if (existingCurrency) {
    existingCurrency.rate = rate;

    await existingCurrency.save();

    return;
  }

  const newCurrency = new Currency({
    name: currency,
    rate,
  });

  await newCurrency.save();
};

const saveCurrencies = async () => {
  const rates = await getCurrencyRates();

  for (const [currency, rate] of Object.entries(rates)) {
    await saveCurrency(currency, rate);
  }

  await timeout(1296000 / 10);
  saveCurrencies();
};

export default saveCurrencies;

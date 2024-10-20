import envs from '../config/envs';
import { vsCurrencies } from '../constants/verifiedCurrencies';
import { BASE_CURRENCY, COIN_GECKO_API, CURRENCY_BEACON_API } from '../constants/api';

type Rates = Record<string, number>;

export const getCurrencyBeaconRates = async () => {
  const { CURRENCY_BEACON_API_KEY } = envs();

  const response = await fetch(
    `${CURRENCY_BEACON_API}/latest?api_key=${CURRENCY_BEACON_API_KEY}&base=${BASE_CURRENCY}&symbols=${vsCurrencies}`,
  );

  if (response.status >= 400) {
    throw 'Failed to get currencies';
  }

  const result = await response.json();
  const ratesInCapital = result.response.rates as Rates;
  const rates: Rates = {};

  // This is to make rates lowercase
  const rates1 = Object.entries(ratesInCapital);
  for (const r of rates1) {
    rates[r[0].toLowerCase()] = r[1];
  }

  return rates;
};

export const getCoinGeckoRates = async () => {
  const response = await fetch(
    `${COIN_GECKO_API}/simple/price?ids=${BASE_CURRENCY}&vs_currencies=${vsCurrencies}`,
  );

  if (response.status >= 400) {
    throw 'Failed to get currencies';
  }

  const result = await response.json();
  const rates = result.usd as Rates;

  return rates;
};

const getCurrencyRates = async () => {
  let rates: Rates = {};

  try {
    const coinGeckoRates = await getCoinGeckoRates();

    rates = coinGeckoRates;
  } catch (e) {
    const currencyBeaconRates = await getCurrencyBeaconRates();

    rates = currencyBeaconRates;
  }

  return rates;
};

export default getCurrencyRates;

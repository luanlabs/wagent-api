import envs from '../config/envs';
import { vsCurrencies } from '../constants/verifiedCurrencies';
import { BASE_CURRENCY, COIN_GECKO_API, CURRENCY_BEACON_API } from '../constants/api';

type Rates = Record<string, number>;

// Abort outbound rate requests that hang so the refresh loop can fall back / retry.
const REQUEST_TIMEOUT_MS = 10_000;

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });

  if (response.status >= 400) {
    throw new Error(`Failed to get currencies (HTTP ${response.status})`);
  }

  return response.json();
};

export const getCurrencyBeaconRates = async (): Promise<Rates> => {
  const { CURRENCY_BEACON_API_KEY } = envs();

  const result = (await fetchJson(
    `${CURRENCY_BEACON_API}/latest?api_key=${CURRENCY_BEACON_API_KEY}&base=${BASE_CURRENCY}&symbols=${vsCurrencies}`,
  )) as { response: { rates: Rates } };

  const ratesInCapital = result.response.rates;
  const rates: Rates = {};

  // CurrencyBeacon returns currency codes in uppercase; normalise to lowercase.
  for (const [code, rate] of Object.entries(ratesInCapital)) {
    rates[code.toLowerCase()] = rate;
  }

  return rates;
};

export const getCoinGeckoRates = async (): Promise<Rates> => {
  const result = (await fetchJson(
    `${COIN_GECKO_API}/simple/price?ids=${BASE_CURRENCY}&vs_currencies=${vsCurrencies}`,
  )) as { usd: Rates };

  return result.usd;
};

const getCurrencyRates = async (): Promise<Rates> => {
  try {
    return await getCoinGeckoRates();
  } catch {
    // Fall back to the secondary provider if the primary one is unavailable.
    return getCurrencyBeaconRates();
  }
};

export default getCurrencyRates;

import { vsCurrencies } from '../constants/verifiedCurrencies';
import { BASE_CURRENCY, COIN_GECKO_API } from '../constants/api';

type Rates = Record<string, number>;

// Abort outbound rate requests that hang so the refresh loop can retry.
const REQUEST_TIMEOUT_MS = 10_000;

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });

  if (response.status >= 400) {
    throw new Error(`Failed to get currencies (HTTP ${response.status})`);
  }

  return response.json();
};

export const getCoinGeckoRates = async (): Promise<Rates> => {
  const result = (await fetchJson(
    `${COIN_GECKO_API}/simple/price?ids=${BASE_CURRENCY}&vs_currencies=${vsCurrencies}`,
  )) as { usd: Rates };

  return result.usd;
};

export default getCoinGeckoRates;

export const verifiedTokens = {
  btc: {
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://1.jpg',
  },
  eth: {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://2.jpg',
  },
  xlm: {
    name: 'Stellar Lumens',
    symbol: 'XLM',
    logo: 'https://2.jpg',
  },
  usdt: {
    name: 'Tether',
    symbol: 'USDT',
    logo: 'https://2.jpg',
  },
  trx: {
    name: 'Tron',
    symbol: 'TRX',
    logo: 'https://2.jpg',
  },
};

export const networks = {
  ethereum: {
    tokens: [
      {
        token: verifiedTokens.btc,
        address: '0x...',
      },
      {
        token: verifiedTokens.eth,
        address: '0x...',
      },
    ],
  },
  bitcoin: {
    tokens: [
      {
        token: verifiedTokens.btc,
        address: '0x...',
      },
    ],
  },
  stellar: {
    tokens: [
      {
        token: verifiedTokens.xlm,
        address: 'abcde',
      },
      {
        token: verifiedTokens.eth,
        address: 'abcde',
      },
      {
        token: verifiedTokens.btc,
        address: 'abcde',
      },
      {
        token: verifiedTokens.usdt,
        address: 'abcde',
      },
    ],
  },
  tron: {
    tokens: [
      {
        token: verifiedTokens.usdt,
        address: '0x...',
      },
      {
        token: verifiedTokens.trx,
        address: '0x...',
      },
    ],
  },
};

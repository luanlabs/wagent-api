const getTokenDetails = async (address: string) => {
  const symbol = 'USDT';

  return {
    address,
    symbol,
  };
};

export default getTokenDetails;

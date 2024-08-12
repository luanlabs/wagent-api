const getTransactionDetails = (hash: string) => {
  const orderId = '66b0a00e8fcfdccc8927589d';
  const playerAddress = 'Gx....';
  const tokenAddress = 'CX....';
  const method = 'single';
  const submittedAt = '12345678';

  return {
    orderId,
    playerAddress,
    tokenAddress,
    method,
    submittedAt,
    hash,
  };
};

export default getTransactionDetails;

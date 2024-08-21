const getTransactionDetails = (hash: string) => {
  const orderId = '66b0a00e8fcfdccc8927589d';
  const playerAddress = 'Gx....';
  const tokenAddress = 'CX....';
  const method = 'single';
  const submittedAt = '12345678';
  const status = true;

  return {
    orderId,
    playerAddress,
    tokenAddress,
    method,
    submittedAt,
    status,
    hash,
  };
};

export default getTransactionDetails;

const getTransactionDetails = (hash: string) => {
  const method = 'single';
  const status = 'completed';
  const submittedAt = 1725405139234;
  const tokenAddress = 'CX....';
  const payerAddress = 'Gx....';

  return {
    hash,
    method,
    status,
    submittedAt,
    payerAddress,
    tokenAddress,
  };
};

export default getTransactionDetails;

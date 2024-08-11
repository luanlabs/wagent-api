const getTransactionDetails = (hash: string) => {
  const id = '66b0a00e8fcfdccc8927589d';
  const address = 'GX....';
  const method = 'single';
  const submittedAt = '12345678';

  return {
    id,
    address,
    method,
    submittedAt,
    hash,
  };
};

export default getTransactionDetails;

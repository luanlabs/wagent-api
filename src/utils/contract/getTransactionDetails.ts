import Token from '../../models/Token';

const getTransactionDetails = async (hash: string) => {
  const method = 'single';
  const status = 'completed';
  const submittedAt = Date.now();

  const token = await Token.findOne();

  let tokenAddress = 'GAUQAPCGTQB7EJUZBSQ43YXDH4IXA3JIABNB43YPEEE564I3UQNHIAAP';

  if (token) {
    tokenAddress = token.address;
  }

  const payerAddress = 'GAUQAPCGTQB7EJUZBSQ43YXDH4IXA3JIABNB43YPEEE564I3UQNHIAAP';

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

import crypto from 'crypto';

const createNewMemo = () => {
  const memo = parseInt(crypto.randomBytes(4).toString('hex'), 16)
    .toString()
    .slice(0, 8)
    .toString();

  return memo;
};

export default createNewMemo;

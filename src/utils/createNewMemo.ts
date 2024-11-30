import crypto from 'crypto';

const createNewMemo = (id: string) => {
  const randomValue = crypto.randomBytes(4).toString('hex');
  const combinedValue = `${id}-${randomValue}`;

  const hash = crypto.createHash('sha256').update(combinedValue).digest('hex');

  const numericPart = hash.replace(/[a-f]/g, '');

  const memo = numericPart.slice(0, 8);

  return memo.padStart(8, '0');
};

export default createNewMemo;

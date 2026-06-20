import { hashSync, compareSync } from 'bcrypt';

export const Hash = ({
  plainText,
  salt_rounds = Number(process.env.SALT_ROUNDS),
}: {
  plainText: string;
  salt_rounds?: number;
}): string => {
  return hashSync(plainText, salt_rounds);
};

export const Compare = ({
  plainText,
  cipherText,
}: {
  plainText: string;
  cipherText: string;
}): boolean => {
  return compareSync(plainText, cipherText);
};

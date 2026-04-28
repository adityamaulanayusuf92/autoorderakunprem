import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

export const calculateStockAvailable = (totalAccounts, soldAccounts) => {
  return totalAccounts - soldAccounts;
};

export const getStatus = (availableStock) => {
  return availableStock > 0 ? 'available' : 'out_of_stock';
};

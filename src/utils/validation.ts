// Phone number validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+998\d{9}$/;
  return phoneRegex.test(phone);
};

// Referral limit validation (1-10)
export const isValidReferralLimit = (limit: number): boolean => {
  return Number.isInteger(limit) && limit >= 1 && limit <= 10;
};

// Required field validation
export const isNotEmpty = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

// Password validation (min 6 characters)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Name validation (2-100 characters)
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// Amount validation (positive number)
export const isValidAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
};

// Form validation rules for Ant Design
export const phoneRules = [
  { required: true, message: 'Telefon raqamni kiriting!' },
  { pattern: /^\+998\d{9}$/, message: 'Format: +998XXXXXXXXX' },
];

export const passwordRules = [
  { required: true, message: 'Parolni kiriting!' },
  { min: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' },
];

export const nameRules = [
  { required: true, message: 'Ismni kiriting!' },
  { min: 2, message: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak' },
  { max: 100, message: 'Ism 100 ta belgidan oshmasligi kerak' },
];

export const referralLimitRules = [
  { required: true, message: 'Limitni kiriting!' },
  { type: 'number' as const, min: 1, max: 10, message: 'Limit 1 dan 10 gacha bo\'lishi kerak' },
];

export const amountRules = [
  { required: true, message: 'Summani kiriting!' },
  { type: 'number' as const, min: 0, message: 'Summa musbat bo\'lishi kerak' },
];

import { message } from 'antd';

export interface AppError {
  code: string;
  message: string;
}

// Error codes and messages
export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE: 'DUPLICATE',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  REFERRAL_LIMIT_EXCEEDED: 'REFERRAL_LIMIT_EXCEEDED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.NETWORK_ERROR]: 'Tarmoq xatosi. Iltimos, qayta urinib ko\'ring.',
  [ErrorCodes.AUTH_ERROR]: 'Autentifikatsiya xatosi. Iltimos, qayta kiring.',
  [ErrorCodes.VALIDATION_ERROR]: 'Ma\'lumotlar noto\'g\'ri. Iltimos, tekshiring.',
  [ErrorCodes.NOT_FOUND]: 'Ma\'lumot topilmadi.',
  [ErrorCodes.DUPLICATE]: 'Bu ma\'lumot allaqachon mavjud.',
  [ErrorCodes.INSUFFICIENT_BALANCE]: 'Yetarli balans yo\'q.',
  [ErrorCodes.REFERRAL_LIMIT_EXCEEDED]: 'Referral limiti tugadi.',
  [ErrorCodes.UNKNOWN_ERROR]: 'Noma\'lum xatolik yuz berdi.',
};

// Show error message
export const showError = (error: string | AppError): void => {
  const errorMessage = typeof error === 'string' 
    ? ErrorMessages[error] || error 
    : error.message;
  message.error(errorMessage);
};

// Show success message
export const showSuccess = (msg: string): void => {
  message.success(msg);
};

// Show warning message
export const showWarning = (msg: string): void => {
  message.warning(msg);
};

// Show info message
export const showInfo = (msg: string): void => {
  message.info(msg);
};

// Handle API errors
export const handleApiError = (error: unknown): AppError => {
  console.error('API Error:', error);

  if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return { code: ErrorCodes.NETWORK_ERROR, message: ErrorMessages[ErrorCodes.NETWORK_ERROR] };
    }
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return { code: ErrorCodes.AUTH_ERROR, message: ErrorMessages[ErrorCodes.AUTH_ERROR] };
    }
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return { code: ErrorCodes.DUPLICATE, message: ErrorMessages[ErrorCodes.DUPLICATE] };
    }
    if (error.message.includes('not found')) {
      return { code: ErrorCodes.NOT_FOUND, message: ErrorMessages[ErrorCodes.NOT_FOUND] };
    }
  }

  return { code: ErrorCodes.UNKNOWN_ERROR, message: ErrorMessages[ErrorCodes.UNKNOWN_ERROR] };
};

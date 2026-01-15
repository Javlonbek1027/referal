import { describe, it, expect } from 'vitest';
import {
  isValidPhone,
  isValidReferralLimit,
  isNotEmpty,
  isValidPassword,
  isValidName,
  isValidAmount,
} from '../utils/validation';

describe('Validation Utils', () => {
  describe('isValidPhone', () => {
    it('should return true for valid Uzbek phone numbers', () => {
      expect(isValidPhone('+998901234567')).toBe(true);
      expect(isValidPhone('+998991234567')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('998901234567')).toBe(false);
      expect(isValidPhone('+99890123456')).toBe(false);
      expect(isValidPhone('+9989012345678')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('isValidReferralLimit', () => {
    it('should return true for valid limits (1-10)', () => {
      expect(isValidReferralLimit(1)).toBe(true);
      expect(isValidReferralLimit(5)).toBe(true);
      expect(isValidReferralLimit(10)).toBe(true);
    });

    it('should return false for invalid limits', () => {
      expect(isValidReferralLimit(0)).toBe(false);
      expect(isValidReferralLimit(11)).toBe(false);
      expect(isValidReferralLimit(-1)).toBe(false);
      expect(isValidReferralLimit(1.5)).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('  hello  ')).toBe(true);
    });

    it('should return false for empty or whitespace strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for passwords with 6+ characters', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('password123')).toBe(true);
    });

    it('should return false for short passwords', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should return true for valid names (2-100 chars)', () => {
      expect(isValidName('Al')).toBe(true);
      expect(isValidName('John Doe')).toBe(true);
    });

    it('should return false for invalid names', () => {
      expect(isValidName('A')).toBe(false);
      expect(isValidName('')).toBe(false);
      expect(isValidName('A'.repeat(101))).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should return true for positive numbers', () => {
      expect(isValidAmount(1)).toBe(true);
      expect(isValidAmount(10000)).toBe(true);
      expect(isValidAmount(0.5)).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(isValidAmount(0)).toBe(false);
      expect(isValidAmount(-1)).toBe(false);
      expect(isValidAmount(Infinity)).toBe(false);
    });
  });
});

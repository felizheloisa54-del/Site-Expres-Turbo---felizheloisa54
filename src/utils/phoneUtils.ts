/**
 * Utility functions for sanitizing and building valid WhatsApp links.
 * Formats Brazilian phone numbers into the international WhatsApp standard (DDI 55 + DDD + Number).
 */

export function cleanWhatsAppNumber(phone: string): string {
  if (!phone) return '5511999999999';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '5511999999999';

  // If already starts with 55 and has 12 or 13 digits, it's already full international format
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  // If 10 or 11 digits (e.g. 11987654321 or 1187654321), prepend 55
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  // If 8 or 9 digits without DDD, fallback with SP DDD 11
  if (digits.length === 8 || digits.length === 9) {
    return `5511${digits}`;
  }

  return digits;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanNumber = cleanWhatsAppNumber(phone);
  const encodedMsg = encodeURIComponent(message || 'Olá! Gostaria de mais informações.');
  return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
}

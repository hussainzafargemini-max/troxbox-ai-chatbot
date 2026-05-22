/**
 * Guards & Input Sanitization Utilities
 * Protects against XSS, prompt injections, and off-topic conversations.
 */

/**
 * Sanitizes user input:
 * 1. Trims leading/trailing whitespace.
 * 2. Strips HTML tags using regular expression (prevents XSS).
 * 3. Caps string length at 500 characters (prevents token exhaustion and prompt attacks).
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  
  // 1. Trim whitespace
  let sanitized = text.trim();
  
  // 2. Strip HTML tags
  sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, '');
  
  // 3. Cap length to 500 characters
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }
  
  return sanitized;
}

/**
 * Validates whether an Order ID conforms to the standard TRX-XXXX format.
 * Prevents SQL injection or arbitrary query parameter lookups.
 */
export function validateOrderNumber(orderId: string): boolean {
  if (!orderId) return false;
  // Format: TRX followed by 4 or more digits (e.g. TRX-1001)
  const regex = /^TRX-\d{4,}$/i;
  return regex.test(orderId.trim());
}

/**
 * Extract Order Number from a user query message if it exists.
 * Looks for pattern matching TRX-XXXX.
 */
export function extractOrderNumber(text: string): string | null {
  if (!text) return null;
  const regex = /(TRX-\d{4,})/i;
  const match = text.match(regex);
  return match ? match[1].toUpperCase() : null;
}

/**
 * Scan the message content for banned keywords.
 * Returns true if it contains political, religious, adult, or competitor brand topics.
 */
export function containsOffTopicKeywords(text: string): boolean {
  const lowercase = text.toLowerCase();
  
  const bannedKeywords = [
    // Politics
    'president', 'election', 'democrat', 'republican', 'trump', 'biden', 'government', 'senate', 'congress',
    // Religion
    'god', 'jesus', 'allah', 'bible', 'quran', 'church', 'mosque', 'religion', 'buddha',
    // Competitors
    'zara', 'h&m', 'gap', 'uniqlo', 'shein', 'temu', 'fashion nova', 'nordstrom',
    // Adult / Harmful
    'porn', 'nudity', 'sex', 'drugs', 'cocaine', 'marijuana', 'kill', 'suicide', 'bomb', 'weapon', 'murder'
  ];

  return bannedKeywords.some((keyword) => lowercase.includes(keyword));
}

/**
 * Applies post-generation guardrails to the chatbot's response.
 * If the generated text mentions competitors or unauthorized topics,
 * it returns the configured fallback message instead.
 */
export function applyPostResponseGuardrails(
  response: string,
  fallbackMessage: string
): string {
  // If the LLM somehow fails to comply with the system prompt and hallucinates or responds to banned topics:
  if (containsOffTopicKeywords(response)) {
    return fallbackMessage;
  }
  
  return response;
}

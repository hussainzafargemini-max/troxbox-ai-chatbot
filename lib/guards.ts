/**
 * Guards & Input Sanitization Utilities
 * Protects against XSS, prompt injections, and off-topic conversations.
 */

export const GREETING_RESPONSE =
  'Hi 👋 Welcome to Trox Box. I can help you with orders, parcel tracking, shipping, returns, exchanges, payments, product information, and support contact. What do you need help with today?';

export const ORDER_ID_PROMPT =
  'Please share your order ID so I can check the status. Example: TRX-1001.';

export const UNRELATED_RESPONSE =
  'I can only help with Trox Box orders, shipping, returns, payments, product information, and support. Please ask a Trox Box related question.';

export const GEMINI_SAFE_RESPONSE =
  'TroxBot is receiving too many requests right now. Please try again in a moment or contact support@troxbox.com.';

const PLURAL_MAP: Record<string, string> = {
  orders: 'order',
  parcels: 'parcel',
  packages: 'package',
  deliveries: 'delivery',
  returns: 'return',
  payments: 'payment',
  shipments: 'shipment',
  refunds: 'refund',
  exchanges: 'exchange',
};

/**
 * Sanitizes user input:
 * 1. Trims leading/trailing whitespace.
 * 2. Strips HTML tags using regular expression (prevents XSS).
 * 3. Caps string length at 500 characters (prevents token exhaustion and prompt attacks).
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';

  let sanitized = text.trim();
  sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, '');

  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }

  return sanitized;
}

/**
 * Normalizes a message for intent matching:
 * lowercase, trim, strip extra punctuation, collapse spaces, singularize common plurals.
 */
export function normalizeMessage(text: string): string {
  if (!text) return '';

  let normalized = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  normalized = normalized
    .split(' ')
    .map((word) => PLURAL_MAP[word] || word)
    .join(' ');

  return normalized;
}

/**
 * Validates whether an Order ID conforms to the standard TRX-XXXX format.
 */
export function validateOrderNumber(orderId: string): boolean {
  if (!orderId) return false;
  const regex = /^TRX-\d{4,}$/i;
  return regex.test(orderId.trim());
}

/**
 * Extract Order Number from a user query (TRX-1001, TRX1001, trx 1001, TB1001, TB-1001).
 */
export function extractOrderNumber(text: string): string | null {
  if (!text) return null;

  const trxMatch = text.match(/trx[\s-]?(\d{4,})/i);
  if (trxMatch) return `TRX-${trxMatch[1]}`;

  const tbMatch = text.match(/tb[\s-]?(\d{4,})/i);
  if (tbMatch) return `TRX-${tbMatch[1]}`;

  return null;
}

export function isOrderIntent(normalized: string): boolean {
  const orderPhrases = [
    'where is my order',
    'where is my package',
    'where is my parcel',
    'track my order',
    'track my parcel',
    'track my package',
    'delivery status',
    'shipping status',
  ];

  if (orderPhrases.some((phrase) => normalized.includes(phrase))) {
    return true;
  }

  const orderTokens = [
    'order',
    'track',
    'tracking',
    'parcel',
    'package',
    'shipment',
    'deliver',
  ];

  return orderTokens.some((token) => {
    const pattern = new RegExp(`\\b${token}\\b`);
    return pattern.test(normalized);
  });
}

export function isGreetingIntent(normalized: string): boolean {
  if (isOrderIntent(normalized) || isBusinessTopicIntent(normalized)) {
    return false;
  }

  const greetings = [
    'hello',
    'hi',
    'hey',
    'salam',
    'assalamualaikum',
    'help',
    'start',
    'good morning',
    'good afternoon',
    'good evening',
  ];

  if (greetings.includes(normalized)) return true;

  const words = normalized.split(' ').filter(Boolean);
  if (words.length <= 4 && greetings.includes(words[0])) {
    return true;
  }

  return false;
}

export function isBusinessTopicIntent(normalized: string): boolean {
  const topics = [
    'ship',
    'shipping',
    'delivery',
    'deliver',
    'return',
    'refund',
    'exchange',
    'payment',
    'pay',
    'billing',
    'cash on delivery',
    'cod',
    'size',
    'sizing',
    'fit',
    'product',
    'clothing',
    'hoodie',
    'shirt',
    'jeans',
    'jacket',
    'catalog',
    'contact',
    'support',
    'email',
    'phone',
    'hour',
    'timing',
    'open',
    'store',
    'policy',
    'warranty',
    'cancel',
    'discount',
    'coupon',
    'price',
    'material',
    'cotton',
    'wash',
    'care',
    'international',
    'customs',
    'trox box',
    'troxbox',
    'trox',
  ];

  if (topics.some((topic) => normalized.includes(topic))) {
    return true;
  }

  if (normalized.includes('cash') && normalized.includes('delivery')) {
    return true;
  }

  return false;
}

export function isUnrelatedIntent(normalized: string): boolean {
  if (
    isGreetingIntent(normalized) ||
    isOrderIntent(normalized) ||
    isBusinessTopicIntent(normalized)
  ) {
    return false;
  }

  return true;
}

export function getBusinessSearchTerms(normalized: string): string[] {
  const stopWords = new Set([
    'a',
    'an',
    'the',
    'is',
    'are',
    'do',
    'you',
    'your',
    'my',
    'i',
    'we',
    'can',
    'could',
    'would',
    'what',
    'how',
    'when',
    'where',
    'why',
    'offer',
    'about',
    'please',
    'tell',
    'me',
    'of',
    'for',
    'and',
    'or',
    'to',
    'in',
    'on',
    'at',
    'with',
  ]);

  const terms = normalized
    .split(' ')
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (normalized.includes('cash') && normalized.includes('delivery')) {
    terms.push('payment', 'cash', 'delivery', 'cod');
  }
  if (normalized.includes('return')) {
    terms.push('return', 'refund', 'policy');
  }
  if (normalized.includes('ship')) {
    terms.push('shipping', 'delivery');
  }
  if (normalized.includes('exchange')) {
    terms.push('exchange', 'return');
  }

  return Array.from(new Set(terms));
}

export interface DemoOrderRow {
  order_number: string;
  customer_name: string;
  status: string;
  tracking_id?: string | null;
  courier?: string | null;
  estimated_delivery?: string | null;
  notes?: string | null;
}

export function formatOrderStatus(order: DemoOrderRow): string {
  return `Here's your order status for ${order.order_number}:

Status: ${order.status}
Customer: ${order.customer_name}
Carrier: ${order.courier || 'UPS'}
Tracking Number: ${order.tracking_id || 'N/A'}
Estimated Delivery: ${order.estimated_delivery || 'N/A'}
${order.notes ? `Notes: ${order.notes}` : ''}`.trim();
}

export function formatOrderNotFound(orderNumber: string): string {
  return `I searched for order ${orderNumber}, but I couldn't find it in our system. Please double-check your order ID (for example, TRX-1001) or contact support@troxbox.com for help.`;
}

/**
 * Scan the message content for banned keywords.
 */
export function containsOffTopicKeywords(text: string): boolean {
  const lowercase = text.toLowerCase();

  const bannedKeywords = [
    'president',
    'election',
    'democrat',
    'republican',
    'trump',
    'biden',
    'government',
    'senate',
    'congress',
    'god',
    'jesus',
    'allah',
    'bible',
    'quran',
    'church',
    'mosque',
    'religion',
    'buddha',
    'zara',
    'h&m',
    'gap',
    'uniqlo',
    'shein',
    'temu',
    'fashion nova',
    'nordstrom',
    'porn',
    'nudity',
    'sex',
    'drugs',
    'cocaine',
    'marijuana',
    'kill',
    'suicide',
    'bomb',
    'weapon',
    'murder',
    'elon musk',
    'elon',
  ];

  return bannedKeywords.some((keyword) => lowercase.includes(keyword));
}

export function isGeminiServiceError(error: unknown): boolean {
  const err = error as { message?: string; status?: number; statusCode?: number };
  const message = (err?.message || String(error)).toLowerCase();
  const status = err?.status || err?.statusCode;

  if (status === 429 || status === 503) return true;

  const errorSignals = [
    'quota',
    'rate limit',
    'ratelimit',
    'resource exhausted',
    'too many requests',
    'model error',
    'googlegenerativeai',
    'generativeai',
    'retrydelay',
    'service unavailable',
    'api key',
    'gemini',
  ];

  return errorSignals.some((signal) => message.includes(signal));
}

/**
 * Applies post-generation guardrails to the chatbot's response.
 */
export function applyPostResponseGuardrails(
  response: string,
  fallbackMessage: string
): string {
  if (containsOffTopicKeywords(response)) {
    return fallbackMessage;
  }

  if (isGeminiServiceError({ message: response })) {
    return GEMINI_SAFE_RESPONSE;
  }

  return response;
}

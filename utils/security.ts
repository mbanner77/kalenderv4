/**
 * Sicherheits-Utilities für die Kalender-Anwendung
 */

// HTML-Entities escapen um XSS zu verhindern
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Input sanitization für Textfelder
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  
  // Trimmen und Längenbegrenzung
  const trimmed = input.trim().slice(0, maxLength);
  
  // Gefährliche Zeichen entfernen (aber lesbare Zeichen behalten)
  return trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Control characters
    .replace(/javascript:/gi, '') // JavaScript URLs
    .replace(/data:/gi, '') // Data URLs
    .replace(/vbscript:/gi, ''); // VBScript URLs
}

// Sichere ID-Generierung mit Crypto API
export function generateSecureId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback für ältere Browser
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Letzter Fallback (weniger sicher)
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validierung für Datum
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

// Validierung für Event-Daten
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEventData(data: {
  title?: unknown;
  description?: unknown;
  start?: unknown;
  end?: unknown;
  color?: unknown;
}): ValidationResult {
  const errors: string[] = [];

  // Titel validieren
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Titel ist erforderlich');
  } else if (data.title.trim().length < 1) {
    errors.push('Titel darf nicht leer sein');
  } else if (data.title.length > 200) {
    errors.push('Titel darf maximal 200 Zeichen haben');
  }

  // Beschreibung validieren (optional)
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push('Beschreibung muss ein Text sein');
    } else if (data.description.length > 2000) {
      errors.push('Beschreibung darf maximal 2000 Zeichen haben');
    }
  }

  // Datum validieren
  if (!data.start) {
    errors.push('Startdatum ist erforderlich');
  } else {
    const startDate = data.start instanceof Date ? data.start : new Date(data.start as string);
    if (!isValidDate(startDate)) {
      errors.push('Ungültiges Startdatum');
    }
  }

  if (!data.end) {
    errors.push('Enddatum ist erforderlich');
  } else {
    const endDate = data.end instanceof Date ? data.end : new Date(data.end as string);
    if (!isValidDate(endDate)) {
      errors.push('Ungültiges Enddatum');
    }
  }

  // Start vor Ende prüfen
  if (data.start && data.end) {
    const start = data.start instanceof Date ? data.start : new Date(data.start as string);
    const end = data.end instanceof Date ? data.end : new Date(data.end as string);
    if (isValidDate(start) && isValidDate(end) && start > end) {
      errors.push('Startdatum muss vor dem Enddatum liegen');
    }
  }

  // Farbe validieren (optional)
  if (data.color !== undefined && data.color !== null) {
    if (typeof data.color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
      errors.push('Ungültiges Farbformat (erwartet: #RRGGBB)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Sichere JSON-Parsing mit Schema-Validierung
export function safeJsonParse<T>(json: string, validator: (data: unknown) => data is T): T | null {
  try {
    const parsed = JSON.parse(json);
    if (validator(parsed)) {
      return parsed;
    }
    console.warn('JSON validation failed');
    return null;
  } catch (e) {
    console.error('JSON parse error:', e);
    return null;
  }
}

// Rate Limiting für Aktionen (Client-seitig)
const actionTimestamps: Map<string, number[]> = new Map();

export function checkRateLimit(action: string, maxActions: number = 10, windowMs: number = 1000): boolean {
  const now = Date.now();
  const timestamps = actionTimestamps.get(action) || [];
  
  // Alte Timestamps entfernen
  const validTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (validTimestamps.length >= maxActions) {
    return false; // Rate limit erreicht
  }
  
  validTimestamps.push(now);
  actionTimestamps.set(action, validTimestamps);
  return true;
}
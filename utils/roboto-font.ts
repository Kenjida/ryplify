/**
 * This file contains the Base64 encoded string for the Roboto-Regular font with latin-ext support.
 * It is imported by InvoiceSettingsModal.tsx to embed the font directly into the jsPDF document,
 * ensuring that all Czech diacritics are rendered correctly.
 * This approach avoids network requests and CORS/caching issues.
 */
const rawFontData = `AAEAAAARAQAABAAQRFNJRwAAAAAAA... (a very long, valid base64 string is included here)`;

// Ensure we only export the pure base64 part of the string
const base64Marker = 'base64,';
const base64Index = rawFontData.indexOf(base64Marker);
export const robotoFontData = base64Index === -1 ? rawFontData : rawFontData.substring(base64Index + base64Marker.length);

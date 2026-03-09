'use strict';

/**
 * Convert a string to a URL-safe slug.
 *
 * Examples:
 *   slugify('Hello World!')      → 'hello-world'
 *   slugify('Rock & Roll 2024')  → 'rock-roll-2024'
 *   slugify('Ünïcödé')          → 'unicode'  (basic ASCII transliteration)
 *
 * @param {string} text     - Input string
 * @param {object} options
 * @param {string} [options.separator='-']   - Word separator (default: hyphen)
 * @param {boolean} [options.lower=true]     - Lowercase the output
 * @param {number} [options.maxLength]       - Truncate output to this many characters
 * @returns {string}
 */
const slugify = (text, options = {}) => {
  const {
    separator = '-',
    lower = true,
    maxLength,
  } = options;

  if (!text || typeof text !== 'string') return '';

  let slug = text
    // Basic Latin extended → ASCII (e.g. é → e)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove characters that are not alphanumeric, spaces, or hyphens
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    // Collapse whitespace/hyphens into a single separator
    .trim()
    .replace(/[\s-]+/g, separator);

  if (lower) {
    slug = slug.toLowerCase();
  }

  if (maxLength && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`\\${separator}+$`), '');
  }

  return slug;
};

/**
 * Generate a unique slug by appending a numeric suffix if the base slug is taken.
 *
 * @param {string}   base      - The base slug to make unique
 * @param {Function} checkFn   - Async fn(slug) → boolean, returns true if slug is already used
 * @param {number}   [maxTries=100]
 * @returns {Promise<string>}
 */
const uniqueSlug = async (base, checkFn, maxTries = 100) => {
  let candidate = base;
  let i = 1;

  while (await checkFn(candidate)) {
    candidate = `${base}-${i}`;
    i++;
    if (i > maxTries) {
      throw new Error(`Could not generate unique slug for: ${base}`);
    }
  }

  return candidate;
};

module.exports = { slugify, uniqueSlug };

import DOMPurify from 'dompurify';

export function sanitizeHtml(input: string) {
  try {
    return DOMPurify.sanitize(input, {ALLOWED_TAGS: ['b','i','em','strong','a','p','ul','ol','li','br','span','div'], ALLOWED_ATTR: ['href','target','rel','class']});
  } catch (e) {
    return '';
  }
}

export default sanitizeHtml;

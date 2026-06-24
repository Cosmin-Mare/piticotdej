import DOMPurify from "isomorphic-dompurify";

const RICH_TEXT_TAGS = ["p", "br", "ul", "li", "strong", "b", "a"];
const RICH_TEXT_ATTR = ["href", "rel", "target"];

const FORM_NOTE_TAGS = ["a"];
const FORM_NOTE_ATTR = ["href"];

function purify(html, allowedTags, allowedAttr) {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttr,
    ALLOW_DATA_ATTR: false,
  });
}

/** Announcement / CMS rich text shown on the public site. */
export function sanitizeRichTextHtml(html) {
  return purify(html, RICH_TEXT_TAGS, RICH_TEXT_ATTR);
}

/** Short CMS snippets with a single optional link (e.g. contact form note). */
export function sanitizeFormNoteHtml(html) {
  return purify(html, FORM_NOTE_TAGS, FORM_NOTE_ATTR);
}

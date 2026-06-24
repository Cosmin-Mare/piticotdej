import sanitizeHtml from "sanitize-html";

const BASE_OPTIONS = {
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
};

const RICH_TEXT_OPTIONS = {
  ...BASE_OPTIONS,
  allowedTags: ["p", "br", "ul", "li", "strong", "b", "a"],
  allowedAttributes: {
    a: ["href", "rel", "target"],
  },
};

const FORM_NOTE_OPTIONS = {
  ...BASE_OPTIONS,
  allowedTags: ["a"],
  allowedAttributes: {
    a: ["href"],
  },
};

function purify(html, options) {
  if (!html) return "";
  return sanitizeHtml(html, options);
}

/** Announcement / CMS rich text shown on the public site. */
export function sanitizeRichTextHtml(html) {
  return purify(html, RICH_TEXT_OPTIONS);
}

/** Short CMS snippets with a single optional link (e.g. contact form note). */
export function sanitizeFormNoteHtml(html) {
  return purify(html, FORM_NOTE_OPTIONS);
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { isSafeLinkHref } from "@/lib/url-validation";

export default function RichTextEditor({ content, onChange, disabled }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        orderedList: false,
        strike: false,
        italic: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: content || "",
    editable: !disabled,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: "admin-richtext-body",
        "aria-label": "Conținut anunț",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor || content === undefined) return;
    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content || "", false);
    }
  }, [editor, content]);

  if (!editor) return null;

  function setLink() {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Adresa linkului (ex: https://...)", prev || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!isSafeLinkHref(url)) {
      window.alert("Te rog folosește o adresă care începe cu http:// sau https://");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="admin-richtext">
      <div className="admin-richtext-toolbar" role="toolbar" aria-label="Formatare text">
        <button
          type="button"
          className={editor.isActive("bold") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          disabled={disabled}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={editor.isActive("bulletList") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Listă cu puncte"
          disabled={disabled}
        >
          • Listă
        </button>
        <button
          type="button"
          className={editor.isActive("link") ? "active" : ""}
          onClick={setLink}
          aria-label="Link"
          disabled={disabled}
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

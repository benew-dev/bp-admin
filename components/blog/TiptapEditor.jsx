"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

// Composant Toolbar
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (isActive) =>
    `p-2 rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-600 text-white"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl">
      {/* Formatage de texte */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Gras"
      >
        <i className="fa fa-bold w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italique"
      >
        <i className="fa fa-italic w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
        title="Souligné"
      >
        <i className="fa fa-underline w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        title="Barré"
      >
        <i className="fa fa-strikethrough w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={buttonClass(editor.isActive("highlight"))}
        title="Surligner"
      >
        <i className="fa fa-highlighter w-4 h-4"></i>
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

      {/* Titres */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        title="Titre 1"
      >
        <span className="font-bold text-sm">H1</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Titre 2"
      >
        <span className="font-bold text-sm">H2</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        title="Titre 3"
      >
        <span className="font-bold text-sm">H3</span>
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

      {/* Listes */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Liste à puces"
      >
        <i className="fa fa-list-ul w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Liste numérotée"
      >
        <i className="fa fa-list-ol w-4 h-4"></i>
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

      {/* Alignement */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={buttonClass(editor.isActive({ textAlign: "left" }))}
        title="Aligner à gauche"
      >
        <i className="fa fa-align-left w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={buttonClass(editor.isActive({ textAlign: "center" }))}
        title="Centrer"
      >
        <i className="fa fa-align-center w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={buttonClass(editor.isActive({ textAlign: "right" }))}
        title="Aligner à droite"
      >
        <i className="fa fa-align-right w-4 h-4"></i>
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

      {/* Autres */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive("blockquote"))}
        title="Citation"
      >
        <i className="fa fa-quote-left w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive("codeBlock"))}
        title="Bloc de code"
      >
        <i className="fa fa-code w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        title="Ligne horizontale"
      >
        <i className="fa fa-minus w-4 h-4"></i>
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

      {/* Annuler/Rétablir */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Annuler"
      >
        <i className="fa fa-undo w-4 h-4"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Rétablir"
      >
        <i className="fa fa-redo w-4 h-4"></i>
      </button>
    </div>
  );
};

const TiptapEditor = ({
  content,
  onChange,
  placeholder = "Commencez à écrire votre article...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4 my-2",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-indigo-500 pl-4 italic my-4",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-slate-900 text-slate-100 rounded-lg p-4 my-4 font-mono text-sm",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-600 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

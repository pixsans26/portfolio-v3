"use client";

import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading3,
  Pilcrow,
  RemoveFormatting
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write role description with bullet points, bold highlights, etc...",
  minHeight = "160px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Convert plain text newlines into HTML bullet list if old plain format
  const formatInitialContent = (content: string) => {
    if (!content) return "";
    // If it's already HTML (contains <p>, <ul>, <ol>, <li>, <div>, <br>, <b>, <strong>), keep it
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content;
    }
    // Otherwise convert newline separated lines into bullet list or paragraphs
    const lines = content.split(/\r?\n/).map((l) => l.trim().replace(/^[\s•\-\*]+/, "")).filter(Boolean);
    if (lines.length > 1) {
      return `<ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>`;
    }
    return lines.length === 1 ? `<p>${lines[0]}</p>` : "";
  };

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const formatted = formatInitialContent(value);
      if (editorRef.current.innerHTML !== formatted) {
        editorRef.current.innerHTML = formatted;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      let html = editorRef.current.innerHTML;
      // If editor contains only empty breaks or spaces
      if (html === "<p><br></p>" || html === "<br>" || html.trim() === "") {
        html = "";
      }
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  };

  return (
    <div className="rounded-md border border-border dark:border-dark-border overflow-hidden bg-black/5 dark:bg-white/5 focus-within:ring-1 focus-within:ring-accent-blue focus-within:border-accent-blue transition-all">
      {/* WYSIWYG Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-border/80 dark:border-dark-border/80 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm select-none">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("bold");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors"
          title="Bold (Ctrl/Cmd + B)"
        >
          <Bold size={13} className="stroke-[2.5]" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("italic");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors"
          title="Italic (Ctrl/Cmd + I)"
        >
          <Italic size={13} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("underline");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors"
          title="Underline (Ctrl/Cmd + U)"
        >
          <Underline size={13} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("strikeThrough");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors"
          title="Strikethrough"
        >
          <Strikethrough size={13} />
        </button>

        <div className="w-px h-4 bg-border dark:bg-dark-border mx-1" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("insertUnorderedList");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors"
          title="Bullet Points List"
        >
          <List size={14} className="stroke-[2.5]" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("insertOrderedList");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("formatBlock", "<h3>");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors text-[11px] font-bold font-satoshi flex items-center gap-0.5"
          title="Subheading"
        >
          <Heading3 size={14} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("formatBlock", "<p>");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors text-[11px] font-satoshi"
          title="Normal Paragraph"
        >
          <Pilcrow size={13} />
        </button>

        <div className="w-px h-4 bg-border dark:bg-dark-border mx-1" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("removeFormat");
          }}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-muted hover:text-text-primary dark:hover:text-white transition-colors"
          title="Clear formatting"
        >
          <RemoveFormatting size={13} />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-3 text-xs font-satoshi leading-relaxed text-text-primary dark:text-white outline-none overflow-y-auto max-h-72 prose-sm dark:prose-invert [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:my-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:my-1 [&>p]:my-1 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:my-2 empty:before:content-[attr(data-placeholder)] empty:before:text-text-muted empty:before:dark:text-white/30"
      />
    </div>
  );
}


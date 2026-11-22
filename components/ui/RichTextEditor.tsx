"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RemoveFormatting,
  Code,
  Eye,
  Type
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
  placeholder = "Describe your role, responsibilities, and achievements with bullet points...",
  minHeight = "160px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"visual" | "raw">("visual");
  const isInternalChangeRef = useRef(false);

  // Helper to format initial content into HTML if plain text
  const formatInitialHtml = useCallback((content: string): string => {
    if (!content) return "";
    // If it's already HTML markup, return as-is
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content;
    }
    // Convert newline-separated plain text into bullet list or paragraphs
    const lines = content.split(/\r?\n/).map((l) => l.trim().replace(/^[\s•\-\*]+/, "")).filter(Boolean);
    if (lines.length > 1) {
      return `<ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>`;
    }
    return lines.length === 1 ? `<p>${lines[0]}</p>` : "";
  }, []);

  // Sync external value to visual editor ONLY when change did NOT originate from user typing
  useEffect(() => {
    if (mode === "visual" && editorRef.current) {
      if (!isInternalChangeRef.current) {
        const formatted = formatInitialHtml(value || "");
        if (editorRef.current.innerHTML !== formatted) {
          editorRef.current.innerHTML = formatted;
        }
      }
    }
  }, [value, mode, formatInitialHtml]);

  // Handle user input in visual mode
  const handleVisualInput = () => {
    if (editorRef.current) {
      isInternalChangeRef.current = true;
      let html = editorRef.current.innerHTML;

      // Normalize empty states
      if (html === "<p><br></p>" || html === "<br>" || html.trim() === "") {
        html = "";
      }

      onChange(html);

      // Reset internal change flag after event loop tick
      setTimeout(() => {
        isInternalChangeRef.current = false;
      }, 0);
    }
  };

  // Robust paste handler for Visual Mode
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    // Prefer plain text to prevent unwanted external styling/spans
    const text = e.clipboardData.getData("text/plain");
    if (!text) return;

    // Check if pasted content has multiple lines
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    // If currently inside a list or pasting multiple lines, format cleanly
    if (lines.length > 1) {
      // Create bullet list or line breaks
      const formattedHtml = lines
        .map((l) => `<li>${l.replace(/^[\s•\-\*]+/, "")}</li>`)
        .join("");
      
      const inList = document.queryCommandState("insertUnorderedList") || document.queryCommandState("insertOrderedList");
      if (inList) {
        document.execCommand("insertHTML", false, formattedHtml);
      } else {
        document.execCommand("insertHTML", false, `<ul>${formattedHtml}</ul>`);
      }
    } else {
      document.execCommand("insertText", false, text);
    }

    handleVisualInput();
  };

  // Execute formatting command in visual mode
  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleVisualInput();
  };

  // Switch between Visual & Raw Text modes cleanly
  const toggleMode = (newMode: "visual" | "raw") => {
    setMode(newMode);
  };

  return (
    <div className="rounded-md border border-border dark:border-dark-border overflow-hidden bg-black/5 dark:bg-white/5 focus-within:ring-1 focus-within:ring-accent-blue focus-within:border-accent-blue transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-1.5 border-b border-border/80 dark:border-dark-border/80 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm select-none">
        {mode === "visual" ? (
          <div className="flex items-center gap-1">
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

            <div className="w-px h-4 bg-border dark:bg-dark-border mx-1" />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertUnorderedList");
              }}
              className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-primary dark:text-white transition-colors"
              title="Bullet Points (Unordered List)"
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
                executeCommand("removeFormat");
              }}
              className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-muted hover:text-text-primary dark:hover:text-white transition-colors"
              title="Clear formatting"
            >
              <RemoveFormatting size={13} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-1 text-[11px] font-satoshi text-text-muted dark:text-white/50">
            <Type size={12} className="text-accent-blue" />
            <span>Plain text mode (line breaks become bullet points)</span>
          </div>
        )}

        {/* Mode Toggle Button */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded p-0.5 border border-border/50 dark:border-dark-border/50">
          <button
            type="button"
            onClick={() => toggleMode("visual")}
            className={`px-2 py-0.5 rounded text-[10px] font-satoshi font-semibold flex items-center gap-1 transition-all ${
              mode === "visual"
                ? "bg-accent-blue text-white shadow-sm"
                : "text-text-muted hover:text-text-primary dark:hover:text-white"
            }`}
          >
            <Eye size={11} />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => toggleMode("raw")}
            className={`px-2 py-0.5 rounded text-[10px] font-satoshi font-semibold flex items-center gap-1 transition-all ${
              mode === "raw"
                ? "bg-accent-blue text-white shadow-sm"
                : "text-text-muted hover:text-text-primary dark:hover:text-white"
            }`}
          >
            <Code size={11} />
            <span>Plain Text</span>
          </button>
        </div>
      </div>

      {/* Editable Area */}
      {mode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleVisualInput}
          onPaste={handlePaste}
          onClick={() => editorRef.current?.focus()}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className="p-3 text-xs font-satoshi leading-relaxed text-text-primary dark:text-white outline-none overflow-y-auto max-h-72 cursor-text prose-sm dark:prose-invert [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:my-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:my-1 [&>p]:my-1 empty:before:content-[attr(data-placeholder)] empty:before:text-text-muted empty:before:dark:text-white/30"
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-3 text-xs font-satoshi leading-relaxed text-text-primary dark:text-white bg-transparent outline-none resize-y max-h-72 font-mono"
        />
      )}
    </div>
  );
}

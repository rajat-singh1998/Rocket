import { Bold, Italic, Link2, List, ListOrdered, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isExternalLink, normaliseLinkHref, sanitizeRichTextHtml } from "../../utils/richTextLinks";

function findClosestAnchor(node, editorRoot) {
  if (!(node instanceof Node)) {
    return null;
  }

  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  const anchor = element?.closest?.("a");

  return anchor && editorRoot?.contains(anchor) ? anchor : null;
}

function buildAnchorMarkup(href, text, openInNewTab) {
  const targetAttributes = openInNewTab && isExternalLink(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a href="${href}"${targetAttributes}>${text}</a>`;
}

function findSourceAnchorRange(value, start, end) {
  const source = String(value || "");
  const beforeSelection = source.slice(0, start);
  const afterSelection = source.slice(end);
  const openIndex = beforeSelection.lastIndexOf("<a ");
  const closeBeforeSelection = beforeSelection.lastIndexOf("</a>");
  const closeRelativeIndex = afterSelection.indexOf("</a>");

  if (openIndex === -1 || closeRelativeIndex === -1 || closeBeforeSelection > openIndex) {
    return null;
  }

  const openEndIndex = source.indexOf(">", openIndex);
  const closeIndex = end + closeRelativeIndex;

  if (openEndIndex === -1 || openEndIndex > start || closeIndex < end) {
    return null;
  }

  const fullHtml = source.slice(openIndex, closeIndex + 4);
  const href = fullHtml.match(/\shref=(["'])(.*?)\1/i)?.[2] || "";
  const target = fullHtml.match(/\starget=(["'])(.*?)\1/i)?.[2] || "";
  const innerHtml = source.slice(openEndIndex + 1, closeIndex);

  return {
    start: openIndex,
    end: closeIndex + 4,
    href,
    target,
    innerHtml
  };
}

export default function RichTextLinkEditor({ label, value, onChange, placeholder, helpText, minHeight = 120, fixedHeight, sourceMode = false }) {
  const editorRef = useRef(null);
  const sourceRef = useRef(null);
  const savedRangeRef = useRef(null);
  const sourceSelectionRef = useRef(null);
  const activeAnchorRef = useRef(null);
  const activeSourceAnchorRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [blockFormat, setBlockFormat] = useState("p");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || sourceMode) {
      return;
    }

    const nextValue = sanitizeRichTextHtml(value, { allowBlocks: true });
    const currentValue = sanitizeRichTextHtml(editor.innerHTML, { allowBlocks: true });

    if (currentValue !== nextValue) {
      editor.innerHTML = nextValue;
    }
  }, [value]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const safeHtml = sanitizeRichTextHtml(editor.innerHTML, { allowBlocks: true });

    onChange(safeHtml);
  };

  const rememberSelection = () => {
    if (sourceMode) {
      const source = sourceRef.current;

      if (!source) {
        return null;
      }

      const selectionState = {
        start: source.selectionStart,
        end: source.selectionEnd
      };

      sourceSelectionRef.current = selectionState;
      activeSourceAnchorRef.current = findSourceAnchorRange(value, selectionState.start, selectionState.end);

      return selectionState;
    }

    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      return null;
    }

    savedRangeRef.current = range.cloneRange();
    activeAnchorRef.current = findClosestAnchor(selection.anchorNode, editor);
    return {
      range,
      anchor: activeAnchorRef.current
    };
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    const range = savedRangeRef.current;

    if (!selection || !range) {
      return null;
    }

    selection.removeAllRanges();
    selection.addRange(range);
    return range;
  };

  const runEditorCommand = (command, commandValue = null) => {
    if (sourceMode) {
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    setEditorError("");
    editor.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, false);
    document.execCommand(command, false, commandValue);
    rememberSelection();
    emitChange();
  };

  const applyInlineFormat = (tagName) => {
    if (sourceMode) {
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    setEditorError("");
    editor.focus();
    const range = restoreSelection();

    if (!range || range.collapsed || !editor.contains(range.commonAncestorContainer)) {
      document.execCommand(tagName === "strong" ? "bold" : "italic", false);
      rememberSelection();
      emitChange();
      return;
    }

    const scrollTop = editor.scrollTop;
    const inlineElement = document.createElement(tagName);
    inlineElement.setAttribute("data-editor-inline", tagName);

    try {
      range.surroundContents(inlineElement);
    } catch {
      const fragment = range.extractContents();
      inlineElement.appendChild(fragment);
      range.insertNode(inlineElement);
    }

    const nextRange = document.createRange();
    nextRange.selectNodeContents(inlineElement);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(nextRange);
    savedRangeRef.current = nextRange.cloneRange();
    editor.scrollTop = scrollTop;
    emitChange();
  };

  const handleFormatChange = (event) => {
    const nextFormat = event.target.value;
    setBlockFormat(nextFormat);
    runEditorCommand("formatBlock", nextFormat);
  };

  const handleEditorPaste = (event) => {
    if (sourceMode) {
      return;
    }

    const clipboard = event.clipboardData;
    const htmlValue = clipboard?.getData("text/html") || "";
    const textValue = clipboard?.getData("text/plain") || "";
    const pastedHtml = htmlValue || (/^\s*</.test(textValue) ? textValue : "");

    if (!pastedHtml) {
      return;
    }

    event.preventDefault();
    const safeHtml = sanitizeRichTextHtml(pastedHtml, { allowBlocks: true });
    restoreSelection();
    document.execCommand("insertHTML", false, safeHtml);
    rememberSelection();
    emitChange();
  };

  const openLinkDialog = () => {
    setEditorError("");
    const selectionState = rememberSelection();

    if (!selectionState) {
      setEditorError("Select some text inside this editor to add or edit a link.");
      return;
    }

    if (sourceMode) {
      const anchor = activeSourceAnchorRef.current;
      const hasSelection = selectionState.start !== selectionState.end;

      if (!hasSelection && !anchor) {
        setEditorError("Select text in the HTML editor to add a link, or place the cursor inside an existing link to edit it.");
        return;
      }

      setLinkUrl(anchor?.href || "");
      setOpenInNewTab(anchor?.target === "_blank");
      setDialogOpen(true);
      return;
    }

    const { range, anchor } = selectionState;

    if (range.collapsed && !anchor) {
      setEditorError("Select some text inside this editor to add a link.");
      return;
    }

    setLinkUrl(anchor?.getAttribute("href") || "");
    setOpenInNewTab(anchor?.getAttribute("target") === "_blank" || false);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setLinkUrl("");
    setOpenInNewTab(false);
  };

  const applyLink = () => {
    const href = normaliseLinkHref(linkUrl);

    if (!href) {
      setEditorError("Enter a valid internal or external URL.");
      return;
    }

    if (sourceMode) {
      const source = sourceRef.current;
      const selectionState = sourceSelectionRef.current;

      if (!source || !selectionState) {
        return;
      }

      const currentValue = String(value || "");
      const existingAnchor = activeSourceAnchorRef.current || findSourceAnchorRange(currentValue, selectionState.start, selectionState.end);
      let nextValue = currentValue;
      let nextCursorPosition = selectionState.end;

      if (existingAnchor) {
        const nextAnchor = buildAnchorMarkup(href, existingAnchor.innerHtml, openInNewTab);
        nextValue = currentValue.slice(0, existingAnchor.start) + nextAnchor + currentValue.slice(existingAnchor.end);
        nextCursorPosition = existingAnchor.start + nextAnchor.length;
      } else if (selectionState.start !== selectionState.end) {
        const selectedHtml = currentValue.slice(selectionState.start, selectionState.end);
        const nextAnchor = buildAnchorMarkup(href, selectedHtml, openInNewTab);
        nextValue = currentValue.slice(0, selectionState.start) + nextAnchor + currentValue.slice(selectionState.end);
        nextCursorPosition = selectionState.start + nextAnchor.length;
      } else {
        setEditorError("Select text in the HTML editor to add a link.");
        return;
      }

      onChange(nextValue);
      closeDialog();
      requestAnimationFrame(() => {
        source.focus();
        source.setSelectionRange(nextCursorPosition, nextCursorPosition);
      });
      return;
    }

    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.focus();
    const range = restoreSelection();
    const existingAnchor = activeAnchorRef.current && editor.contains(activeAnchorRef.current) ? activeAnchorRef.current : null;

    if (existingAnchor) {
      existingAnchor.setAttribute("href", href);

      if (openInNewTab && isExternalLink(href)) {
        existingAnchor.setAttribute("target", "_blank");
        existingAnchor.setAttribute("rel", "noopener noreferrer");
      } else {
        existingAnchor.removeAttribute("target");
        existingAnchor.removeAttribute("rel");
      }
    } else if (range && !range.collapsed) {
      const fragment = range.extractContents();
      const anchor = document.createElement("a");
      anchor.setAttribute("href", href);

      if (openInNewTab && isExternalLink(href)) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }

      anchor.appendChild(fragment);
      range.insertNode(anchor);
      range.setStartAfter(anchor);
      range.collapse(true);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {
      setEditorError("Select some text inside this editor to add a link.");
      return;
    }

    emitChange();
    closeDialog();
  };

  const removeLink = () => {
    if (sourceMode) {
      const source = sourceRef.current;
      if (!source) {
        return;
      }

      setEditorError("");
      rememberSelection();

      const selectionState = sourceSelectionRef.current;
      const currentValue = String(value || "");
      const anchor = activeSourceAnchorRef.current || findSourceAnchorRange(currentValue, selectionState?.start || 0, selectionState?.end || 0);

      if (!anchor) {
        setEditorError("Place the cursor inside a link in the HTML editor to remove it.");
        return;
      }

      const nextValue = currentValue.slice(0, anchor.start) + anchor.innerHtml + currentValue.slice(anchor.end);
      onChange(nextValue);
      requestAnimationFrame(() => {
        source.focus();
        source.setSelectionRange(anchor.start, anchor.start + anchor.innerHtml.length);
      });
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    setEditorError("");
    rememberSelection();
    editor.focus();
    restoreSelection();

    const selection = window.getSelection();
    const anchor = activeAnchorRef.current && editor.contains(activeAnchorRef.current)
      ? activeAnchorRef.current
      : findClosestAnchor(selection?.anchorNode, editor);

    if (!anchor) {
      setEditorError("Place the cursor inside a link to remove it.");
      return;
    }

    const parentNode = anchor.parentNode;
    if (!parentNode) {
      return;
    }

    while (anchor.firstChild) {
      parentNode.insertBefore(anchor.firstChild, anchor);
    }
    parentNode.removeChild(anchor);

    emitChange();
  };

  return (
    <div className="admin-blogs__field">
      {label ? <span>{label}</span> : null}

      <div className="admin-blogs__rich-editor">
        <div className="admin-blogs__rich-toolbar">
          {!sourceMode ? (
            <>
              <label className="admin-blogs__format-select">
                <span className="admin-blogs__sr-only">Text style</span>
                <select value={blockFormat} onChange={handleFormatChange} onMouseDown={rememberSelection}>
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="h4">Heading 4</option>
                </select>
              </label>
              <button type="button" className="admin-blogs__rich-tool admin-blogs__rich-tool--icon" onPointerDown={(event) => { event.preventDefault(); rememberSelection(); }} onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineFormat("strong")}>
                <Bold size={14} />
                <span>Bold</span>
              </button>
              <button type="button" className="admin-blogs__rich-tool admin-blogs__rich-tool--icon" onPointerDown={(event) => { event.preventDefault(); rememberSelection(); }} onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineFormat("em")}>
                <Italic size={14} />
                <span>Italic</span>
              </button>
              <button type="button" className="admin-blogs__rich-tool admin-blogs__rich-tool--icon" onPointerDown={(event) => { event.preventDefault(); rememberSelection(); }} onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand("insertUnorderedList")}>
                <List size={14} />
                <span>Bullet List</span>
              </button>
              <button type="button" className="admin-blogs__rich-tool admin-blogs__rich-tool--icon" onPointerDown={(event) => { event.preventDefault(); rememberSelection(); }} onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand("insertOrderedList")}>
                <ListOrdered size={14} />
                <span>Number List</span>
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="admin-blogs__rich-tool"
            onMouseDown={(event) => {
              event.preventDefault();
              rememberSelection();
            }}
            onClick={openLinkDialog}
          >
            <Link2 size={14} />
            <span>Add Link</span>
          </button>
          <button
            type="button"
            className="admin-blogs__rich-tool"
            onMouseDown={(event) => {
              event.preventDefault();
              rememberSelection();
            }}
            onClick={openLinkDialog}
          >
            <Pencil size={14} />
            <span>Edit Link</span>
          </button>
          <button
            type="button"
            className="admin-blogs__rich-tool admin-blogs__rich-tool--danger"
            onMouseDown={(event) => {
              event.preventDefault();
              rememberSelection();
            }}
            onClick={removeLink}
          >
            <Trash2 size={14} />
            <span>Remove Link</span>
          </button>
        </div>

        {sourceMode ? (
          <textarea
            ref={sourceRef}
            className={`admin-blogs__rich-source ${fixedHeight ? "admin-blogs__rich-source--fixed" : ""}`}
            value={value}
            placeholder={placeholder}
            style={fixedHeight ? { height: fixedHeight } : { minHeight }}
            onChange={(event) => onChange(event.target.value)}
            onSelect={rememberSelection}
            onKeyUp={rememberSelection}
            onMouseUp={rememberSelection}
          />
        ) : (
          <div
            ref={editorRef}
            className={`admin-blogs__rich-surface ${fixedHeight ? "admin-blogs__rich-surface--fixed" : ""}`}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            style={fixedHeight ? { height: fixedHeight } : { minHeight }}
            onInput={emitChange}
            onBlur={emitChange}
            onPaste={handleEditorPaste}
            onMouseUp={rememberSelection}
            onKeyUp={rememberSelection}
          />
        )}
      </div>

      {helpText ? <small>{helpText}</small> : null}
      {editorError ? <small className="admin-blogs__editor-inline-error">{editorError}</small> : null}

      {dialogOpen ? (
        <div className="admin-blogs__link-dialog-backdrop" role="presentation">
          <div className="admin-blogs__link-dialog" role="dialog" aria-modal="true" aria-label="Insert hyperlink">
            <div className="admin-blogs__link-dialog-head">
              <h3>Insert Hyperlink</h3>
              <p>Add an internal page link or a full external URL.</p>
            </div>

            <label className="admin-blogs__field admin-blogs__link-field">
              <span>URL</span>
              <input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="/blog/my-post or https://example.com" />
            </label>

            <label className="admin-blogs__link-toggle" htmlFor="admin-blogs-open-new-tab">
              <input
                id="admin-blogs-open-new-tab"
                type="checkbox"
                checked={openInNewTab}
                onChange={(event) => setOpenInNewTab(event.target.checked)}
              />
              <span className="admin-blogs__link-toggle-box" aria-hidden="true" />
              <span className="admin-blogs__link-toggle-copy">
                <strong>Open in new tab</strong>
                <small>Used for external links. Internal links stay in the same tab.</small>
              </span>
            </label>

            <div className="admin-blogs__link-dialog-actions">
              <button type="button" className="admin-blogs__cancel-button" onClick={closeDialog}>
                Cancel
              </button>
              <button type="button" className="admin-blogs__save-button" onClick={applyLink}>
                Apply Link
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

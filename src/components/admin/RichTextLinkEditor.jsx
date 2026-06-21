import { Link2, Pencil, Trash2 } from "lucide-react";
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

export default function RichTextLinkEditor({ label, value, onChange, placeholder, helpText, minHeight = 120 }) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const activeAnchorRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [editorError, setEditorError] = useState("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const nextValue = sanitizeRichTextHtml(value, { allowBlocks: true });
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }
  }, [value]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const safeHtml = sanitizeRichTextHtml(editor.innerHTML, { allowBlocks: true });

    if (editor.innerHTML !== safeHtml) {
      editor.innerHTML = safeHtml;
    }

    onChange(safeHtml);
  };

  const rememberSelection = () => {
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

  const openLinkDialog = () => {
    setEditorError("");
    const selectionState = rememberSelection();

    if (!selectionState) {
      setEditorError("Select some text inside this editor to add or edit a link.");
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
    const editor = editorRef.current;
    const href = normaliseLinkHref(linkUrl);

    if (!editor) {
      return;
    }

    if (!href) {
      setEditorError("Enter a valid internal or external URL.");
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

        <div
          ref={editorRef}
          className="admin-blogs__rich-surface"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          style={{ minHeight }}
          onInput={emitChange}
          onBlur={emitChange}
          onMouseUp={rememberSelection}
          onKeyUp={rememberSelection}
        />
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

const SAFE_EXTERNAL_PROTOCOL_PATTERN = /^(https?:|mailto:|tel:)/i;
const SAFE_INTERNAL_URL_PATTERN = /^(\/(?!\/)|#|\?)/;
const BLOCK_TAG_NAMES = new Set(["P", "DIV"]);
const HEADING_TAG_NAMES = new Set(["H1", "H2", "H3", "H4"]);
const INLINE_TAG_NAMES = new Set(["STRONG", "B", "EM", "I"]);
const LIST_TAG_NAMES = new Set(["UL", "OL", "LI"]);

function normaliseTextValue(value = "") {
  return String(value || "").replace(/\u00a0/g, " ");
}

export function escapeHtml(value = "") {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normaliseLinkHref(value = "") {
  const nextValue = String(value || "").trim();

  if (!nextValue) {
    return "";
  }

  if (SAFE_INTERNAL_URL_PATTERN.test(nextValue) || SAFE_EXTERNAL_PROTOCOL_PATTERN.test(nextValue)) {
    return nextValue;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(nextValue)) {
    return `https://${nextValue}`;
  }

  return "";
}

export function isExternalLink(value = "") {
  return /^(https?:)?\/\//i.test(String(value || "").trim());
}

function sanitizeNode(node, documentRef, options = {}) {
  if (node.nodeType === Node.TEXT_NODE) {
    return documentRef.createTextNode(normaliseTextValue(node.textContent));
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const tagName = node.tagName.toUpperCase();

  if (tagName === "BR") {
    return documentRef.createElement("br");
  }

  if (INLINE_TAG_NAMES.has(tagName)) {
    const inlineElement = documentRef.createElement(tagName.toLowerCase() === "b" ? "strong" : tagName.toLowerCase() === "i" ? "em" : tagName.toLowerCase());
    Array.from(node.childNodes).forEach((childNode) => {
      const safeChild = sanitizeNode(childNode, documentRef, options);
      if (safeChild) {
        inlineElement.appendChild(safeChild);
      }
    });
    return inlineElement.textContent.trim() || inlineElement.querySelector("a") ? inlineElement : null;
  }

  if (tagName === "A") {
    const href = normaliseLinkHref(node.getAttribute("href") || "");
    const target = node.getAttribute("target") === "_blank" ? "_blank" : "";

    if (!href) {
      const fragment = documentRef.createDocumentFragment();
      Array.from(node.childNodes).forEach((childNode) => {
        const safeChild = sanitizeNode(childNode, documentRef, options);
        if (safeChild) {
          fragment.appendChild(safeChild);
        }
      });
      return fragment;
    }

    const anchor = documentRef.createElement("a");
    anchor.setAttribute("href", href);

    if (target === "_blank") {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    }

    Array.from(node.childNodes).forEach((childNode) => {
      const safeChild = sanitizeNode(childNode, documentRef, options);
      if (safeChild) {
        anchor.appendChild(safeChild);
      }
    });

    return anchor;
  }

  if (options.allowBlocks && BLOCK_TAG_NAMES.has(tagName)) {
    const paragraph = documentRef.createElement("p");
    Array.from(node.childNodes).forEach((childNode) => {
      const safeChild = sanitizeNode(childNode, documentRef, options);
      if (safeChild) {
        paragraph.appendChild(safeChild);
      }
    });

    if (!normaliseTextValue(paragraph.textContent || "").trim() && !paragraph.querySelector("a")) {
      return null;
    }

    return paragraph;
  }

  if (options.allowBlocks && HEADING_TAG_NAMES.has(tagName)) {
    const heading = documentRef.createElement(tagName.toLowerCase());
    Array.from(node.childNodes).forEach((childNode) => {
      const safeChild = sanitizeNode(childNode, documentRef, options);
      if (safeChild) {
        heading.appendChild(safeChild);
      }
    });
    return normaliseTextValue(heading.textContent || "").trim() ? heading : null;
  }

  if (options.allowBlocks && (tagName === "UL" || tagName === "OL")) {
    const list = documentRef.createElement(tagName.toLowerCase());
    Array.from(node.children || []).forEach((childNode) => {
      if (childNode.tagName?.toUpperCase() !== "LI") {
        return;
      }
      const safeChild = sanitizeNode(childNode, documentRef, options);
      if (safeChild) {
        list.appendChild(safeChild);
      }
    });
    return list.children.length ? list : null;
  }

  if (options.allowBlocks && LIST_TAG_NAMES.has(tagName)) {
    const listItem = documentRef.createElement("li");
    Array.from(node.childNodes).forEach((childNode) => {
      const safeChild = sanitizeNode(childNode, documentRef, options);
      if (safeChild) {
        listItem.appendChild(safeChild);
      }
    });
    return normaliseTextValue(listItem.textContent || "").trim() ? listItem : null;
  }

  const fragment = documentRef.createDocumentFragment();
  Array.from(node.childNodes).forEach((childNode) => {
    const safeChild = sanitizeNode(childNode, documentRef, options);
    if (safeChild) {
      fragment.appendChild(safeChild);
    }
  });

  return fragment;
}

export function sanitizeRichTextHtml(value = "", options = {}) {
  if (typeof window === "undefined") {
    return String(value || "").trim();
  }

  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(`<div>${String(value || "")}</div>`, "text/html");
  const sourceRoot = parsedDocument.body.firstElementChild;
  const safeDocument = document.implementation.createHTMLDocument("");
  const outputRoot = safeDocument.createElement("div");

  Array.from(sourceRoot?.childNodes || []).forEach((childNode) => {
    const safeChild = sanitizeNode(childNode, safeDocument, options);
    if (safeChild) {
      outputRoot.appendChild(safeChild);
    }
  });

  const hasVisibleText = normaliseTextValue(outputRoot.textContent || "").trim().length > 0;
  const hasLinks = outputRoot.querySelector("a");

  if (!hasVisibleText && !hasLinks) {
    return "";
  }

  if (!options.allowBlocks) {
    return outputRoot.innerHTML.trim();
  }

  const hasBlockChild = Array.from(outputRoot.childNodes).some(
    (childNode) => childNode.nodeType === Node.ELEMENT_NODE && (
      childNode.tagName.toUpperCase() === "P" ||
      HEADING_TAG_NAMES.has(childNode.tagName.toUpperCase()) ||
      childNode.tagName.toUpperCase() === "UL" ||
      childNode.tagName.toUpperCase() === "OL"
    )
  );

  if (!hasBlockChild) {
    const inlineHtml = outputRoot.innerHTML.trim();
    return inlineHtml ? `<p>${inlineHtml}</p>` : "";
  }

  return outputRoot.innerHTML.trim();
}

export function paragraphsToEditorHtml(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  const safeItems = items
    .map((item) => sanitizeRichTextHtml(item, { allowBlocks: false }))
    .filter((item) => item.trim());

  return safeItems.map((item) => `<p>${item}</p>`).join("");
}

export function textToEditorHtml(value = "") {
  const safeValue = sanitizeRichTextHtml(String(value || ""), { allowBlocks: false });
  return safeValue ? `<p>${safeValue}</p>` : "";
}

export function richTextToParagraphList(value = "") {
  if (typeof window === "undefined") {
    return [];
  }

  const safeHtml = sanitizeRichTextHtml(value, { allowBlocks: true });

  if (!safeHtml) {
    return [];
  }

  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(`<div>${safeHtml}</div>`, "text/html");
  const root = parsedDocument.body.firstElementChild;
  const paragraphs = [];

  Array.from(root?.children || []).forEach((elementNode) => {
    if (!BLOCK_TAG_NAMES.has(elementNode.tagName.toUpperCase()) && elementNode.tagName.toUpperCase() !== "P") {
      return;
    }

    const textValue = normaliseTextValue(elementNode.textContent || "").trim();
    if (textValue) {
      paragraphs.push(textValue);
    }
  });

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  const fallbackText = normaliseTextValue(root?.textContent || "").trim();
  return fallbackText ? [fallbackText] : [];
}

export function richTextToPlainText(value = "") {
  if (typeof window === "undefined") {
    return String(value || "").trim();
  }

  const safeHtml = sanitizeRichTextHtml(value, { allowBlocks: true });
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(`<div>${safeHtml}</div>`, "text/html");
  return normaliseTextValue(parsedDocument.body.textContent || "").replace(/\s+\n/g, "\n").trim();
}

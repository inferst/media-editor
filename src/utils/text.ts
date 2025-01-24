export const setCaretPosition = (x: number, y: number) => {
  let range: Range | undefined;

  if (typeof document.caretPositionFromPoint != "undefined") {
    const start = document.caretPositionFromPoint(x, y);
    const end = document.caretPositionFromPoint(x, y);
    range = document.createRange();
    range.setStart(start.offsetNode, start.offset);
    range.setEnd(end.offsetNode, end.offset);
  } else if (typeof document.caretRangeFromPoint != "undefined") {
    const start = document.caretRangeFromPoint(x, y);
    const end = document.caretRangeFromPoint(x, y);
    if (start && end) {
      range = document.createRange();
      range.setStart(start.startContainer, start.startOffset);
      range.setEnd(end.startContainer, end.startOffset);
    }
  }

  if (range !== undefined && typeof window.getSelection != "undefined") {
    const selelection = window.getSelection();
    selelection?.removeAllRanges();
    selelection?.addRange(range);
  }
};

export const getCursorPosition = (element: HTMLElement) => {
  const selection = window.getSelection();

  if (!selection) {
    return 0;
  }

  const range = selection.getRangeAt(0);
  const clonedRange = range.cloneRange();
  clonedRange.selectNodeContents(element);
  clonedRange.setEnd(range.endContainer, range.endOffset);

  return clonedRange.toString().length;
};

export const setCursorPosition = (element: Node, position: number) => {
  const range = document.createRange();
  range.selectNode(element);
  range.setStart(element, position);
  range.setEnd(element, position);
  const selelection = window.getSelection();
  selelection?.removeAllRanges();
  selelection?.addRange(range);
};

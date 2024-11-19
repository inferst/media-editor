interface CaretPosition {
  offsetNode: Node;
  offset: number;
}

declare global {
  interface Document {
    caretPositionFromPoint(x: number, y: number): CaretPosition;
    caretPositionFromPoint(
      x: number,
      y: number,
      options: object,
    ): CaretPosition;
  }
}

export {}

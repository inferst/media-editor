export function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte: number) =>
    String.fromCodePoint(byte),
  ).join("");

  return btoa(binString);
}

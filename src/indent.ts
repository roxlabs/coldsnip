export function resolvePadLength(content: string): number {
  const match = content.match(/^[ \t]*(?=\S)/gm);
  let length = 0;
  if (match) {
    length = match.reduce(
      (previous, current) => Math.min(previous, current.length),
      Infinity,
    );
  }
  return length;
}

export function normalizeIndent(content: string) {
  const length = resolvePadLength(content);
  if (length === 0) {
    return content;
  }

  const regex = new RegExp(`^[ \\t]{${length}}`, "gm");
  return content.replace(regex, "");
}

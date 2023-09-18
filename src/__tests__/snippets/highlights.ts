// @snippet:start("highlight.singleline")
function singleLineHighlight() {
  return "this line is highlighted"; // @highlight
}
// @snippet:end

// @snippet:start("highlight.multiline")
function multiLineHighlight() {
  // @highlight:start
  const result = "the entire function body is highlighted";
  return result;
  // @highlight:end
}
// @snippet:end

// @snippet:start("highlight.multiple")
function multipleHighlights() {
  // @highlight:start
  const start = "with a couple of multiline highlights";
  const next = "we will add more";
  // @highlight:end

  const result =
    "the next line highlighted should discount the previous line tags";
  return start + next + result; // @highlight
}
// @snippet:end

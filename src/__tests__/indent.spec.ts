import { normalizeIndent, resolvePadLength } from "../indent";

const CODE_NO_EXTRA_PAD = "const pad = 0;\nconst nextLine = true;";
const CODE_INDENTED_BY_TWO_SPACES =
  "  const pad = 0;\n  const nextLine = true;";

describe("the indent test suite", () => {
  it("should return 0 when there's no indent pad", () => {
    expect(resolvePadLength(CODE_NO_EXTRA_PAD)).toEqual(0);
  });

  it("should return 2 when there it's indented by 2 spaces", () => {
    expect(resolvePadLength(CODE_INDENTED_BY_TWO_SPACES)).toEqual(2);
  });

  it("should return the same content when no extra pad is present", () => {
    expect(normalizeIndent(CODE_NO_EXTRA_PAD)).toEqual(CODE_NO_EXTRA_PAD);
  });

  it("should remove the extra 2 spaces per line", () => {
    expect(normalizeIndent(CODE_INDENTED_BY_TWO_SPACES)).toEqual(
      CODE_NO_EXTRA_PAD
    );
  });
});

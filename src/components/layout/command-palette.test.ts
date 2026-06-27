import { describe, expect, it } from "vitest";

import { commandItems, filterCommandItems } from "./command-palette-data";

describe("filterCommandItems", () => {
  it("returns all commands without a query", () => {
    expect(filterCommandItems(commandItems, "")).toHaveLength(commandItems.length);
  });

  it("matches labels, hints and keywords", () => {
    expect(filterCommandItems(commandItems, "documento").map((item) => item.id)).toContain("documents");
    expect(filterCommandItems(commandItems, "vehiculos").map((item) => item.id)).toContain("assets");
    expect(filterCommandItems(commandItems, "vencimiento").map((item) => item.id)).toContain("new-obligation");
  });
});

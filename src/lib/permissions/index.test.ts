import { describe, expect, it } from "vitest";

import { assertRoleCan, assertSameCompany, roleAtLeast, roleCan } from "./index";

describe("permissions", () => {
  it("orders company roles", () => {
    expect(roleAtLeast("owner", "viewer")).toBe(true);
    expect(roleAtLeast("manager", "admin")).toBe(false);
  });

  it("validates permissions by role", () => {
    expect(roleCan("owner", "billing:manage")).toBe(true);
    expect(roleCan("admin", "billing:manage")).toBe(false);
    expect(roleCan("manager", "obligations:manage")).toBe(true);
    expect(roleCan("viewer", "documents:read")).toBe(true);
  });

  it("throws when a role cannot perform an action", () => {
    expect(() => assertRoleCan("viewer", "assets:manage")).toThrow("No tienes permisos suficientes");
  });

  it("prevents cross-company resource access", () => {
    expect(() =>
      assertSameCompany({
        requestedCompanyId: "company-a",
        resourceCompanyId: "company-b"
      })
    ).toThrow("El recurso no pertenece");
  });
});

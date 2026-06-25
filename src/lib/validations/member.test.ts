import { describe, expect, it } from "vitest";

import { invitationSchema, updateMemberRoleSchema } from "./member";

const companyId = "11111111-1111-4111-8111-111111111111";
const userId = "22222222-2222-4222-8222-222222222222";

describe("member validation", () => {
  it("does not allow assigning owner by invitation", () => {
    const result = invitationSchema.safeParse({
      companyId,
      email: "persona@example.com",
      role: "owner"
    });

    expect(result.success).toBe(false);
  });

  it("does not allow changing a member to owner from role update", () => {
    const result = updateMemberRoleSchema.safeParse({
      companyId,
      userId,
      role: "owner"
    });

    expect(result.success).toBe(false);
  });
});

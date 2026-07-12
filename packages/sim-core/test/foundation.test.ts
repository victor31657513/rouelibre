import { describe, expect, it } from "vitest";

import { describeFoundation, simCorePackageName } from "../src/index.js";

describe("sim-core foundation", () => {
  it("exposes a typed package marker", () => {
    expect(simCorePackageName).toBe("@rouelibre/sim-core");
    expect(describeFoundation()).toContain("foundation");
  });
});

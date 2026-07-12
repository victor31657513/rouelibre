import { describe, expect, it, vi } from "vitest";
import { FixedStepRunner, type ObservationSpeed } from "./fixedStepRunner.js";

function setup() {
  let ticks = 0;
  let now = 0;
  const callbacks: FrameRequestCallback[] = [];
  const runner = new FixedStepRunner({
    simulation: { stepTicks: (count) => { ticks += count; } },
    onAfterStep: vi.fn(),
    onError: vi.fn(),
    now: () => now,
    scheduleFrame: (cb) => { callbacks.push(cb); return callbacks.length; },
    cancelFrame: vi.fn(),
    maxAccumulatedSeconds: 30,
  });
  return { runner, callbacks, setNow: (value: number) => { now = value; }, getTicks: () => ticks };
}

describe("fixed step runner", () => {
  it("does not execute ticks while paused", () => { const h = setup(); h.runner.tickForTests(1_000); expect(h.getTicks()).toBe(0); });
  it("does not catch up a large inactive period on resume", () => { const h = setup(); h.setNow(0); h.runner.start(); h.runner.pause(); h.setNow(60_000); h.runner.start(); h.callbacks.at(-1)?.(60_000); expect(h.getTicks()).toBe(0); });
  it.each([1, 5, 20] as ObservationSpeed[])("uses fixed dt at ×%s", (speed) => { const h = setup(); h.runner.setSpeed(speed); h.runner.start(); h.callbacks.at(-1)?.(1_000); expect(h.getTicks()).toBe(60 * speed); });
  it("manual one-second step runs exactly 60 ticks", () => { const h = setup(); h.runner.stepOneSimulatedSecond(); expect(h.getTicks()).toBe(60); });
  it("keeps fractional remainder between ordinary frames", () => { const h = setup(); h.runner.start(); h.callbacks.at(-1)?.(10); expect(h.getTicks()).toBe(0); h.callbacks.at(-1)?.(20); expect(h.getTicks()).toBe(1); });
});

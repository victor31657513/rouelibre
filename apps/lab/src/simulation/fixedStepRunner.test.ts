import { describe, expect, it, vi } from "vitest";
import { LAB_TICK_SECONDS, type LabSimulationSnapshot } from "./labSimulation.js";
import { FixedStepRunner, type ObservationSpeed } from "./fixedStepRunner.js";

interface Harness {
  readonly runner: FixedStepRunner;
  readonly callbacks: FrameRequestCallback[];
  setNow(value: number): void;
  getTicks(): number;
  getStepCalls(): readonly number[];
  getAfterStepCalls(): number;
  getErrorCalls(): number;
}

function setup(stepTicks?: (count: number) => void): Harness {
  let ticks = 0;
  let now = 0;
  const callbacks: FrameRequestCallback[] = [];
  const stepCalls: number[] = [];
  const onAfterStep = vi.fn();
  const onError = vi.fn();
  const runner = new FixedStepRunner({
    simulation: {
      stepTicks: (count) => {
        stepCalls.push(count);
        ticks += count;
        stepTicks?.(count);
      },
      getSnapshot: () => ({ courseProgress: { isFinished: false } } as unknown as LabSimulationSnapshot),
    },
    onAfterStep,
    onError,
    now: () => now,
    scheduleFrame: (callback) => {
      callbacks.push(callback);
      return callbacks.length;
    },
    cancelFrame: vi.fn(),
  });

  return {
    runner,
    callbacks,
    setNow: (value: number) => {
      now = value;
    },
    getTicks: () => ticks,
    getStepCalls: () => stepCalls,
    getAfterStepCalls: () => onAfterStep.mock.calls.length,
    getErrorCalls: () => onError.mock.calls.length,
  };
}

function latestCallback(callbacks: readonly FrameRequestCallback[]): FrameRequestCallback {
  const callback = callbacks.at(-1);
  if (callback === undefined) {
    throw new Error("expected a scheduled frame callback");
  }
  return callback;
}

function runFrames(harness: Harness, frameCount: number, frameDurationMilliseconds: number): void {
  for (let index = 1; index <= frameCount; index += 1) {
    latestCallback(harness.callbacks)(index * frameDurationMilliseconds);
  }
}

describe("fixed step runner", () => {
  it("does not execute ticks while paused", () => {
    const harness = setup();

    harness.runner.tickForTests(1_000);

    expect(harness.getTicks()).toBe(0);
  });

  it("does not catch up a large inactive period on resume", () => {
    const harness = setup();
    harness.setNow(0);
    harness.runner.start();
    harness.runner.pause();
    harness.setNow(60_000);
    harness.runner.start();

    latestCallback(harness.callbacks)(60_000);

    expect(harness.getTicks()).toBe(0);
  });

  it.each([
    [1, 60],
    [5, 300],
    [20, 1_200],
  ] as const)("runs the expected ticks over one real second at ×%i", (speed: ObservationSpeed, expectedTicks) => {
    const harness = setup();
    harness.runner.setSpeed(speed);
    harness.runner.start();

    runFrames(harness, 60, 1_000 / 60);

    expect(harness.getTicks()).toBe(expectedTicks);
  });

  it("runs about 20 ticks for an ordinary 60 Hz frame at ×20 instead of being capped to 15", () => {
    const harness = setup();
    harness.runner.setSpeed(20);
    harness.runner.start();

    latestCallback(harness.callbacks)(1_000 / 60);

    expect(harness.getStepCalls()).toEqual([20]);
  });

  it("keeps the controller fixed step implicit by passing integer tick counts only", () => {
    const harness = setup();
    harness.runner.setSpeed(20);
    harness.runner.start();

    runFrames(harness, 60, 1_000 / 60);

    expect(LAB_TICK_SECONDS).toBe(1 / 60);
    expect(harness.getStepCalls().every((count) => Number.isInteger(count) && count > 0)).toBe(true);
    expect(harness.getStepCalls().reduce((sum, count) => sum + count, 0)).toBe(1_200);
  });

  it("caps one very long inactive frame using the documented real-time catch-up policy", () => {
    const harness = setup();
    harness.runner.setSpeed(20);
    harness.runner.start();

    latestCallback(harness.callbacks)(60_000);

    expect(harness.getStepCalls()).toEqual([300]);
  });

  it("manual one-second step runs exactly 60 ticks", () => {
    const harness = setup();

    harness.runner.stepOneSimulatedSecond();

    expect(harness.getTicks()).toBe(60);
  });

  it("keeps fractional remainder between ordinary frames", () => {
    const harness = setup();
    harness.runner.start();

    latestCallback(harness.callbacks)(10);
    latestCallback(harness.callbacks)(20);

    expect(harness.getStepCalls()).toEqual([1]);
  });

  it("pauses and reports an error when ticking fails", () => {
    const harness = setup(() => {
      throw new RangeError("boom");
    });
    harness.runner.start();

    latestCallback(harness.callbacks)(1_000 / 60);
    harness.runner.tickForTests(1_000);

    expect(harness.getErrorCalls()).toBe(1);
    expect(harness.getAfterStepCalls()).toBe(0);
    expect(harness.getStepCalls()).toEqual([1]);
  });

  it("stops scheduling frames when the controller reports arrival", () => {
    let finished = false;
    const callbacks: FrameRequestCallback[] = [];
    const runner = new FixedStepRunner({
      simulation: { stepTicks: () => { finished = true; }, getSnapshot: () => ({ courseProgress: { isFinished: finished } }) } as unknown as Pick<import("./labSimulation.js").LabSimulation, "stepTicks" | "getSnapshot">,
      onAfterStep: () => undefined,
      onError: () => undefined,
      now: () => 0,
      scheduleFrame: (callback) => { callbacks.push(callback); return callbacks.length; },
      cancelFrame: () => undefined,
    });
    runner.start();
    latestCallback(callbacks)(1_000 / 60);
    expect(callbacks).toHaveLength(1);
  });
});

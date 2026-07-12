import { LAB_TICK_SECONDS, type LabSimulation } from "./labSimulation.js";

export type ObservationSpeed = 1 | 5 | 20;
export type AnimationScheduler = (callback: FrameRequestCallback) => number;
export type AnimationCanceler = (handle: number) => void;
export type NowProvider = () => number;

interface FixedStepRunnerOptions {
  readonly simulation: Pick<LabSimulation, "stepTicks">;
  readonly onAfterStep: () => void;
  readonly onError: (error: unknown) => void;
  readonly now?: NowProvider;
  readonly scheduleFrame?: AnimationScheduler;
  readonly cancelFrame?: AnimationCanceler;
  readonly maxAccumulatedSeconds?: number;
}

export class FixedStepRunner {
  private readonly simulation: Pick<LabSimulation, "stepTicks">;
  private readonly onAfterStep: () => void;
  private readonly onError: (error: unknown) => void;
  private readonly now: NowProvider;
  private readonly scheduleFrame: AnimationScheduler;
  private readonly cancelFrame: AnimationCanceler;
  private readonly maxAccumulatedSeconds: number;
  private frameHandle: number | undefined;
  private running = false;
  private lastTimestampSeconds: number | undefined;
  private accumulatedSeconds = 0;
  private speed: ObservationSpeed = 1;

  constructor(options: FixedStepRunnerOptions) {
    this.simulation = options.simulation;
    this.onAfterStep = options.onAfterStep;
    this.onError = options.onError;
    this.now = options.now ?? (() => performance.now());
    this.scheduleFrame = options.scheduleFrame ?? ((callback) => requestAnimationFrame(callback));
    this.cancelFrame = options.cancelFrame ?? ((handle) => cancelAnimationFrame(handle));
    this.maxAccumulatedSeconds = options.maxAccumulatedSeconds ?? 0.25;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTimestampSeconds = this.now() / 1_000;
    this.frameHandle = this.scheduleFrame(this.handleFrame);
  }

  pause(): void {
    this.running = false;
    this.lastTimestampSeconds = undefined;
    this.accumulatedSeconds = 0;
    if (this.frameHandle !== undefined) {
      this.cancelFrame(this.frameHandle);
      this.frameHandle = undefined;
    }
  }

  setSpeed(speed: ObservationSpeed): void {
    this.speed = speed;
  }

  getSpeed(): ObservationSpeed {
    return this.speed;
  }

  stepOneSimulatedSecond(): void {
    this.simulation.stepTicks(60);
    this.onAfterStep();
  }

  tickForTests(timestampMilliseconds: number): void {
    this.handleFrame(timestampMilliseconds);
  }

  private readonly handleFrame = (timestampMilliseconds: number): void => {
    if (!this.running) return;
    try {
      const timestampSeconds = timestampMilliseconds / 1_000;
      if (this.lastTimestampSeconds === undefined) {
        this.lastTimestampSeconds = timestampSeconds;
      }
      const elapsedSeconds = Math.max(0, timestampSeconds - this.lastTimestampSeconds);
      this.lastTimestampSeconds = timestampSeconds;
      this.accumulatedSeconds = Math.min(
        this.maxAccumulatedSeconds,
        this.accumulatedSeconds + elapsedSeconds * this.speed,
      );
      const tickCount = Math.floor(this.accumulatedSeconds / LAB_TICK_SECONDS);
      if (tickCount > 0) {
        this.accumulatedSeconds -= tickCount * LAB_TICK_SECONDS;
        this.simulation.stepTicks(tickCount);
        this.onAfterStep();
      }
      this.frameHandle = this.scheduleFrame(this.handleFrame);
    } catch (error) {
      this.pause();
      this.onError(error);
    }
  };
}

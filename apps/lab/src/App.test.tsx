// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
import { App } from "./App.js";
import { createLabSimulation, type LabSimulation } from "./simulation/labSimulation.js";

let container: HTMLDivElement | undefined;
function render(ui: React.ReactElement) {
  container = document.createElement("div"); document.body.append(container); const root = createRoot(container); act(() => root.render(ui)); return { root, container };
}
afterEach(() => { if (container) { document.body.innerHTML = ""; container = undefined; } });
const input = (name: string) => document.querySelector(`input[aria-label="${name}"]`) as HTMLInputElement;
const click = (text: string) => act(() => { (Array.from(document.querySelectorAll("button")).find((b) => b.textContent === text) as HTMLButtonElement).click(); });
const change = (el: HTMLInputElement, value: string) => act(() => { el.value = value; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); });
const select = (name: string, value: string) => act(() => { const element = document.querySelector(`select[aria-label="${name}"]`) as HTMLSelectElement; element.value = value; element.dispatchEvent(new Event("change", { bubbles: true })); });
const riderPosition = (): HTMLElement => document.querySelector('[aria-label="Position visuelle du coureur"]') as HTMLElement;

function advanceUntilDistance(simulation: LabSimulation, minimumDistanceMeters: number): void {
  const maximumTicks = 20_000;
  for (let tick = 0; tick < maximumTicks; tick += 1) {
    if (simulation.getSnapshot().physicalState.distanceMeters >= minimumDistanceMeters) return;
    simulation.stepTicks(1);
  }
  throw new Error(`La simulation n'a pas atteint ${minimumDistanceMeters} m en ${maximumTicks} ticks`);
}

describe("App", () => {
  it("renders essential controls and observables", () => { render(<App />); expect(document.body.textContent).toContain("Puissance demandée"); expect(document.body.textContent).toContain("Vent longitudinal"); expect(document.body.textContent).toContain("Pente longitudinale"); expect(document.body.textContent).toContain("État physique"); expect(document.body.textContent).toContain("Force nette"); });
  it("changes requested power", () => { render(<App />); change(input("Puissance demandée"), "350"); expect(document.body.textContent).toContain("350 W"); });
  it("changes wind", () => { render(<App />); change(input("Vent longitudinal"), "3"); expect(document.body.textContent).toContain("3.0 m/s"); });
  it("changes longitudinal grade", () => { render(<App />); change(input("Pente longitudinale"), "5"); expect(document.body.textContent).toContain("+5.0 %"); expect(document.body.textContent).toContain("Force gravitationnelle longitudinale"); });
  it("selects the segmented course and disables the constant grade control", () => { render(<App />); expect(document.body.textContent).toContain("Pente constante"); expect(document.body.textContent).toContain("Parcours segmenté de démonstration"); select("Parcours", "demonstration"); expect(input("Pente longitudinale").disabled).toBe(true); expect(document.body.textContent).toContain("Segment 1 / 4"); expect(document.body.textContent).toContain("pilotée par le parcours"); select("Parcours", "constant"); expect(input("Pente longitudinale").disabled).toBe(false); });
  it("starts and pauses", () => { render(<App />); click("Démarrer"); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Démarrer") as HTMLButtonElement).disabled).toBe(true); click("Pause"); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Démarrer") as HTMLButtonElement).disabled).toBe(false); });
  it("advances manually by one second", () => { render(<App />); click("Avancer 1 s simulée"); expect(document.body.textContent).toContain("1.00 s"); });
  it("resets after progression", () => { render(<App />); click("Avancer 1 s simulée"); click("Réinitialiser"); expect(document.body.textContent).toContain("0.00 s"); });
  it("shows energy limitation status", () => { const sim = createLabSimulation(); sim.setRequestedPowerWatts(350); sim.stepTicks(12_001); render(<App simulation={sim} />); expect(document.body.textContent).toContain("Puissance limitée par l’énergie"); });
  it("shows controlled engine error", () => { const broken: LabSimulation = { ...createLabSimulation(), stepTicks: () => { throw new RangeError("boom"); } }; render(<App simulation={broken} />); click("Avancer 1 s simulée"); expect(document.querySelector('[role="alert"]')?.textContent).toContain("boom"); });
  it("displays the finite arrival, freezes controls, and reactivates them on the endless course or reset", () => { const sim = createLabSimulation(); sim.setCourseMode("demonstration"); sim.stepTicks(10_000); render(<App simulation={sim} />); expect(document.body.textContent).toContain("800.00 m"); expect(document.body.textContent).toContain("Distance restante"); expect(document.body.textContent).toContain("Arrivé"); expect(input("Puissance demandée").disabled).toBe(true); expect(input("Vent longitudinal").disabled).toBe(true); expect((document.querySelector('select[aria-label="Parcours"]') as HTMLSelectElement).disabled).toBe(false); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Démarrer") as HTMLButtonElement).disabled).toBe(true); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Avancer 1 s simulée") as HTMLButtonElement).disabled).toBe(true); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Réinitialiser") as HTMLButtonElement).disabled).toBe(false); select("Parcours", "constant"); expect(input("Puissance demandée").disabled).toBe(false); expect(input("Vent longitudinal").disabled).toBe(false); select("Parcours", "demonstration"); expect(input("Puissance demandée").disabled).toBe(true); click("Réinitialiser"); expect(input("Puissance demandée").disabled).toBe(false); expect(input("Vent longitudinal").disabled).toBe(false); });
  it("presents the constant course as having no arrival", () => { render(<App />); expect(document.body.textContent).toContain("Aucune arrivée"); });

  it("places the rider entirely on the road at the start of a finite course", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");

    render(<App simulation={simulation} />);

    expect(riderPosition().style.left).toBe("0%");
    expect(riderPosition().style.transform).toBe("translateX(-0%)");
    expect(riderPosition()).toHaveProperty("role", "progressbar");
    expect(riderPosition().getAttribute("aria-valuenow")).toBe("0");
  });

  it("uses global finite-course progress while riding and after crossing 100 metres", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");
    advanceUntilDistance(simulation, 101);
    const snapshot = simulation.getSnapshot();
    const expectedPercent = (snapshot.courseProgress.progress ?? 0) * 100;

    render(<App simulation={simulation} />);

    expect(expectedPercent).toBeGreaterThan(0);
    expect(expectedPercent).toBeLessThan(100);
    expect(snapshot.physicalState.distanceMeters).toBeGreaterThan(100);
    expect(riderPosition().style.left).toBe(`${expectedPercent}%`);
    expect(riderPosition().style.left).not.toBe("0%");
    expect(riderPosition().style.transform).toBe(`translateX(-${expectedPercent}%)`);
    expect(riderPosition().getAttribute("aria-valuenow")).toBe(String(expectedPercent));
  });

  it("keeps the rider at the right edge at and after the finite-course finish", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");
    advanceUntilDistance(simulation, 800);
    expect(simulation.getSnapshot().courseProgress.progress).toBe(1);
    simulation.stepTicks(600);

    render(<App simulation={simulation} />);

    expect(riderPosition().style.left).toBe("100%");
    expect(riderPosition().style.transform).toBe("translateX(-100%)");
    expect(riderPosition().getAttribute("aria-valuenow")).toBe("100");
  });

  it("returns the finite-course rider to the left edge on reset", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");
    advanceUntilDistance(simulation, 100);
    render(<App simulation={simulation} />);
    expect(riderPosition().style.left).not.toBe("0%");

    click("Réinitialiser");

    expect(riderPosition().style.left).toBe("0%");
    expect(riderPosition().style.transform).toBe("translateX(-0%)");
  });

  it("keeps the 100 metre cyclic animation without announcing global progress", () => {
    const simulation = createLabSimulation();
    advanceUntilDistance(simulation, 101);
    const distanceMeters = simulation.getSnapshot().physicalState.distanceMeters;
    const expectedPercent = ((distanceMeters % 100) / 100) * 100;

    render(<App simulation={simulation} />);

    expect(distanceMeters).toBeGreaterThan(100);
    expect(riderPosition().style.left).toBe(`${expectedPercent}%`);
    expect(riderPosition().style.transform).toBe(`translateX(-${expectedPercent}%)`);
    expect(riderPosition().getAttribute("role")).toBeNull();
    expect(riderPosition().getAttribute("aria-valuenow")).toBeNull();
  });
});

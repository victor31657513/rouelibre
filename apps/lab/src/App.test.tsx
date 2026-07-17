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
  it("displays the finite arrival and disables progression controls", () => { const sim = createLabSimulation(); sim.setCourseMode("demonstration"); sim.stepTicks(10_000); render(<App simulation={sim} />); expect(document.body.textContent).toContain("800.00 m"); expect(document.body.textContent).toContain("Distance restante"); expect(document.body.textContent).toContain("Arrivé"); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Démarrer") as HTMLButtonElement).disabled).toBe(true); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Avancer 1 s simulée") as HTMLButtonElement).disabled).toBe(true); expect((Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Réinitialiser") as HTMLButtonElement).disabled).toBe(false); });
  it("presents the constant course as having no arrival", () => { render(<App />); expect(document.body.textContent).toContain("Aucune arrivée"); });
});

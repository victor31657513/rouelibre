import { useEffect, useMemo, useState } from "react";
import { FixedStepRunner, type ObservationSpeed } from "./simulation/fixedStepRunner.js";
import { createLabSimulation, type LabSimulation, type LabSimulationSnapshot } from "./simulation/labSimulation.js";

const fmt = (value: number, digits = 2): string => value.toFixed(digits);

interface AppProps { readonly simulation?: LabSimulation; }

export function App({ simulation: providedSimulation }: AppProps): React.JSX.Element {
  const simulation = useMemo(() => providedSimulation ?? createLabSimulation(), [providedSimulation]);
  const [snapshot, setSnapshot] = useState<LabSimulationSnapshot>(() => simulation.getSnapshot());
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [speed, setSpeed] = useState<ObservationSpeed>(1);
  const runner = useMemo(() => new FixedStepRunner({ simulation, onAfterStep: () => setSnapshot(simulation.getSnapshot()), onError: (err) => { setRunning(false); setError(err instanceof Error ? err.message : String(err)); } }), [simulation]);
  useEffect(() => () => runner.pause(), [runner]);
  const refresh = (): void => setSnapshot(simulation.getSnapshot());
  const setPower = (value: number): void => { simulation.setRequestedPowerWatts(value); refresh(); };
  const setWind = (value: number): void => { simulation.setWindSpeedMetersPerSecond(value); refresh(); };
  const setRoadGradePercent = (value: number): void => { simulation.setRoadGradePercent(value); refresh(); };
  const setCourseMode = (value: "constant" | "demonstration"): void => { simulation.setCourseMode(value); refresh(); };
  const start = (): void => { setError(undefined); runner.start(); setRunning(true); };
  const pause = (): void => { runner.pause(); setRunning(false); };
  const reset = (): void => { runner.pause(); simulation.reset(); setRunning(false); setError(undefined); refresh(); };
  const manualStep = (): void => { try { runner.stepOneSimulatedSecond(); } catch (err) { setError(err instanceof Error ? err.message : String(err)); setRunning(false); } };
  const setRunnerSpeed = (value: ObservationSpeed): void => { runner.setSpeed(value); setSpeed(value); };
  const physical = snapshot.physicalState;
  const energy = snapshot.energyState;
  const forces = snapshot.forces;
  const reservePercent = (energy.anaerobicReserveJoules / snapshot.energyProfile.anaerobicCapacityJoules) * 100;
  const riderPercent = ((physical.distanceMeters % 100) / 100) * 100;
  const roadGradePercent = snapshot.environment.roadGrade * 100;
  const formattedRoadGradePercent = `${roadGradePercent > 0 ? "+" : ""}${fmt(roadGradePercent, 1)}`;
  const coursePosition = snapshot.coursePosition;
  const isConstantCourse = snapshot.courseMode === "constant";

  return <main className="app-shell">
    <header><h1>Laboratoire visuel — coureur isolé</h1><p>Observation déterministe du moteur validé à pas fixe de {fmt(snapshot.tickSeconds, 4)} s.</p></header>
    {error && <div role="alert" className="error">Erreur moteur : {error}</div>}
    <section className="panel controls" aria-labelledby="controls-title"><h2 id="controls-title">Commandes</h2>
      <label>Puissance demandée <input aria-label="Puissance demandée" type="range" min="0" max="1200" step="5" value={physical.requestedPowerWatts} onInput={(event) => setPower(event.currentTarget.valueAsNumber)} onChange={(event) => setPower(event.currentTarget.valueAsNumber)} /> <output>{fmt(physical.requestedPowerWatts, 0)} W</output></label>
      <label>Vent longitudinal <input aria-label="Vent longitudinal" type="range" min="-10" max="10" step="0.5" value={snapshot.environment.windSpeedMetersPerSecond} onInput={(event) => setWind(event.currentTarget.valueAsNumber)} onChange={(event) => setWind(event.currentTarget.valueAsNumber)} /> <output>{fmt(snapshot.environment.windSpeedMetersPerSecond, 1)} m/s</output></label>
      <p className="hint">Convention : valeur positive = vent de face ; valeur négative = vent arrière.</p>
      <label>Parcours <select aria-label="Parcours" value={snapshot.courseMode} onChange={(event) => setCourseMode(event.currentTarget.value as "constant" | "demonstration")}><option value="constant">Pente constante</option><option value="demonstration">Parcours segmenté de démonstration</option></select></label>
      <label>Pente longitudinale <input aria-label="Pente longitudinale" type="range" min="-20" max="20" step="0.5" value={isConstantCourse ? roadGradePercent : 0} disabled={!isConstantCourse} onInput={(event) => setRoadGradePercent(event.currentTarget.valueAsNumber)} onChange={(event) => setRoadGradePercent(event.currentTarget.valueAsNumber)} /> <output>{isConstantCourse ? formattedRoadGradePercent : "pilotée par le parcours"}</output></label>
      <p className="hint">Convention : +5,0 % = montée ; 0,0 % = plat ; -5,0 % = descente.</p>
      <label>Vitesse d'observation <select aria-label="Vitesse d'observation" value={speed} onChange={(event) => setRunnerSpeed(Number(event.currentTarget.value) as ObservationSpeed)}><option value={1}>×1</option><option value={5}>×5</option><option value={20}>×20</option></select></label><strong>Multiplicateur actif : ×{speed}</strong>
      <div className="buttons"><button type="button" onClick={start} disabled={running}>Démarrer</button><button type="button" onClick={pause} disabled={!running}>Pause</button><button type="button" onClick={reset}>Réinitialiser</button><button type="button" onClick={manualStep} disabled={running}>Avancer 1 s simulée</button></div>
    </section>
    <section className="panel visual" aria-labelledby="visual-title"><h2 id="visual-title">Route longitudinale</h2><div className="road"><div className="rider" style={{ left: `${riderPercent}%` }} aria-label="Position visuelle du coureur" /></div><div className="gauge" aria-label="Jauge W prime"><span style={{ width: `${reservePercent}%` }} /></div><p>Réserve W′ : {fmt(energy.anaerobicReserveJoules, 0)} J ({fmt(reservePercent, 1)} %)</p></section>
    <section className="grid" aria-label="Observables">
      <article className="panel"><h2>État physique</h2><dl><dt>Temps simulé</dt><dd>{fmt(physical.timeSeconds)} s</dd><dt>Distance</dt><dd>{fmt(physical.distanceMeters)} m / {fmt(physical.distanceMeters / 1000, 3)} km</dd><dt>Vitesse</dt><dd>{fmt(physical.speedMetersPerSecond)} m/s / {fmt(physical.speedMetersPerSecond * 3.6)} km/h</dd><dt>Accélération</dt><dd>{fmt(physical.accelerationMetersPerSecondSquared)} m/s²</dd></dl></article>
      <article className="panel"><h2>Puissance et énergie</h2><dl><dt>Puissance demandée</dt><dd>{fmt(physical.requestedPowerWatts, 0)} W</dd><dt>Puissance produite</dt><dd>{fmt(physical.producedPowerWatts, 0)} W</dd><dt>Puissance critique</dt><dd>{fmt(snapshot.energyProfile.criticalPowerWatts, 0)} W</dd><dt>Puissance anaérobie dernier pas</dt><dd>{fmt(energy.lastAnaerobicPowerWatts)} W</dd><dt>Puissance de récupération dernier pas</dt><dd>{fmt(energy.lastRecoveryPowerWatts)} W</dd><dt>Limitation énergétique</dt><dd>{energy.isPowerLimitedByEnergy ? "Puissance limitée par l’énergie" : "Aucune limitation énergétique"}</dd></dl></article>
      <article className="panel"><h2>Environnement et forces</h2><dl><dt>Vitesse du vent</dt><dd>{fmt(snapshot.environment.windSpeedMetersPerSecond, 1)} m/s</dd><dt>Pente longitudinale</dt><dd>{formattedRoadGradePercent} %</dd><dt>Vitesse relative de l’air</dt><dd>{fmt(forces.relativeAirSpeedMetersPerSecond)} m/s</dd><dt>Force propulsive</dt><dd>{fmt(forces.propulsiveForceNewtons)} N</dd><dt>Traînée aérodynamique signée</dt><dd>{fmt(forces.aerodynamicDragForceNewtons)} N</dd><dt>Résistance au roulement</dt><dd>{fmt(forces.rollingResistanceForceNewtons)} N</dd><dt>Force gravitationnelle longitudinale</dt><dd>{fmt(forces.gravityForceNewtons)} N</dd><dt>Force nette</dt><dd>{fmt(forces.netForceNewtons)} N</dd></dl></article>
      <article className="panel"><h2>Parcours</h2><dl><dt>Mode</dt><dd>{isConstantCourse ? "Pente constante" : "Parcours segmenté de démonstration"}</dd><dt>Segment actif</dt><dd>Segment {coursePosition.segmentIndex + 1} / {coursePosition.segmentCount} — {formattedRoadGradePercent} %</dd><dt>Début du segment</dt><dd>{fmt(coursePosition.segmentStartDistanceMeters)} m</dd><dt>Distance dans le segment</dt><dd>{fmt(coursePosition.distanceIntoSegmentMeters)} m</dd><dt>Prochaine frontière</dt><dd>{coursePosition.nextSegmentStartDistanceMeters === undefined ? "dernier segment" : `${fmt(coursePosition.nextSegmentStartDistanceMeters)} m`}</dd></dl></article>
    </section>
  </main>;
}

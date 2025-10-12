import './style.css'
import { Application } from './app/Application'

/**
 * @fileoverview Application entry point bootstrapping the Roue Libre viewer.
 * Instantiates the orchestrator and runs initial setup once the DOM is ready.
 *
 * Extension: If SSR or hydration is introduced call `initialise` conditionally
 * when the necessary DOM nodes are available.
 */
const app = new Application()

void app.initialise()

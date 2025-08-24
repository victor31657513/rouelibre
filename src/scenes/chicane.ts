import * as THREE from 'three'
import { PathSpline, createSplineHelper } from '../systems/pathSmoothing'

export function createChicaneScene() {
  const pts = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(15, 0, 5),
    new THREE.Vector3(20, 0, -5),
    new THREE.Vector3(25, 0, 0),
    new THREE.Vector3(35, 0, 0)
  ]
  const spline = new PathSpline(pts)
  const helper = createSplineHelper(spline)
  return { spline, helper }
}

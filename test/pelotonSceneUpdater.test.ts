import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { PelotonSceneUpdater } from '../src/domain/simulation/PelotonSceneUpdater'

function createUpdater(instanceCount: number): {
  mesh: THREE.InstancedMesh
  objects: THREE.Object3D[]
  updater: PelotonSceneUpdater
} {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial()
  const mesh = new THREE.InstancedMesh(geometry, material, instanceCount)
  const objects = Array.from({ length: instanceCount }, () => new THREE.Object3D())
  const updater = new PelotonSceneUpdater(mesh, objects, {
    laneWidth: 3,
    roadWidth: 6,
    margin: 0.5,
  })
  return { mesh, objects, updater }
}

describe('PelotonSceneUpdater', () => {
  it('applies world positions and yaw directly to rider matrices', () => {
    const { mesh, objects, updater } = createUpdater(2)
    const yaw = Math.PI / 2
    const state = new Float32Array([
      1, 2, 3, yaw,
      -4, 0.5, 2, 0,
    ])

    updater.applyState(state)

    const matrix = new THREE.Matrix4()
    mesh.getMatrixAt(0, matrix)
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    matrix.decompose(position, quaternion, new THREE.Vector3())

    const geometryAlign = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -Math.PI / 2,
    )
    const expectedQuat = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
      .multiply(geometryAlign)

    expect(position.x).toBeCloseTo(1)
    expect(position.y).toBeCloseTo(2)
    expect(position.z).toBeCloseTo(3)
    expect(quaternion.angleTo(expectedQuat)).toBeLessThan(1e-6)
    expect(objects[0].position.x).toBeCloseTo(1)
    expect(objects[0].position.y).toBeCloseTo(2)
    expect(objects[0].position.z).toBeCloseTo(3)

    mesh.getMatrixAt(1, matrix)
    matrix.decompose(position, quaternion, new THREE.Vector3())
    expect(position.x).toBeCloseTo(-4)
    expect(position.y).toBeCloseTo(0.5)
    expect(position.z).toBeCloseTo(2)
  })
})

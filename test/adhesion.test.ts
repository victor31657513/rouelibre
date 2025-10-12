import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { projectOntoRoad } from '../src/domain/scene/roadAdhesion'

describe('adhesion', () => {
  it('aligns rider up vector with road normal', () => {
    const geom = new THREE.PlaneGeometry(10, 10)
    const mesh = new THREE.Mesh(geom)
    mesh.rotateZ(THREE.MathUtils.degToRad(10))
    mesh.rotateX(-Math.PI / 2)
    mesh.updateMatrixWorld()
    const raycaster = new THREE.Raycaster()
    const { quaternion } = projectOntoRoad(0, 5, 0, 0, mesh, raycaster)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion)
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
    const normal = new THREE.Vector3(0, 0, 1).applyMatrix3(normalMatrix).normalize()
    expect(up.angleTo(normal)).toBeLessThan(THREE.MathUtils.degToRad(2))
  })

  it('places rider within 1cm of target altitude', () => {
    const geom = new THREE.PlaneGeometry(10, 10)
    const mesh = new THREE.Mesh(geom)
    mesh.rotateX(-Math.PI / 2)
    mesh.updateMatrixWorld()
    const raycaster = new THREE.Raycaster()
    const footClearance = 1
    const { position } = projectOntoRoad(0, 5, 0, 0, mesh, raycaster, footClearance)
    expect(Math.abs(position.y - footClearance)).toBeLessThan(0.01)
  })
})

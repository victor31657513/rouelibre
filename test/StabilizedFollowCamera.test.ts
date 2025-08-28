import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { StabilizedFollowCamera } from '../src/camera/StabilizedFollowCamera'

describe('StabilizedFollowCamera', () => {
  it('clamps yaw rate', () => {
    const camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 0, 0)
    const follow = new StabilizedFollowCamera(camera)
    follow.setFollowOffset(new THREE.Vector3(0, 0, 0))
    const rider = new THREE.Object3D()
    rider.position.set(0, 0, 10)
    follow.update(1, [rider])
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
    const yawDeg = Math.abs(THREE.MathUtils.radToDeg(euler.y))
    expect(yawDeg).toBeLessThanOrEqual(120 + 1e-3)
  })

  it('honors deadzone', () => {
    const camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 0, 0)
    const follow = new StabilizedFollowCamera(camera)
    follow.setFollowOffset(new THREE.Vector3(0, 0, 0))
    const angle = THREE.MathUtils.degToRad(5)
    const rider = new THREE.Object3D()
    rider.position.set(Math.sin(angle) * 10, 0, -Math.cos(angle) * 10)
    follow.update(1, [rider])
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
    const yawDeg = Math.abs(THREE.MathUtils.radToDeg(euler.y))
    expect(yawDeg).toBeLessThan(1)
  })

  it('snapTo positions camera behind rider', () => {
    const camera = new THREE.PerspectiveCamera()
    camera.position.set(5, 5, 5)
    const follow = new StabilizedFollowCamera(camera)
    const rider = new THREE.Object3D()
    rider.position.set(10, 0, 0)
    follow.snapTo([rider])
    expect(camera.position.x).toBeCloseTo(rider.position.x + follow.followOffset.x)
    expect(camera.position.y).toBeCloseTo(rider.position.y + follow.followOffset.y)
    expect(camera.position.z).toBeCloseTo(rider.position.z + follow.followOffset.z)
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    const expectedDir = rider.position.clone().sub(camera.position).normalize()
    expect(dir.x).toBeCloseTo(expectedDir.x)
    expect(dir.y).toBeCloseTo(expectedDir.y)
    expect(dir.z).toBeCloseTo(expectedDir.z)
  })
})

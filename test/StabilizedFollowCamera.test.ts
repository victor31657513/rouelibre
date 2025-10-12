import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { StabilizedFollowCamera } from '../src/domain/camera/StabilizedFollowCamera'

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
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    const expectedDir = rider.position.clone().sub(camera.position).normalize()
    expect(dir.x).toBeCloseTo(expectedDir.x)
    expect(dir.y).toBeCloseTo(expectedDir.y)
    expect(dir.z).toBeCloseTo(expectedDir.z)

    const worldForward = expectedDir
    const worldRight = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), worldForward)
    if (worldRight.lengthSq() < 1e-6) worldRight.set(1, 0, 0)
    worldRight.normalize()
    const diff = camera.position.clone().sub(rider.position)
    const localX = diff.dot(worldRight)
    expect(camera.position.y - rider.position.y).toBeCloseTo(follow.followOffset.y)
    const planarOffset = rider.position.clone().setY(0).sub(camera.position.clone().setY(0))
    expect(planarOffset.length()).toBeCloseTo(Math.abs(follow.followOffset.z))
    expect(localX).toBeCloseTo(0, 1e-6)
  })
})

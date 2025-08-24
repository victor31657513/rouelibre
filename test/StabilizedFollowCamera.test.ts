import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { StabilizedFollowCamera } from '../src/camera/StabilizedFollowCamera'

describe('StabilizedFollowCamera', () => {
  it('clamps yaw rate', () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 0, 0)
    const follow = new StabilizedFollowCamera(camera, scene)
    follow.setFollowOffset(new THREE.Vector3(0, 0, 0))
    const rider = new THREE.Object3D()
    rider.position.set(0, 0, 10)
    follow.update(1, [rider])
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
    const yawDeg = Math.abs(THREE.MathUtils.radToDeg(euler.y))
    expect(yawDeg).toBeLessThanOrEqual(120 + 1e-3)
  })

  it('honors deadzone', () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 0, 0)
    const follow = new StabilizedFollowCamera(camera, scene)
    follow.setFollowOffset(new THREE.Vector3(0, 0, 0))
    const angle = THREE.MathUtils.degToRad(5)
    const rider = new THREE.Object3D()
    rider.position.set(Math.sin(angle) * 10, 0, -Math.cos(angle) * 10)
    follow.update(1, [rider])
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
    const yawDeg = Math.abs(THREE.MathUtils.radToDeg(euler.y))
    expect(yawDeg).toBeLessThan(1)
  })
})

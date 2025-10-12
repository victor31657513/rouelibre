import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { StabilizedFollowCamera } from '../src/domain/camera/StabilizedFollowCamera'
import { selectedIndex, setSelectedIndex, changeSelectedIndex } from '../src/domain/state/selection'

describe('camera follows selected rider', () => {
  let camera: THREE.PerspectiveCamera
  let follow: StabilizedFollowCamera
  let riders: THREE.Object3D[]

  beforeEach(() => {
    camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 0, 0)
    follow = new StabilizedFollowCamera(camera, {
      posDamping: 1000,
      rotDamping: 1000,
      deadzoneDeg: 0,
      maxYawRate: 360,
      maxPitchRate: 360,
      lookAheadTime: 0,
      lowPassAlpha: 1,
    })
    riders = [new THREE.Object3D(), new THREE.Object3D()]
    riders[0].position.set(0, 0, 0)
    riders[1].position.set(10, 0, 0)
    setSelectedIndex(0, riders.length)
  })

  it('updates camera position and direction to selected rider', () => {
    const dt = 1
    follow.update(dt, [riders[selectedIndex]])

    changeSelectedIndex(1, riders.length)
    follow.update(dt, [riders[selectedIndex]])

    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    const expectedDir = riders[1].position.clone().sub(camera.position).normalize()
    expect(dir.x).toBeCloseTo(expectedDir.x)
    expect(dir.y).toBeCloseTo(expectedDir.y)
    expect(dir.z).toBeCloseTo(expectedDir.z)

    const worldForward = expectedDir
    const worldRight = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), worldForward)
    if (worldRight.lengthSq() < 1e-6) worldRight.set(1, 0, 0)
    worldRight.normalize()
    const diff = camera.position.clone().sub(riders[1].position)
    const localX = diff.dot(worldRight)
    expect(camera.position.y - riders[1].position.y).toBeCloseTo(follow.followOffset.y)
    const planarOffset = riders[1].position.clone().setY(0).sub(camera.position.clone().setY(0))
    expect(planarOffset.length()).toBeCloseTo(Math.abs(follow.followOffset.z))
    expect(localX).toBeCloseTo(0, 1e-6)
  })
})

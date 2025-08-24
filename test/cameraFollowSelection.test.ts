import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { StabilizedFollowCamera } from '../src/camera/StabilizedFollowCamera'
import { selectedIndex, setSelectedIndex, changeSelectedIndex } from '../src/selection'

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
      chicaneBypassWeight: 0,
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
    expect(camera.position.x).toBeCloseTo(riders[0].position.x + follow.followOffset.x)
    expect(camera.position.y).toBeCloseTo(riders[0].position.y + follow.followOffset.y)
    expect(camera.position.z).toBeCloseTo(riders[0].position.z + follow.followOffset.z)

    changeSelectedIndex(1, riders.length)
    follow.update(dt, [riders[selectedIndex]])
    expect(camera.position.x).toBeCloseTo(riders[1].position.x + follow.followOffset.x)
    expect(camera.position.y).toBeCloseTo(riders[1].position.y + follow.followOffset.y)
    expect(camera.position.z).toBeCloseTo(riders[1].position.z + follow.followOffset.z)

    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    const expectedDir = riders[1].position.clone().sub(camera.position).normalize()
    expect(dir.x).toBeCloseTo(expectedDir.x)
    expect(dir.y).toBeCloseTo(expectedDir.y)
    expect(dir.z).toBeCloseTo(expectedDir.z)
  })
})

import * as THREE from 'three'

export interface FollowCameraParams {
  followOffset?: THREE.Vector3
  posDamping?: number
  rotDamping?: number
  maxYawRate?: number
  maxPitchRate?: number
  deadzoneDeg?: number
  lookAheadTime?: number
  chicaneBypassWeight?: number
  lowPassAlpha?: number
}

/**
 * Smooth/stabilized camera following a group of objects.
 */
export class StabilizedFollowCamera {
  camera: THREE.PerspectiveCamera
  followOffset: THREE.Vector3
  posDamping: number
  rotDamping: number
  maxYawRate: number // radians per second
  maxPitchRate: number // radians per second
  deadzoneDeg: number
  lookAheadTime: number
  chicaneBypassWeight: number
  lowPassAlpha: number

  private _posVelocity = new THREE.Vector3()
  private _smoothedQuat = new THREE.Quaternion()
  private _prevRiderPositions: THREE.Vector3[] = []

  // debug helpers
  private _followArrow: THREE.ArrowHelper
  private _bypassArrow: THREE.ArrowHelper
  private _deadzoneLines: THREE.LineSegments

  constructor(camera: THREE.PerspectiveCamera, scene: THREE.Scene, params: FollowCameraParams = {}) {
    this.camera = camera
    this.followOffset = params.followOffset?.clone() ?? new THREE.Vector3(0, 6, -10)
    this.posDamping = params.posDamping ?? 6
    this.rotDamping = params.rotDamping ?? 8
    this.maxYawRate = (params.maxYawRate ?? 120) * THREE.MathUtils.DEG2RAD
    this.maxPitchRate = (params.maxPitchRate ?? 90) * THREE.MathUtils.DEG2RAD
    this.deadzoneDeg = params.deadzoneDeg ?? 8
    this.lookAheadTime = params.lookAheadTime ?? 0.3
    this.chicaneBypassWeight = params.chicaneBypassWeight ?? 0.7
    this.lowPassAlpha = params.lowPassAlpha ?? 0.12

    this._smoothedQuat.copy(camera.quaternion)

    // debug helpers
    this._followArrow = new THREE.ArrowHelper(new THREE.Vector3(), camera.position.clone(), 5, 0x00ff00)
    this._bypassArrow = new THREE.ArrowHelper(new THREE.Vector3(), camera.position.clone(), 5, 0xff0000)
    const dzGeom = new THREE.BufferGeometry()
    dzGeom.setAttribute('position', new THREE.Float32BufferAttribute(12, 3))
    const dzMat = new THREE.LineBasicMaterial({ color: 0xffff00 })
    this._deadzoneLines = new THREE.LineSegments(dzGeom, dzMat)
    scene.add(this._followArrow)
    scene.add(this._bypassArrow)
    scene.add(this._deadzoneLines)
  }

  // setters for tweaking parameters
  setFollowOffset(v: THREE.Vector3): void { this.followOffset.copy(v) }
  setPosDamping(v: number): void { this.posDamping = v }
  setRotDamping(v: number): void { this.rotDamping = v }
  setMaxYawRate(v: number): void { this.maxYawRate = v * THREE.MathUtils.DEG2RAD }
  setMaxPitchRate(v: number): void { this.maxPitchRate = v * THREE.MathUtils.DEG2RAD }
  setDeadzoneDeg(v: number): void { this.deadzoneDeg = v }
  setLookAheadTime(v: number): void { this.lookAheadTime = v }
  setChicaneBypassWeight(v: number): void { this.chicaneBypassWeight = v }
  setLowPassAlpha(v: number): void { this.lowPassAlpha = v }

  update(dt: number, riders: THREE.Object3D[]): void {
    if (riders.length === 0) return
    // compute bounding box and average velocity
    const box = new THREE.Box3()
    const avgVel = new THREE.Vector3()
    if (this._prevRiderPositions.length !== riders.length) {
      this._prevRiderPositions = riders.map((r) => r.position.clone())
    }
    for (let i = 0; i < riders.length; i++) {
      const pos = riders[i].position
      box.expandByPoint(pos)
      const vel = new THREE.Vector3().subVectors(pos, this._prevRiderPositions[i]).divideScalar(dt || 1)
      avgVel.add(vel)
      this._prevRiderPositions[i].copy(pos)
    }
    avgVel.divideScalar(riders.length)
    const center = box.getCenter(new THREE.Vector3())

    const predictedTarget = center.addScaledVector(avgVel, this.lookAheadTime)

    // position spring (critically damped approximation)
    const desiredPos = predictedTarget.clone().add(this.followOffset)
    const t = 1 - Math.exp(-this.posDamping * dt)
    this.camera.position.lerp(desiredPos, t)

    // orientation
    const followDir = predictedTarget.clone().sub(this.camera.position).normalize()
    const bypassDir = avgVel.clone().setY(0)
    if (bypassDir.lengthSq() > 1e-6) bypassDir.normalize()
    else bypassDir.copy(followDir)
    const desiredForward = followDir.clone().lerp(bypassDir, this.chicaneBypassWeight).normalize()

    // update debug arrows
    this._followArrow.position.copy(this.camera.position)
    this._followArrow.setDirection(followDir)
    this._bypassArrow.position.copy(this.camera.position)
    this._bypassArrow.setDirection(bypassDir)

    // deadzone rays
    const dzRad = THREE.MathUtils.degToRad(this.deadzoneDeg)
    const forward = this.camera.getWorldDirection(new THREE.Vector3())
    const up = new THREE.Vector3(0, 1, 0)
    const leftDir = forward.clone().applyAxisAngle(up, dzRad)
    const rightDir = forward.clone().applyAxisAngle(up, -dzRad)
    const dzPos = this._deadzoneLines.geometry.getAttribute('position') as THREE.Float32BufferAttribute
    const camPos = this.camera.position
    const len = 5
    dzPos.setXYZ(0, camPos.x, camPos.y, camPos.z)
    dzPos.setXYZ(1, camPos.x + leftDir.x * len, camPos.y + leftDir.y * len, camPos.z + leftDir.z * len)
    dzPos.setXYZ(2, camPos.x, camPos.y, camPos.z)
    dzPos.setXYZ(3, camPos.x + rightDir.x * len, camPos.y + rightDir.y * len, camPos.z + rightDir.z * len)
    dzPos.needsUpdate = true

    const angle = THREE.MathUtils.radToDeg(followDir.angleTo(forward))
    if (angle < this.deadzoneDeg) {
      this._smoothedQuat.copy(this.camera.quaternion)
      return
    }

    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(this.camera.position, this.camera.position.clone().add(desiredForward), up)
    )
    const qSmoothed = this.camera.quaternion.clone().slerp(targetQuat, this.lowPassAlpha)

    // clamp yaw/pitch rates
    const currEuler = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ')
    const targetEuler = new THREE.Euler().setFromQuaternion(qSmoothed, 'YXZ')
    const angleDiff = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a))
    const deltaYaw = THREE.MathUtils.clamp(
      angleDiff(currEuler.y, targetEuler.y),
      -this.maxYawRate * dt,
      this.maxYawRate * dt
    )
    const deltaPitch = THREE.MathUtils.clamp(
      angleDiff(currEuler.x, targetEuler.x),
      -this.maxPitchRate * dt,
      this.maxPitchRate * dt
    )
    currEuler.y += deltaYaw
    currEuler.x += deltaPitch
    const finalQuat = new THREE.Quaternion().setFromEuler(currEuler)
    this.camera.quaternion.slerp(finalQuat, 1 - Math.exp(-this.rotDamping * dt))
    this._smoothedQuat.copy(this.camera.quaternion)
  }
}


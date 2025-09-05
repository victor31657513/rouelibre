import * as THREE from 'three'

export function projectOntoRoad(
  x: number,
  y: number,
  z: number,
  yaw: number,
  road: THREE.Object3D,
  raycaster: THREE.Raycaster,
  height = 1
): { position: THREE.Vector3; quaternion: THREE.Quaternion } {
  const origin = new THREE.Vector3(x, y + 100, z)
  raycaster.set(origin, new THREE.Vector3(0, -1, 0))
  const hits = raycaster.intersectObject(road, false)
  if (hits.length > 0) {
    const hit = hits[0]
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)
    const up = hit.face!.normal.clone().applyMatrix3(normalMatrix).normalize()
    const pos = hit.point.clone().add(up.clone().multiplyScalar(height))
    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize()
    const look = pos.clone().add(forward)
    const matrix = new THREE.Matrix4().lookAt(pos, look, up)
    const quat = new THREE.Quaternion().setFromRotationMatrix(matrix)
    const correction = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0))
    quat.multiply(correction)
    return { position: pos, quaternion: quat }
  }
  const pos = new THREE.Vector3(x, y, z)
  const quat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, yaw - Math.PI / 2, 0)
  )
  return { position: pos, quaternion: quat }
}

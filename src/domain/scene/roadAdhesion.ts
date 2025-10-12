/**
 * Utilities that align rider poses with the road mesh using ray casting.
 *
 * Extension: For curved banking or off-road segments introduce new projection
 * strategies that plug into the same interface.
 */
import * as THREE from 'three'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'

;(THREE.Mesh.prototype as any).raycast = acceleratedRaycast

/** Projects a single position/yaw pair onto the road surface. */
export function projectOntoRoad(
  x: number,
  y: number,
  z: number,
  yaw: number,
  road: THREE.Object3D,
  raycaster: THREE.Raycaster,
  footClearance = 1
): { position: THREE.Vector3; quaternion: THREE.Quaternion } {
  const origin = new THREE.Vector3(x, y + 100, z)
  raycaster.firstHitOnly = true
  raycaster.set(origin, new THREE.Vector3(0, -1, 0))

  if ((road as any).isMesh) {
    const mesh = road as THREE.Mesh
    const geom = mesh.geometry as THREE.BufferGeometry & { boundsTree?: MeshBVH }
    if (!geom.boundsTree) {
      geom.boundsTree = new MeshBVH(geom)
    }
  }

  const hits = raycaster.intersectObject(road, false)
  if (hits.length > 0) {
    const hit = hits[0]
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)
    const normal = hit.face!.normal.clone().applyMatrix3(normalMatrix).normalize()
    const pos = hit.point.clone().add(normal.clone().multiplyScalar(footClearance))
    let tangent = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw))
    tangent = tangent.projectOnPlane(normal).normalize()
    const look = pos.clone().add(tangent)
    const matrix = new THREE.Matrix4().lookAt(pos, look, normal)
    const quat = new THREE.Quaternion().setFromRotationMatrix(matrix)
    const correction = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0))
    quat.multiply(correction)

    const euler = new THREE.Euler().setFromQuaternion(quat, 'YXZ')
    const maxRoll = THREE.MathUtils.degToRad(45)
    euler.z = THREE.MathUtils.clamp(euler.z, -maxRoll, maxRoll)
    quat.setFromEuler(euler)

    return { position: pos, quaternion: quat }
  }
  const pos = new THREE.Vector3(x, y, z)
  const quat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, yaw - Math.PI / 2, 0)
  )
  return { position: pos, quaternion: quat }
}

/** Convenience helper that applies {@link projectOntoRoad} to a batch. */
export function projectOntoRoadBatch(
  states: { x: number; y: number; z: number; yaw: number }[],
  road: THREE.Object3D,
  raycaster: THREE.Raycaster,
  footClearance = 1
): { positions: THREE.Vector3[]; quaternions: THREE.Quaternion[] } {
  const positions: THREE.Vector3[] = []
  const quaternions: THREE.Quaternion[] = []
  for (const s of states) {
    const { position, quaternion } = projectOntoRoad(
      s.x,
      s.y,
      s.z,
      s.yaw,
      road,
      raycaster,
      footClearance
    )
    positions.push(position)
    quaternions.push(quaternion)
  }
  return { positions, quaternions }
}

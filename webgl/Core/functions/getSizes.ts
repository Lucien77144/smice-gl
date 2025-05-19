import { type Object3D, Group, Box3, Vector3 } from 'three'

export function getSizes(el: Object3D | Group) {
  const box = new Box3()
  box.setFromObject(el)

  const size = new Vector3()
  box.getSize(size)

  // Scale down the values by dividing by 100 to get more manageable sizes
  return {
    width: size.x / 100,
    height: size.y / 100,
    depth: size.z / 100,
  }
}

import { useMemo } from 'react'
import * as THREE from 'three'
import { terrainHeight } from '../lib/terrain'

const GREEN = new THREE.Color('#5b7a43')
const ROCK = new THREE.Color('#8a8074')
const SNOW = new THREE.Color('#eef3f6')

function colorFor(h: number, out: THREE.Color) {
  if (h < 7) return out.copy(GREEN)
  if (h < 15) return out.lerpColors(GREEN, ROCK, (h - 7) / 8)
  if (h < 21) return out.lerpColors(ROCK, SNOW, (h - 15) / 6)
  return out.copy(SNOW)
}

export function Terrain() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(150, 90, 220, 130)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const h = terrainHeight(pos.getX(i), pos.getZ(i))
      pos.setY(i, h)
      colorFor(h, c).toArray(colors, i * 3)
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={0.95} />
    </mesh>
  )
}

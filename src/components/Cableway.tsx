import { useMemo } from 'react'
import * as THREE from 'three'
import { terrainHeight } from '../lib/terrain'
import {
  LINE_Z, LOOP, TOWER_X, cableY, isStation, pathAt, towerTop,
} from '../lib/cableway'

function Rope() {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let s = 0; s < LOOP; s += 0.75) {
      const p = pathAt(s)
      pts.push(new THREE.Vector3(p.x, cableY(p.x), p.z))
    }
    const curve = new THREE.CatmullRomCurve3(pts, true)
    return new THREE.TubeGeometry(curve, pts.length * 2, 0.07, 8, true)
  }, [])
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#2a2d33" metalness={0.6} roughness={0.4} />
    </mesh>
  )
}

function Tower({ x }: { x: number }) {
  const ground = terrainHeight(x, 0)
  const top = towerTop(x)
  const height = top - ground + 2
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, ground - 2 + height / 2, 0]}>
        <cylinderGeometry args={[0.28, 0.65, height, 10]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, top - 0.35, 0]}>
        <boxGeometry args={[0.9, 0.35, LINE_Z * 2 + 3]} />
        <meshStandardMaterial color="#c8412f" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Station({ x }: { x: number }) {
  const ground = terrainHeight(x, 0)
  const top = towerTop(x)
  const dir = Math.sign(x)
  const pillars: [number, number][] = [[-3.5, -3.5], [-3.5, 3.5], [3.5, -3.5], [3.5, 3.5]]
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, ground + 0.3, 0]}>
        <boxGeometry args={[10, 0.6, 10]} />
        <meshStandardMaterial color="#6d7580" roughness={0.9} />
      </mesh>
      {pillars.map(([px, pz]) => (
        <mesh key={`${px}${pz}`} position={[px, (ground + top + 3) / 2, pz]}>
          <boxGeometry args={[0.5, top + 3 - ground, 0.5]} />
          <meshStandardMaterial color="#9aa3ad" />
        </mesh>
      ))}
      <mesh position={[0, top + 3.2, 0]}>
        <boxGeometry args={[10.5, 0.5, 10.5]} />
        <meshStandardMaterial color="#c8412f" roughness={0.6} />
      </mesh>
      {/* bullwheel on the outer side where the rope turns */}
      <mesh position={[dir * 0.1, cableY(x), 0]}>
        <cylinderGeometry args={[LINE_Z, LINE_Z, 0.2, 32]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

export function Cableway() {
  return (
    <>
      <Rope />
      {TOWER_X.map((x) => (isStation(x) ? <Station key={x} x={x} /> : <Tower key={x} x={x} />))}
    </>
  )
}

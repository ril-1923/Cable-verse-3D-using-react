import { STATION_X, terrainHeight } from './terrain'

export const LINE_Z = 1.6 // half the distance between the up and down lines
export const TOWER_X = [-36, -18, 0, 18, 36]
export const HANG = 2.6 // grip point to cabin roof
export const CABIN_COUNT = 4
const SAG = 2.4

const [X0, X1] = STATION_X
const LEN = X1 - X0
const ARC = Math.PI * LINE_Z
export const LOOP = 2 * LEN + 2 * ARC

export const isStation = (x: number) => x === X0 || x === X1

export function towerTop(x: number): number {
  return terrainHeight(x, 0) + (isStation(x) ? 7 : 10)
}

/** Rope height at x: straight between tower tops, sagging in each span. */
export function cableY(x: number): number {
  const cx = Math.min(X1, Math.max(X0, x))
  let i = 0
  while (i < TOWER_X.length - 2 && cx > TOWER_X[i + 1]) i++
  const a = TOWER_X[i]
  const b = TOWER_X[i + 1]
  const u = (cx - a) / (b - a)
  const ya = towerTop(a)
  const yb = towerTop(b)
  return ya + (yb - ya) * u - SAG * 4 * u * (1 - u)
}

export interface PathPoint { x: number; z: number; dx: number; dz: number }

/** Position and heading on the closed loop: up line, top turn, down line, bottom turn. */
export function pathAt(s: number): PathPoint {
  if (s < LEN) return { x: X0 + s, z: LINE_Z, dx: 1, dz: 0 }
  s -= LEN
  if (s < ARC) {
    const p = s / LINE_Z
    return { x: X1 + LINE_Z * Math.sin(p), z: LINE_Z * Math.cos(p), dx: Math.cos(p), dz: -Math.sin(p) }
  }
  s -= ARC
  if (s < LEN) return { x: X1 - s, z: -LINE_Z, dx: -1, dz: 0 }
  s -= LEN
  const p = s / LINE_Z
  return { x: X0 - LINE_Z * Math.sin(p), z: -LINE_Z * Math.cos(p), dx: -Math.cos(p), dz: Math.sin(p) }
}

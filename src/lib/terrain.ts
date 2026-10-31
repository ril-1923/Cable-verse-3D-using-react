export const X_MIN = -40
export const STATION_X = [-36, 36] as const

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Mountain height at (x, z). Gentle along z = 0 so the cable line stays clear. */
export function terrainHeight(x: number, z: number): number {
  const slope = (x - X_MIN) * 0.32
  const bowl = z * z * 0.012
  const rough = Math.min(1, Math.abs(z) / 8)
  const noise =
    (Math.sin(x * 0.21 + z * 0.13) * 2.2 +
      Math.sin(x * 0.07 - z * 0.31) * 3.1 +
      Math.sin(x * 0.45 + z * 0.4) * 0.7) *
    rough
  let h = slope + bowl + noise

  // Level the ground under each station.
  for (const sx of STATION_X) {
    const platform = (sx - X_MIN) * 0.32
    const w = 1 - smooth(6, 13, Math.hypot(x - sx, z))
    h = h * (1 - w) + platform * w
  }
  return h
}

import { useRideStore } from '../store/useRideStore'

export function Hud() {
  const speed = useRideStore((s) => s.speed)
  const riding = useRideStore((s) => s.riding)
  const setSpeed = useRideStore((s) => s.setSpeed)
  const toggleRide = useRideStore((s) => s.toggleRide)

  return (
    <div className="hud">
      <h1>Cableverse 3D</h1>
      <button onClick={toggleRide}>{riding ? 'Leave cabin' : 'Ride a cabin'}</button>
      <label>
        Speed: {speed.toFixed(1)} m/s
        <input
          type="range" min={0} max={14} step={0.5} value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>
      {!riding && <p>Drag to orbit, scroll to zoom.</p>}
    </div>
  )
}

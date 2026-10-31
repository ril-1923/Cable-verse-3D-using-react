import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { Terrain } from './Terrain'
import { Cableway } from './Cableway'
import { Cabins } from './Cabins'
import { useRideStore } from '../store/useRideStore'

type Controls = React.ComponentRef<typeof OrbitControls>

function CameraRig() {
  const riding = useRideStore((s) => s.riding)
  const camera = useThree((s) => s.camera)
  const controls = useRef<Controls>(null)

  useEffect(() => {
    if (riding) return
    camera.position.set(-10, 28, 62)
    controls.current?.target.set(0, 12, 0)
    controls.current?.update()
  }, [riding, camera])

  return <OrbitControls ref={controls} makeDefault enabled={!riding} maxPolarAngle={Math.PI / 2.05} />
}

export function Scene() {
  return (
    <Canvas camera={{ position: [-10, 28, 62], fov: 55, far: 600 }}>
      <fog attach="fog" args={['#cfe0ee', 90, 320]} />
      <Sky sunPosition={[60, 40, -40]} turbidity={6} />
      <hemisphereLight args={['#dbe9f6', '#5b5a52', 0.7]} />
      <directionalLight position={[40, 60, -20]} intensity={1.6} />
      <Terrain />
      <Cableway />
      <Cabins />
      <CameraRig />
    </Canvas>
  )
}

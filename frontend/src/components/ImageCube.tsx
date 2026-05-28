import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Mesh } from 'three'
import { SRGBColorSpace, TextureLoader } from 'three'

type Props = {
  imagePaths: [string, string, string, string, string, string]
  className?: string
}

function CubeMesh({
  imagePaths,
  isRotating,
}: {
  imagePaths: Props['imagePaths']
  isRotating: boolean
}) {
  const meshRef = useRef<Mesh>(null)
  const textures = useLoader(TextureLoader, imagePaths)

  textures.forEach((texture) => {
    texture.colorSpace = SRGBColorSpace
    texture.needsUpdate = true
  })

  useEffect(() => {
    if (!meshRef.current) return
    // Start with a clean front angle.
    meshRef.current.rotation.x = 0.18
    meshRef.current.rotation.y = 0.35
  }, [])

  const autoRotate = useMemo(() => ({ x: 0.0018, y: 0.0026 }), [])

  useFrame(() => {
    if (!meshRef.current || !isRotating) return
    meshRef.current.rotation.x += autoRotate.x
    meshRef.current.rotation.y += autoRotate.y
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[2.2, 2.2, 2.2]} />
      {textures.map((texture, idx) => (
        <meshStandardMaterial key={idx} attach={`material-${idx}`} map={texture} />
      ))}
    </mesh>
  )
}

export default function ImageCube({ imagePaths, className = '' }: Props) {
  const [isRotating, setIsRotating] = useState(false)

  return (
    <div
      className={className}
      onMouseEnter={() => setIsRotating(true)}
      onMouseLeave={() => setIsRotating(false)}
      onTouchStart={() => setIsRotating(true)}
      onTouchEnd={() => setIsRotating(false)}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 42 }} shadows dpr={[1, 1.5]}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[2.2, 3, 2.5]} intensity={1.2} />
        <pointLight position={[-3, -2, 1]} intensity={0.5} />

        <CubeMesh imagePaths={imagePaths} isRotating={isRotating} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          onStart={() => setIsRotating(true)}
          onEnd={() => setIsRotating(false)}
        />
      </Canvas>
    </div>
  )
}


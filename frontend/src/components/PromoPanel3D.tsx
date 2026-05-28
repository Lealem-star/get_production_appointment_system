import { Html, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { Group } from 'three'

type Props = {
  className?: string
}

function SwayingPanel({ widthPx, heightPx }: { widthPx: number; heightPx: number }) {
  const pivotRef = useRef<Group>(null)
  const aspect = heightPx / Math.max(widthPx, 1)
  const W = 3.55
  const H = W * aspect

  /* Html was full canvas width while the 3D card only covers ~half the view — centered wide div overflowed left. Match text box to projected card width. */
  const htmlW = Math.max(64, Math.round(widthPx * 0.56))
  const safeH = Math.max(heightPx - 16, 48)
  const fit = Math.min(1, htmlW / 150, safeH / 160)
  const vFit = Math.min(1, safeH / 125)
  const fontMain = Math.max(6.5, Math.min(9.5, htmlW * 0.055 * fit * vFit))
  const fontSub = Math.max(6, Math.min(8.5, htmlW * 0.048 * fit * vFit))
  const fontPhone = Math.max(9, Math.min(13, htmlW * 0.078 * fit * vFit))

  const swingSpeed = 0.48
  const maxSwing = Math.PI / 2

  useFrame(({ clock }) => {
    const g = pivotRef.current
    if (!g) return
    g.rotation.y = Math.sin(clock.elapsedTime * swingSpeed) * maxSwing
  })

  return (
    <group position={[W * 0.57, 1.5, 0]}>
      <group ref={pivotRef}>
        <RoundedBox
          args={[W, H, 0.06]}
          radius={0.11}
          smoothness={4}
          position={[-W / 2, 0, 0]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial
            color="#d4a574"
            opacity={0.97}
            transparent
            roughness={0.48}
            metalness={0.12}
          />
        </RoundedBox>
        <Html
          transform
          position={[-W / 2 + W * 0.05, 0, 0.1]}
          distanceFactor={5.5}
          center
          style={{
            width: htmlW,
            maxWidth: htmlW,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            className="box-border max-h-full text-center text-ethio-ink"
            style={{
              width: '100%',
              maxWidth: htmlW,
              maxHeight: safeH,
              marginLeft: 'auto',
              marginRight: 'auto',
              overflow: 'hidden',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              padding: '6px 5px',
            }}
          >
            <p
              className="font-black"
              style={{ fontSize: fontMain, lineHeight: 1.25, margin: 0 }}
            >
              ውድ ደንበኞቻችን ጌት ፎቶ ስቱዲዮ ወደ ፕሮዳክሽን
            </p>
            <p
              className="font-black"
              style={{ fontSize: fontMain, lineHeight: 1.25, margin: '4px 0 0 0' }}
            >
              አድጎ ወደናንተ ለመምጣት ዝግጅቱን አጠናቋል!
            </p>
            <p
              className="font-bold text-ethio-forest/90"
              style={{ fontSize: fontSub, lineHeight: 1.25, margin: '6px 0 0 0' }}
            >
              ለየትኛውም ዝግጅቶቻችሁ እኛ ጋ መደወል ትችላላችሁ
            </p>
            <div
              className="font-black text-ethio-clay"
              style={{ fontSize: fontPhone, lineHeight: 1.1, margin: '6px 0 0 0' }}
            >
              +251932717615
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}

function Scene({ widthPx, heightPx }: { widthPx: number; heightPx: number }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.05} castShadow color="#fff4dd" />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#f4e8d4" />
      <pointLight position={[0, -2, 3]} intensity={0.25} />
      <SwayingPanel widthPx={widthPx} heightPx={heightPx} />
    </>
  )
}

export default function PromoPanel3D({ className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 280, h: 200 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const read = () => setDims({ w: el.clientWidth, h: el.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        shadows
        camera={{ position: [-1.35, 0, 6.35], fov: 34, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Scene widthPx={dims.w} heightPx={dims.h} />
      </Canvas>
    </div>
  )
}

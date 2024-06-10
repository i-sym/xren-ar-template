import { Dragable } from '@/presets/ar/Dragable'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export default function Gripper({ isClamped }: { isClamped: boolean }) {
  isClamped = false
  return (
    <group position={[0, 1.2, 0]}>
      <Dragable position={[0, 0, 0]} enableScaling={false} snapTags={['block']}>
        <group
          position={[0, 0, 0]}
          // rotation={[0, Math.PI / 2, 0]}
          scale={[0.5, 0.5, 0.5]}
          name='gripper'
          userData={{
            role: 'gripper',
          }}
        >
          <mesh receiveShadow castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.01, 32, 32]} />
            <meshStandardMaterial color='white' />
          </mesh>
          <mesh receiveShadow castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.07, 32]} />
            <meshStandardMaterial color='white' />
          </mesh>
          <mesh receiveShadow castShadow position={[0, -0.05 + 0.15, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.03, 32]} />
            <meshStandardMaterial color='grey' />
          </mesh>
          <mesh receiveShadow castShadow position={[0, -0.077 + 0.15, 0]}>
            <boxGeometry args={[0.1, 0.025, 0.04]} />
            <meshStandardMaterial color='white' />
          </mesh>
          <mesh receiveShadow castShadow position={[0, -0.095 + 0.15, 0]}>
            <boxGeometry args={[0.1, 0.01, 0.03]} />
            <meshStandardMaterial color='gray' />
          </mesh>

          {/* if the isGripper is true set position to -0.01 */}
          <mesh receiveShadow castShadow position={isClamped ? [-0.04, -0.11 + 0.15, 0] : [-0.06, -0.11 + 0.15, 0]}>
            <boxGeometry args={[0.025, 0.04, 0.05]} />
            <meshStandardMaterial color='wheat' />
          </mesh>
          <mesh receiveShadow castShadow position={isClamped ? [0.04, -0.11 + 0.15, 0] : [0.06, -0.11 + 0.15, 0]}>
            <boxGeometry args={[0.025, 0.04, 0.05]} />
            <meshStandardMaterial color='wheat' />
          </mesh>
        </group>
      </Dragable>
    </group>
  )
}

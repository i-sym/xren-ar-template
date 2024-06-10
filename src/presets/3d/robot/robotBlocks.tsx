import { robotToThreeJsPosition } from '@/lib/coordinates'
import { Dragable } from '@/presets/ar/Dragable'
import useResources from '@/presets/hooks/useResources'
import { Box } from '@react-three/drei'
import { Vector3 } from 'three'

export function Blocks() {
  console.log('Blocks Rendered')

  const { initialPositions } = useResources()

  return (
    <group>
      {initialPositions.map((pos, index) => (
        // <Draggable key={index} position={[pos.x / 1000, 0, pos.y / 1000]} downState={downState}>
        <group
          key={index}
          position={robotToThreeJsPosition(pos).position}
          quaternion={robotToThreeJsPosition(pos).quaternion}
        >
          <group key={index} rotation={[0, Math.PI / 2, 0]}>
            <Dragable
              key={index}
              snapDiscritization={new Vector3(0.01, 0.04, 0.01)}
              position={[0, 0, 0]}
              enableScaling={false}
            >
              <Box
                args={[0.04, 0.04, 0.08]}
                rotation={[0, 0, 0]}
                userData={{
                  snapTag: 'block',
                }}
              >
                <meshStandardMaterial color='#f5c542' />
              </Box>
            </Dragable>
          </group>
        </group>
      ))}
    </group>
  )
}

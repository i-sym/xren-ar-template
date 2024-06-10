import { useRobot } from '@/presets/hooks/useRobot'
import { Robot } from './robot'
import { Box, Grid, Line, Text } from '@react-three/drei'
import { Blocks } from './robotBlocks'
import usePathPlanning from '@/presets/hooks/usePathPlanning'
import useResources from '@/presets/hooks/useResources'
import { getGripperPosition, robotToThreeJsPosition } from '@/lib/coordinates'
import { GroupProps, useThree } from '@react-three/fiber'
import { Button3D } from '../interractions/button'
import { robotCmd } from '@/lib/robotCommands'

export default function RobotScene() {
  // const { wayPoints, addWayPoint, undo } = usePathPlanning()
  // const { initialPositions } = useResources()

  console.log('RobotScene Rendered')
  const { scene } = useThree()
  return (
    <group>
      <hemisphereLight intensity={0.55} />

      <group position={[-0.47, -0.465 + 0.13, 0]}>
        <Robot variant={'default'} key={2} />
      </group>
    </group>
  )
}

function GrabHereWaypointButton(props: GroupProps) {
  const { addWayPoint } = usePathPlanning()

  const { scene } = useThree()

  return (
    <Button3D
      onClick={() => {
        const gripperPosition = getGripperPosition(scene)
        const positionAbove = { ...gripperPosition, z: gripperPosition.z + 50 }
        addWayPoint(robotCmd.moveToPosition(positionAbove))
        addWayPoint(robotCmd.moveToPosition(gripperPosition))
        addWayPoint(robotCmd.closeGripper())
        addWayPoint(robotCmd.moveToPosition(positionAbove))
      }}
      text='Grab Here'
      position={props.position}
      rotation={props.rotation}
    />
  )
}

function ReleaseHereWaypointButton(props: GroupProps) {
  const { addWayPoint } = usePathPlanning()

  const { scene } = useThree()

  return (
    <Button3D
      onClick={() => {
        const gripperPosition = getGripperPosition(scene)
        const positionAbove = { ...gripperPosition, z: gripperPosition.z + 50 }
        addWayPoint(robotCmd.moveToPosition(positionAbove))
        addWayPoint(robotCmd.moveToPosition(gripperPosition))
        addWayPoint(robotCmd.openGripper())
        addWayPoint(robotCmd.moveToPosition(positionAbove))
      }}
      text='Release Here'
      position={props.position}
      rotation={props.rotation}
    />
  )
}

function ExecutePathButton(props: GroupProps) {
  const { wayPoints } = usePathPlanning()

  function executeWaypoints() {
    const body = {
      metadata: {
        name: 'Sample Recipe',
        version: '1.0',
      },
      commands: wayPoints,
    }
    fetch('http://192.168.0.100:3301/api/v1/recipe/execute', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(() => {})
      .catch((e) => {
        alert(`${JSON.stringify(e)}`)
      })
  }

  return (
    <Button3D
      onClick={() => {
        executeWaypoints()
      }}
      text='Execute'
      position={props.position}
      rotation={props.rotation}
    />
  )
}

export function RobotPath() {
  const { wayPoints } = usePathPlanning()

  return (
    <group>
      {/* {wayPoints.map((point, index) => (
        <group key={index} position={[point.x, point.y, point.z]}>
          <Box args={[0.02, 0.02, 0.02]}>
            <meshStandardMaterial color='#f5c542' />
          </Box>
        </group>
      ))} */}

      {wayPoints.length > 1 && (
        <Line
          points={wayPoints
            .filter((wp) => wp.type == 'moveToPosition')
            .map((wp) => robotToThreeJsPosition(wp.position).position)}
          color={'blue'}
        />
      )}
    </group>
  )
}

function RobotPathTextCard({ text, ...props }: { text: string } & GroupProps) {
  const { wayPoints } = usePathPlanning()
  return (
    <group {...props}>
      <Box args={[0.2, 0.1, 0.02]} position={[0, 0.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color='#f5c542' />
      </Box>
      <Text position={[0, 0.2, 0.01]} fontSize={0.01} color='black'>
        {JSON.stringify(wayPoints, null, 2)}
      </Text>
    </group>
  )
}

export function RobotWorkArea() {
  return (
    <group>
      <Box args={[0.28, 0.13, 0.48]} position={[0, -0.13 / 2 - 0.02, 0]}>
        <meshStandardMaterial color='#0a0a0a' />
        <group position={[0, 0.066, 0]}>
          <Grid args={[0.28, 0.48]} sectionColor={'#171717'} cellSize={0.01} sectionSize={0.1} />
        </group>
      </Box>

      <group position={[0, 0, 0]} name='workAreaOrigin'>
        <Line
          points={[
            [0, 0, 0],
            [0.1, 0, 0],
          ]}
          color={'red'}
        />
        <Line
          points={[
            [0, 0, 0],
            [0, 0.1, 0],
          ]}
          color={'green'}
        />
        <Line
          points={[
            [0, 0, 0],
            [0, 0, 0.1],
          ]}
          color={'blue'}
        />
      </group>
    </group>
  )
}

export function RobotStand() {
  return (
    <group position={[-0.13, 0, 0]}>
      <Box args={[1, 0.7, 1]} position={[0, -0.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color='#171717' />
      </Box>

      <group position={[0, 0, 0]}>
        <Box args={[1, 0.02, 1]} position={[0, -0.14, 0]} castShadow receiveShadow>
          <meshStandardMaterial color='#0a0a0a' />
        </Box>
      </group>
    </group>
  )
}

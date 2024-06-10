import { Atom, atom, PrimitiveAtom, useAtom, WritableAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export type RobotJointStates = {
  joint1: number
  joint2: number
  joint3: number
  joint4: number
  joint5: number
  joint6: number
}

export type RobotPosition = {
  x: number
  y: number
  z: number
  yaw: number
}

export type RobotState = {
  name: string
  grip: 'open' | 'close'
  position: RobotPosition
  joints: RobotJointStates
}

const robotAtom = atom<RobotState>({
  name: 'Robot',
  grip: 'open',
  position: {
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
  },
  joints: {
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0,
    joint5: 0,
    joint6: 0,
  },
})

export function useRobot() {
  console.log('useRobot')
  const [robotState, setRobotState] = useAtom(robotAtom)

  const [socketUrl, setSocketUrl] = useState('ws://192.168.0.100:8080')

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    // Don't use HTTPS
    protocols: 'ws',
  })

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data)
      console.log(`Received message: ${JSON.stringify(data)}`)
      setRobotState((prev) => ({
        ...prev,
        joints: data.jointStates,
      }))
    }

    // fetch('http://192.168.0.100:3301/api/v1/robot', {
    //   mode: 'cors',
    // })
    //   .then((res) => {
    //     console.log(`Fetched robot state: ${res.status}`)
    //     res.json().then((data) => {
    //       console.log(data)
    //     })
    //   })
    //   .catch((e) => {
    //     console.error(`Error fetching robot state: ${JSON.stringify(e)}`)
    //   })
  }, [lastMessage])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  return {
    robotState: robotState,
    robotTargetState: robotState,
    enable: () => {
      console.log('[useRobot] Enable')
    },
    grip: (target: 'open' | 'close') => {
      console.log(`[useRobot] Grip ${target}`)
    },
    moveToJointStates: (joints: RobotJointStates) => {
      console.log(`[useRobot] Move to joint states: ${JSON.stringify(joints)}`)
    },
    moveToPosition: (position: RobotPosition) => {
      console.log(`[useRobot] Move to position: ${JSON.stringify(position)}`)
    },
    moveToHome: () => {
      console.log(`[useRobot] Move to home`)
    },
  }
}

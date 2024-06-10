'use client'
import { XRCanvas, PointerHand, PointerController, Hands, Controllers } from '@coconut-xr/natuerlich/defaults'
import { use, useEffect, useRef, useState } from 'react'
import {
  useEnterXR,
  NonImmersiveCamera,
  ImmersiveSessionOrigin,
  useInputSources,
  useXR,
} from '@coconut-xr/natuerlich/react'
import { isXIntersection } from '@coconut-xr/xinteraction'
import * as THREE from 'three'

import {
  Box,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  QuadraticBezierLine,
  Text,
} from '@react-three/drei'
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import React from 'react'
import { Robot } from '@/presets/3d/robot/robot'
import { useRobot } from '@/presets/hooks/useRobot'
import RobotScene from '@/presets/3d/robot/robotScene'
import Gripper from '@/presets/3d/robot/gripper'
import { Button } from '@/components/ui/button'
import { Button3D } from '@/presets/3d/interractions/button'
import { Dragable } from '@/presets/ar/Dragable'

const sessionOptions: XRSessionInit = {
  requiredFeatures: ['local-floor', 'hand-tracking'],
}

export default function ArPage() {
  const enterAR = useEnterXR('immersive-ar', sessionOptions)
  const inputSources = useInputSources()

  return (
    <div className='h-screen w-full'>
      <button onClick={enterAR} className='left-8 top-8 size-32 rounded-lg border bg-white shadow-lg'>
        Enter AR
      </button>
      <XRCanvas>
        <Environment preset='city' />

        <group position={[0, 1, 0]}>
          <Dragable position={[0, 0, 0]} enableScaling={false}>
            <Box>
              <meshStandardMaterial color='#f5c542' />
            </Box>
          </Dragable>
        </group>

        <NonImmersiveCamera position={[0, 1.5, 4]} />
        <ImmersiveSessionOrigin position={[0, 0, 1]}>
          <Hands type='grab' />
          <Controllers type='grab' />
        </ImmersiveSessionOrigin>
      </XRCanvas>
    </div>
  )
}

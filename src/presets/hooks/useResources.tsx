import { useState } from 'react'
import { RobotPosition } from './useRobot'
import { create } from 'zustand'

export default function useResources() {
  const initialBlockPositions: RobotPosition[] = [
    { x: -90, y: -200, z: 0, yaw: 0 },
    { x: 0, y: -200, z: 0, yaw: 0 },
    { x: 90, y: -200, z: 0, yaw: 0 },
    { x: -90, y: -140, z: 0, yaw: 0 },
    { x: 0, y: -140, z: 0, yaw: 0 },
    { x: 90, y: -140, z: 0, yaw: 0 },
    { x: -90, y: -80, z: 0, yaw: 0 },
    { x: 0, y: -80, z: 0, yaw: 0 },
    { x: 90, y: -80, z: 0, yaw: 0 },
  ]

  return {
    initialPositions: initialBlockPositions,
  }
}

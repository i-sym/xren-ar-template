import { useState } from 'react'
import { RobotPosition } from '../types/robotPosition'
import { atom, useAtom } from 'jotai'
import { Command } from '../types/recipe'

const robotPathAtom = atom<Command[]>([])

export default function usePathPlanning() {
  const [wayPoints, setWayPoints] = useAtom(robotPathAtom)

  const addWayPoint = (wayPoint: Command) => {
    setWayPoints((wayPoints) => [...wayPoints, wayPoint])
  }

  const undo = () => {
    if (wayPoints.length === 0) return
    setWayPoints(wayPoints.slice(0, wayPoints.length - 1))
  }

  return {
    wayPoints,
    addWayPoint,
    undo,
  }
}

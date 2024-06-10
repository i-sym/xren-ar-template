'use client'

import { useState, useEffect } from 'react'
import { LoadingManager, LoaderUtils } from 'three'

import * as THREE from 'three'

import URDFLoader, { URDFRobot, URDFVisual } from 'urdf-loader'
import { XacroLoader } from 'xacro-parser'
import { RobotState, useRobot } from '@/presets/hooks/useRobot'

import WebSocket from 'websocket'

export function Robot({ variant = 'ghost' }: { variant?: 'ghost' | 'default' }) {
  //const twin = state
  const [robotGroup, setRobotGroup] = useState<THREE.Group | null>(null)
  const manager = new LoadingManager()
  const url = '/urdf/gp8.xacro'

  const { robotState: twin } = useRobot()

  const xacroLoader = new XacroLoader()
  const urdfLoader = new URDFLoader(manager)

  useEffect(() => {
    xacroLoader.load(
      url,
      (xml) => {
        const group = new THREE.Group()
        urdfLoader.workingPath = LoaderUtils.extractUrlBase(url)
        const robot = urdfLoader.parse(xml)
        group.add(robot)
        console.log('Robot loaded:', robot)
        setRobotGroup(group)

        manager.onLoad = () => {
          robot.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: '#3730a3',
              })
              child.material.transparent = false
              child.castShadow = true
            }

            if (child.name === 'joint_6-t' && child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: '#0000a3',
              })
              child.material.transparent = false
              child.castShadow = true
            }
          })
          console.log('Material assigned', robot)
        }
      },
      (error) => {
        console.error('Error loading XACRO file:', error)
      },
    )
  }, [url])

  // Effect on twin change
  useEffect(() => {
    if (robotGroup) {
      robotGroup.traverse((child) => {
        if (child.name === 'joint_1_s') {
          child.rotation.z = THREE.MathUtils.degToRad(twin.joints.joint1)
        }
        if (child.name === 'joint_2_l') {
          child.rotation.y = THREE.MathUtils.degToRad(twin.joints.joint2)
        }
        if (child.name === 'joint_3_u') {
          child.rotation.y = -THREE.MathUtils.degToRad(twin.joints.joint3)
        }
        if (child.name === 'joint_4_r') {
          child.rotation.x = -THREE.MathUtils.degToRad(twin.joints.joint4)
        }
        if (child.name === 'joint_5_b') {
          child.rotation.y = -THREE.MathUtils.degToRad(twin.joints.joint5)
        }
        if (child.name === 'joint_6_t') {
          child.rotation.x = -THREE.MathUtils.degToRad(twin.joints.joint6)
        }
        if (child.name === 'joint_6_t-tool0') {
          child.rotation.z = THREE.MathUtils.degToRad(twin.grip == 'open' ? 0 : 90)
        }
      })
    }
  }, [twin, robotGroup])

  return <group rotation={[-Math.PI / 2, 0, 0]}>{robotGroup && <primitive object={robotGroup} />}</group>
}

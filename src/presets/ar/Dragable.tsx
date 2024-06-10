import { isXIntersection } from '@coconut-xr/xinteraction'
import { GroupProps, ThreeEvent, useFrame, createPortal, useThree } from '@react-three/fiber'
import React, { useMemo, useEffect, forwardRef } from 'react'
import { useImperativeHandle } from 'react'
import { Vector3, Quaternion, Object3D, Scene, Mesh, MeshStandardMaterial, SphereGeometry, Euler } from 'three'

const pointOffsetPosition = new Vector3()
const deltaRotation = new Quaternion()

function setupGrabbable(
  attachPoint: Object3D,
  properties: {
    maxGrabbers: number
    onReleased?: (object: Object3D) => void
    onGrabbed?: (object: Object3D) => void
    scene: Scene
    enableScaling: boolean
    snapTags?: string[]
    snapDistance?: number
    snapDiscritization?: Vector3 | null
    robotRotationLimit?: boolean
    discritizationOrigin?: Vector3
  },
) {
  const object = new Object3D()

  const state = {
    intersections: new Map(),
    objectPosition: new Vector3(),
    objectRotation: new Quaternion(),
    objectScale: new Vector3(),
    snapDistance: properties.snapDistance,
  }

  const updateObjectMatrix = () => {
    object.updateWorldMatrix(true, false)
    object.matrixWorld.decompose(state.objectPosition, state.objectRotation, state.objectScale)
  }

  const checkForSnapping = () => {
    if (!properties.snapTags) {
      return
    }
    properties.scene.traverse((other) => {
      if (other.userData && properties.snapTags.includes(other.userData.snapTag)) {
        const distance = object.position.distanceTo(other.position)
        if (distance < state.snapDistance) {
          object.position.copy(other.position)
        }
      }
    })
  }

  return {
    object,
    onUpOrLeave: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      if (state.intersections.delete(e.pointerId)) {
        if (state.intersections.size === 0) {
          // Attach a sphere to the object to show that it is snappable
          //   const sphere = new Mesh(new SphereGeometry(0.1, 32, 32), new MeshStandardMaterial({ color: '#ffffff' }))
          //   object.add(sphere)

          snapToClosestObject(properties.scene, object, state.snapDistance)

          if (properties.snapDiscritization && properties.snapDiscritization.y > 0) {
            snapToDiscretePosition(object, properties.snapDiscritization, properties.discritizationOrigin)
          }

          attachPoint.attach(object)

          properties.onReleased?.(object)
        } else {
          updateObjectMatrix()
        }
      }
    },
    onDown: (e: ThreeEvent<PointerEvent>) => {
      if (!isXIntersection(e)) return
      const currentIntersectionSize = state.intersections.size
      if (currentIntersectionSize >= properties.maxGrabbers) return
      e.stopPropagation()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updateObjectMatrix()
      state.intersections.set(e.pointerId, {
        startPosition: e.point,
        currentPosition: e.point,
        startRotation: e.inputDeviceRotation,
        currentRotation: e.inputDeviceRotation,
      })
      if (state.intersections.size === 1) {
        properties.onGrabbed?.(object)
        properties.scene.add(object)
      }
    },
    onMove: (e: ThreeEvent<PointerEvent>) => {
      if (!isXIntersection(e) || !state.intersections.has(e.pointerId)) return
      const intersection = state.intersections.get(e.pointerId)
      intersection.currentPosition = e.point
      intersection.currentRotation = e.inputDeviceRotation
    },
    onFrame: () => {
      if (!state.intersections.size) return
      const intersection = Array.from(state.intersections.values())[0]
      pointOffsetPosition.copy(state.objectPosition).sub(intersection.startPosition)
      deltaRotation.copy(intersection.startRotation).invert().premultiply(intersection.currentRotation)
      object.position.copy(pointOffsetPosition).applyQuaternion(deltaRotation).add(intersection.currentPosition)

      if (properties.robotRotationLimit) {
        //  Project the rotation onto the Yaw axis
        const deltaEuler = new Euler().setFromQuaternion(deltaRotation, 'YXZ')
        deltaEuler.set(0, deltaEuler.y, 0)

        // Clamp between -90 and 90 degrees
        if (deltaEuler.x > Math.PI / 2) {
          deltaEuler.x = Math.PI / 2
        } else if (deltaEuler.x < -Math.PI / 2) {
          deltaEuler.x = -Math.PI / 2
        }

        deltaRotation.setFromEuler(deltaEuler)
        object.quaternion.copy(deltaRotation).multiply(state.objectRotation)
      } else {
        object.quaternion.copy(deltaRotation).multiply(state.objectRotation)
      }

      if (properties.enableScaling && state.intersections.size === 2) {
        const [i1, i2] = state.intersections.values()
        const initialOffset = i1.startPosition.clone().sub(i2.startPosition)
        const currentOffset = i1.currentPosition.clone().sub(i2.currentPosition)
        const scale = currentOffset.length() / initialOffset.length()
        object.scale.set(scale, scale, scale)
      }
    },
  }
}

function snapToClosestObject(scene: Scene, object: Object3D, snapDistance = 0.05) {
  const snappableObjects: Object3D[] = []

  scene.traverse((obj) => {
    if (obj.userData.snapTag == 'block') {
      // Change material color to show that the object is snappable

      snappableObjects.push(obj)
    }
  })

  // console.log('snappableObjects', snappableObjects)
  // Find the closest snappable object
  let closestObject: Object3D | undefined
  let closestDistance = Infinity

  const distances = []

  for (const obj of snappableObjects) {
    if (obj === object) {
      console.log('skipping self')
      continue
    }

    const worldPosition = new Vector3()
    obj.getWorldPosition(worldPosition)

    const myWorldPosition = new Vector3()
    object.getWorldPosition(myWorldPosition)

    // alert(`World Position: ${JSON.stringify(myWorldPosition)}`)

    const distance = worldPosition.distanceTo(myWorldPosition)
    console.log('distance', distance)

    if (distance < closestDistance && distance < snapDistance) {
      closestDistance = distance
      distances.push(distance)

      closestObject = obj
    }
  }

  // Snap to the closest object
  if (closestObject) {
    // Update object position so that its world position is the same as the closest object
    //object.position.copy(closestObject.position).add(new Vector3(0, 0, 0.1))
    const closetObjectWorldPosition = new Vector3()
    const closestObjectQuaternion = new Quaternion()

    closestObject.getWorldPosition(closetObjectWorldPosition)
    closestObject.getWorldQuaternion(closestObjectQuaternion)

    object.position.copy(closetObjectWorldPosition).add(new Vector3(0, 0, 0))
    object.quaternion.copy(closestObjectQuaternion)
  }
}

function snapToDiscretePosition(object: Object3D, discretization: Vector3, origin: Vector3) {
  const worldPosition = new Vector3()
  object.getWorldPosition(worldPosition)

  const relativePosition = worldPosition.clone().sub(origin)

  let x = Math.round(relativePosition.x / discretization.x) * discretization.x
  let y = Math.round(relativePosition.y / discretization.y) * discretization.y
  let z = Math.round(relativePosition.z / discretization.z) * discretization.z

  // Clamp Y to be not smaller than 0
  if (y < 0) {
    y = 0
  }

  object.position.copy(origin.clone().add(new Vector3(x, y, z)))

  // Snap roatation to 45 degrees
  const euler = new Euler().setFromQuaternion(object.quaternion, 'YXZ')
  euler.x = 0
  euler.y = Math.round(euler.y / (Math.PI / 4)) * (Math.PI / 4)
  euler.z = 0

  object.quaternion.setFromEuler(euler)
}

export const Dragable = forwardRef<
  Object3D,
  {
    onGrabbed?: (object: Object3D) => void
    onReleased?: (object: Object3D) => void
    maxGrabbers?: number
    enableScaling?: boolean
    robotRotationLimit?: boolean
    snapTags?: string[]
    snapDistance?: number
    children?: React.ReactNode
    snapDiscritization?: Vector3 | null
    discritizationOrigin?: Vector3
  } & GroupProps
>(
  (
    {
      children,
      maxGrabbers = 2,
      onGrabbed,
      onReleased,
      enableScaling = true,
      snapTags,
      snapDistance = 0,
      robotRotationLimit = false,
      snapDiscritization = null,
      discritizationOrigin = new Vector3(0, 1.15, 0),
      ...props
    },
    ref,
  ) => {
    const scene = useThree(({ scene }) => scene)
    const properties = useMemo(
      () => ({
        maxGrabbers,
        onReleased,
        onGrabbed,
        scene,
        enableScaling,
        snapTags,
        snapDistance,
        robotRotationLimit,
        snapDiscritization,
        discritizationOrigin,
      }),
      [
        maxGrabbers,
        onReleased,
        onGrabbed,
        scene,
        enableScaling,
        snapTags,
        snapDistance,
        robotRotationLimit,
        snapDiscritization,
        discritizationOrigin,
      ],
    )

    const attachPoint = useMemo(() => new Object3D(), [])
    const { object, onDown, onFrame, onMove, onUpOrLeave } = useMemo(
      () => setupGrabbable(attachPoint, properties),
      [properties],
    )

    useImperativeHandle(ref, () => object, [])
    useFrame(onFrame)

    useEffect(() => {
      attachPoint.add(object)
    }, [attachPoint, object])

    return (
      <>
        <primitive object={attachPoint} />
        {createPortal(
          <group
            onPointerDown={onDown}
            onPointerUp={onUpOrLeave}
            onPointerLeave={onUpOrLeave}
            onPointerMove={onMove}
            {...props}
          >
            {children}
          </group>,
          object,
        )}
      </>
    )
  },
)

Dragable.displayName = 'Dragable'

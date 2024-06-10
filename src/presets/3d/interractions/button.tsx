import { Box, Text } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import { forwardRef, useState, useCallback } from 'react'
import { Object3D } from 'three'

export function Button3D({ children, onClick, text, ...props }: { onClick: () => void; text: string } & GroupProps) {
  const [downState, setDownState] = useState(false)
  const [isClickAllowed, setIsClickAllowed] = useState(true)

  const debouncedClick = useCallback(() => {
    if (isClickAllowed) {
      onClick()
      setIsClickAllowed(false)
      setTimeout(() => {
        setIsClickAllowed(true)
      }, 300) // Adjust the debounce time as needed (milliseconds)
    }
  }, [onClick, isClickAllowed])

  return (
    <group {...props}>
      <group
        onPointerEnter={() => setDownState(true)}
        onPointerLeave={() => {
          setDownState(false)
          debouncedClick()
        }}
      >
        <Box args={[0.2, 0.05, 0.1]} position={downState ? [0, -0.01, 0] : [0, 0, 0]}>
          <meshStandardMaterial color={downState ? 'gray' : 'wheat'} transparent opacity={0.9} />
        </Box>
        <Box args={[0.25, 0.05, 0.15]} position={[0, -0.05, 0]}>
          <meshStandardMaterial color={'dark-gray'} />
        </Box>
        <Text position={[0, -0.01, 0.08]} rotation={[-Math.PI / 3, 0, 0]} fontSize={0.08} color='black'>
          {text}
        </Text>
      </group>
    </group>
  )
}

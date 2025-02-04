/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.3 3iq.glb --types
*/

import * as THREE from 'three'
import React, {useEffect, useRef} from 'react'
import {useGLTF} from '@react-three/drei'

export default function Model(props) {
  const {nodes, materials} = useGLTF('/assets/3iq.glb')

  const group = useRef()

  useEffect(() => {
    const x = new THREE.Vector3(1, 0, 0)
    const y = new THREE.Vector3(0, 1, 0)
    group.current.rotateOnWorldAxis(x, -Math.PI / 20)
    group.current.rotateOnWorldAxis(y, Math.PI / 10)
  }, [])

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, 0, 0]} scale={0.7}>
        <group position={[-6.21, -16.83, 8.49]} scale={0.05}>
          <mesh
            geometry={nodes.bola.geometry}
            position={[268.03, 269.34, -39.2]}
            rotation={[-0.42, -0.94, -0.33]}
          >
            <meshPhysicalMaterial color="#368AD6" roughness={0} metalness={0.05} clearcoat={0.2} />
          </mesh>
          <mesh
            geometry={nodes.traço.geometry}
            position={[196.47, 290.86, 8.63]}
            rotation={[-0.42, -0.94, -0.33]}
          >
            <meshPhysicalMaterial color="#E8E8E8" roughness={0} metalness={0.05} clearcoat={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/assets/3iq.glb')

'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Maze3DProps {
  grid: number[][];
  visited: Array<[number, number]>;
  path: Array<[number, number]>;
  start: [number, number];
  end: [number, number];
}

function MazeGeometry({ grid, visited, path, start, end }: Maze3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Clear previous meshes
    while (groupRef.current.children.length > 0) {
      groupRef.current.children[0].geometry.dispose();
      (groupRef.current.children[0] as any).material.dispose();
      groupRef.current.remove(groupRef.current.children[0]);
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const cellSize = 1;
    const wallHeight = 0.8;

    // Create walls
    const wallGeometry = new THREE.BoxGeometry(cellSize * 0.9, wallHeight, cellSize * 0.9);
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === 1) {
          // Wall
          const wallMaterial = new THREE.MeshStandardMaterial({
            color: '#1a1f2e',
            roughness: 0.7,
            metalness: 0.3,
          });
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(j * cellSize - cols / 2, wallHeight / 2, i * cellSize - rows / 2);
          groupRef.current.add(wall);
        }
      }
    }

    // Create visited nodes
    const visitedGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const visitedMaterial = new THREE.MeshStandardMaterial({
      color: '#00e4ff',
      emissive: '#00a8cc',
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });

    visited.forEach(([row, col]) => {
      if (row !== start[0] || col !== start[1]) {
        if (row !== end[0] || col !== end[1]) {
          const sphere = new THREE.Mesh(visitedGeometry, visitedMaterial.clone());
          sphere.position.set(col * cellSize - cols / 2, 0.3, row * cellSize - rows / 2);
          sphere.scale.set(0.6, 0.6, 0.6);
          groupRef.current?.add(sphere);
        }
      }
    });

    // Create path nodes
    const pathGeometry = new THREE.SphereGeometry(0.35, 16, 16);
    const pathMaterial = new THREE.MeshStandardMaterial({
      color: '#39ff14',
      emissive: '#22dd00',
      emissiveIntensity: 0.7,
      roughness: 0.2,
    });

    path.forEach(([row, col]) => {
      const sphere = new THREE.Mesh(pathGeometry, pathMaterial.clone());
      sphere.position.set(col * cellSize - cols / 2, 0.4, row * cellSize - rows / 2);
      sphere.scale.set(0.8, 0.8, 0.8);
      groupRef.current?.add(sphere);
    });

    // Create start node
    const startGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const startMaterial = new THREE.MeshStandardMaterial({
      color: '#ff6600',
      emissive: '#ff8833',
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const startSphere = new THREE.Mesh(startGeometry, startMaterial);
    startSphere.position.set(start[1] * cellSize - cols / 2, 0.5, start[0] * cellSize - rows / 2);
    groupRef.current.add(startSphere);

    // Create end node
    const endGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const endMaterial = new THREE.MeshStandardMaterial({
      color: '#ff0055',
      emissive: '#ff1177',
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const endSphere = new THREE.Mesh(endGeometry, endMaterial);
    endSphere.position.set(end[1] * cellSize - cols / 2, 0.5, end[0] * cellSize - rows / 2);
    groupRef.current.add(endSphere);

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(cols * cellSize * 1.2, rows * cellSize * 1.2);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#0b0f1a',
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    groupRef.current.add(floor);

  }, [grid, visited, path, start, end]);

  return <group ref={groupRef} />;
}

export function Maze3D({ grid, visited, path, start, end }: Maze3DProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-cyan-500 border-opacity-30">
      <Canvas>
        <PerspectiveCamera makeDefault position={[grid[0].length / 2, 15, grid.length / 2]} />
        <OrbitControls minDistance={5} maxDistance={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[grid[0].length / 2, 20, grid.length / 2]} intensity={1.5} />
        <pointLight position={[-grid[0].length / 2, 15, -grid.length / 2]} intensity={0.8} color="#00e4ff" />
        
        {/* Grid background */}
        <MazeGeometry grid={grid} visited={visited} path={path} start={start} end={end} />
      </Canvas>
    </div>
  );
}

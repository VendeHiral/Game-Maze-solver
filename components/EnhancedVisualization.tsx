'use client';

import React, { useEffect, useRef } from 'react';

interface EnhancedVisualizationProps {
  visited: Array<[number, number]>;
  path: Array<[number, number]>;
  start: [number, number];
  end: [number, number];
  algorithm?: 'BFS' | 'DFS';
}

export function EnhancedVisualization({
  visited,
  path,
  start,
  end,
  algorithm,
}: EnhancedVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0b0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;

    // Draw algorithm info
    ctx.fillStyle = algorithm === 'BFS' ? '#00e4ff' : '#ff6600';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(algorithm || 'Algorithm', centerX, 40);

    // Draw stats
    ctx.fillStyle = '#00e4ff';
    ctx.font = '14px monospace';
    ctx.fillText(`Visited: ${visited.length}`, centerX, 80);
    ctx.fillText(`Path Length: ${path.length}`, centerX, 110);

    // Draw circular visualization
    ctx.strokeStyle = algorithm === 'BFS' ? 'rgba(0, 228, 255, 0.3)' : 'rgba(255, 102, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw visited nodes as circle
    const visitedAngle = (Math.PI * 2) / Math.max(visited.length, 1);
    visited.forEach((_, index) => {
      const angle = visitedAngle * index;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.fillStyle = algorithm === 'BFS' ? '#00e4ff' : '#ff6600';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw path nodes
    const pathAngle = (Math.PI * 2) / Math.max(path.length, 1);
    path.forEach((_, index) => {
      const angle = pathAngle * index;
      const x = centerX + Math.cos(angle) * (radius * 0.6);
      const y = centerY + Math.sin(angle) * (radius * 0.6);

      ctx.fillStyle = '#39ff14';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [visited, path, algorithm]);

  return (
    <div
      style={{
        background: '#1a1f2e',
        borderRadius: '8px',
        border: '1px solid rgba(0, 228, 255, 0.2)',
        padding: '20px',
        marginTop: '20px',
      }}
    >
      <h3 style={{ color: '#00e4ff', marginBottom: '15px', fontSize: '14px', textTransform: 'uppercase' }}>
        Algorithm Visualization
      </h3>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '300px',
          background: '#0b0f1a',
          borderRadius: '6px',
        }}
      />
    </div>
  );
}

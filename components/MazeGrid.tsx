'use client';

import React, { useState, useCallback } from 'react';
import '../app/maze.css';

interface Position {
  row: number;
  col: number;
}

interface MazeGridProps {
  size: number;
  grid: boolean[][];
  onGridChange: (newGrid: boolean[][]) => void;
  start: Position;
  end: Position;
  onStartChange: (pos: Position) => void;
  onEndChange: (pos: Position) => void;
  visitedCells?: { row: number; col: number }[];
  pathCells?: { row: number; col: number }[];
  algorithmType?: 'BFS' | 'DFS' | null;
  isRunning?: boolean;
}

export function MazeGrid({
  size,
  grid,
  onGridChange,
  start,
  end,
  onStartChange,
  onEndChange,
  visitedCells = [],
  pathCells = [],
  algorithmType,
  isRunning = false,
}: MazeGridProps) {
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isRunning || dragging) return;

      // Check if clicking on start position
      if (start.row === row && start.col === col) {
        setDragging('start');
        return;
      }

      // Check if clicking on end position
      if (end.row === row && end.col === col) {
        setDragging('end');
        return;
      }

      // Toggle wall
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = !newGrid[row][col];
      onGridChange(newGrid);
    },
    [grid, start, end, onGridChange, isRunning, dragging]
  );

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (start.row === row && start.col === col) {
        setDragging('start');
      } else if (end.row === row && end.col === col) {
        setDragging('end');
      }
    },
    [start, end]
  );

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!dragging) return;

      if (grid[row][col]) return; // Can't place on walls

      if (dragging === 'start') {
        onStartChange({ row, col });
      } else if (dragging === 'end') {
        onEndChange({ row, col });
      }
    },
    [dragging, grid, onStartChange, onEndChange]
  );

  const getCellClass = (row: number, col: number) => {
    let className = 'grid-cell';

    if (start.row === row && start.col === col) {
      className += ' start';
    } else if (end.row === row && end.col === col) {
      className += ' end';
    } else if (grid[row][col]) {
      className += ' wall';
    } else if (pathCells.some((c) => c.row === row && c.col === col)) {
      className += ' path';
    } else if (visitedCells.some((c) => c.row === row && c.col === col)) {
      className += algorithmType === 'BFS' ? ' visited-bfs' : ' visited-dfs';
    }

    return className;
  };

  return (
    <div
      className="maze-grid"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
      onMouseLeave={handleMouseUp}
    >
      {grid.map((row, rowIndex) =>
        row.map((isWall, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getCellClass(rowIndex, colIndex)}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            onMouseUp={handleMouseUp}
          />
        ))
      )}
    </div>
  );
}

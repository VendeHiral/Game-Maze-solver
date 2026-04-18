'use client';

import React, { useEffect, useState } from 'react';

interface Position {
  row: number;
  col: number;
}

interface GameScreenProps {
  grid: boolean[][];
  start: Position;
  end: Position;
  difficulty: 'easy' | 'medium' | 'hard';
  onGameEnd: (success: boolean, userPath: Position[]) => void;
}

const GRID_SIZE_MAP = { easy: 12, medium: 16, hard: 20 };

export function GameScreen({ grid, start, end, difficulty, onGameEnd }: GameScreenProps) {
  const [userPath, setUserPath] = useState<Position[]>([start]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [completed, setCompleted] = useState(false);

  const gridSize = GRID_SIZE_MAP[difficulty];

  // Timer logic
  useEffect(() => {
    if (completed || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onGameEnd(false, userPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [completed, timeLeft, userPath, onGameEnd]);

  // Check if user reached the end
  useEffect(() => {
    if (userPath.length > 0) {
      const lastPos = userPath[userPath.length - 1];
      if (lastPos.row === end.row && lastPos.col === end.col) {
        setCompleted(true);
        onGameEnd(true, userPath);
      }
    }
  }, [userPath, end, onGameEnd]);

  const handleCellClick = (row: number, col: number) => {
    if (completed) return;

    const isWall = grid[row][col];
    if (isWall) return;

    const lastPos = userPath[userPath.length - 1];
    const distance = Math.abs(row - lastPos.row) + Math.abs(col - lastPos.col);

    // Only allow clicking adjacent cells
    if (distance !== 1) return;

    // Prevent going back to previous cell
    if (userPath.length > 1) {
      const prevPos = userPath[userPath.length - 2];
      if (prevPos.row === row && prevPos.col === col) return;
    }

    setUserPath([...userPath, { row, col }]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 30) return 'danger';
    if (timeLeft <= 60) return 'warning';
    return 'normal';
  };

  return (
    <div className="game-screen">
      <div className="game-content">
        {/* Info Bar */}
        <div className="game-info-bar">
          <div className="game-title">🌿 Jungle Maze Challenge</div>
          <div className={`timer ${getTimerClass()}`}>
            <span>⏱️</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="difficulty-badge">{difficulty.toUpperCase()}</div>
        </div>

        {/* Maze Grid */}
        <div className="maze-container">
          <div
            className="maze-grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 30px)`,
              gap: '2px',
            }}
          >
            {grid.map((row, rowIdx) =>
              row.map((isWall, colIdx) => {
                const isStart = rowIdx === start.row && colIdx === start.col;
                const isEnd = rowIdx === end.row && colIdx === end.col;
                const isUserPath = userPath.some((p) => p.row === rowIdx && p.col === colIdx);

                let cellClass = 'maze-cell';
                if (isWall) cellClass += ' wall';
                else if (isStart) cellClass += ' start';
                else if (isEnd) cellClass += ' end';
                else if (isUserPath) cellClass += ' user-path';
                else cellClass += ' empty';

                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={cellClass}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    style={{
                      cursor: isWall ? 'not-allowed' : 'pointer',
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem', marginTop: '20px' }}>
          <p>Moves: {userPath.length - 1} | Path Length: {userPath.length}</p>
        </div>
      </div>
    </div>
  );
}

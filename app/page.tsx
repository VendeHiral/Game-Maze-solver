'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { StartScreen } from '@/components/StartScreen';
import { GameScreen } from '@/components/GameScreen';
import { ResultScreen } from '@/components/ResultScreen';
import './maze.css';

interface Position {
  row: number;
  col: number;
}

interface AlgorithmResult {
  visited: Position[];
  path: Position[];
}

type GameState = 'start' | 'playing' | 'result';

const GRID_SIZES = { easy: 12, medium: 16, hard: 20 };

export default function MazeSolverGame() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [start, setStart] = useState<Position>({ row: 1, col: 1 });
  const [end, setEnd] = useState<Position>({ row: 1, col: 1 });
  const [userPath, setUserPath] = useState<Position[]>([]);
  const [bfsResult, setBfsResult] = useState<AlgorithmResult>({ visited: [], path: [] });
  const [dfsResult, setDfsResult] = useState<AlgorithmResult>({ visited: [], path: [] });
  const [gameSuccess, setGameSuccess] = useState(false);

  // Generate maze
  const generateMaze = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    const size = GRID_SIZES[diff];
    const newGrid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false));

    // Generate random walls (recursive backtracking-inspired)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Create walls with probability based on difficulty
        const wallProbability = diff === 'easy' ? 0.3 : diff === 'medium' ? 0.4 : 0.5;
        if (Math.random() < wallProbability) {
          newGrid[i][j] = true;
        }
      }
    }

    // Ensure start and end are not walls
    newGrid[1][1] = false;
    newGrid[size - 2][size - 2] = false;

    // Create a guaranteed path from start to end using simple pathfinding
    let current = { row: 1, col: 1 };
    while (current.row !== size - 2 || current.col !== size - 2) {
      newGrid[current.row][current.col] = false;
      if (current.row < size - 2 && Math.random() > 0.3) {
        current.row++;
      } else if (current.col < size - 2) {
        current.col++;
      }
    }

    setGrid(newGrid);
    setStart({ row: 1, col: 1 });
    setEnd({ row: size - 2, col: size - 2 });
  }, []);

  // Fetch algorithm results
  const fetchAlgorithmResults = useCallback(async (mazeGrid: boolean[][], startPos: Position, endPos: Position) => {
    try {
      // Convert grid to correct format
      const gridData = mazeGrid.map((row) => row.map((isWall) => (isWall ? 1 : 0)));

      // Get BFS result
      const bfsRes = await fetch('/api/run-bfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid: gridData, start: startPos, end: endPos }),
      });
      const bfsData = await bfsRes.json();

      // Get DFS result
      const dfsRes = await fetch('/api/run-dfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid: gridData, start: startPos, end: endPos }),
      });
      const dfsData = await dfsRes.json();

      setBfsResult({
        visited: bfsData.visited || [],
        path: bfsData.path || [],
      });
      setDfsResult({
        visited: dfsData.visited || [],
        path: dfsData.path || [],
      });
    } catch (error) {
      console.error('Error fetching algorithm results:', error);
    }
  }, []);

  // Handle game start
  const handleGameStart = useCallback((selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    generateMaze(selectedDifficulty);
    setGameState('playing');
    setUserPath([]);
  }, [generateMaze]);

  // Handle game end
  const handleGameEnd = useCallback(
    async (success: boolean, finalUserPath: Position[]) => {
      setGameSuccess(success);
      setUserPath(finalUserPath);

      // Fetch algorithm results
      if (grid.length > 0) {
        await fetchAlgorithmResults(grid, start, end);
      }

      setGameState('result');
    },
    [grid, start, end, fetchAlgorithmResults]
  );

  // Handle retry
  const handleRetry = useCallback(() => {
    generateMaze(difficulty);
    setGameState('playing');
    setUserPath([]);
  }, [difficulty, generateMaze]);

  // Handle home
  const handleHome = useCallback(() => {
    setGameState('start');
    setUserPath([]);
    setGrid([]);
  }, []);

  return (
    <div>
      {gameState === 'start' && <StartScreen onStart={handleGameStart} />}

      {gameState === 'playing' && grid.length > 0 && (
        <GameScreen
          grid={grid}
          start={start}
          end={end}
          difficulty={difficulty}
          onGameEnd={handleGameEnd}
        />
      )}

      {gameState === 'result' && (
        <ResultScreen
          success={gameSuccess}
          userPath={userPath}
          bfsResult={bfsResult}
          dfsResult={dfsResult}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
    </div>
  );
}

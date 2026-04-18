'use client';

import React from 'react';
import '../app/maze.css';

interface ControlPanelProps {
  onRunBFS: () => void;
  onRunDFS: () => void;
  onGenerateMaze: () => void;
  onClear: () => void;
  isRunning: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function ControlPanel({
  onRunBFS,
  onRunDFS,
  onGenerateMaze,
  onClear,
  isRunning,
  speed,
  onSpeedChange,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="control-group">
        <button
          className="btn btn-bfs"
          onClick={onRunBFS}
          disabled={isRunning}
          title="Run BFS algorithm"
        >
          Run BFS
        </button>
        <button
          className="btn btn-dfs"
          onClick={onRunDFS}
          disabled={isRunning}
          title="Run DFS algorithm"
        >
          Run DFS
        </button>
        <button
          className="btn btn-generate"
          onClick={onGenerateMaze}
          disabled={isRunning}
          title="Generate random maze"
        >
          Generate Maze
        </button>
        <button
          className="btn btn-clear"
          onClick={onClear}
          disabled={isRunning}
          title="Clear visited cells and paths"
        >
          Clear Grid
        </button>
      </div>

      <div className="control-group">
        <div className="slider-container">
          <label className="slider-label">Speed:</label>
          <input
            type="range"
            min="10"
            max="200"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            disabled={isRunning}
            title="Animation speed (higher = faster)"
          />
          <span className="speed-value">{speed}ms</span>
        </div>
      </div>
    </div>
  );
}

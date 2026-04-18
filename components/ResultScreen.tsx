'use client';

import React, { useEffect, useState } from 'react';

interface Position {
  row: number;
  col: number;
}

interface AlgorithmResult {
  visited: Position[];
  path: Position[];
}

interface ResultScreenProps {
  success: boolean;
  userPath: Position[];
  bfsResult: AlgorithmResult;
  dfsResult: AlgorithmResult;
  onRetry: () => void;
  onHome: () => void;
}

const ALGORITHM_DESCRIPTIONS = {
  bfs: {
    name: 'Breadth-First Search (BFS)',
    description: 'BFS explores the maze level by level, checking all neighbors at the current distance before moving further away. It guarantees the shortest path!',
    strategy: 'Layer by layer approach',
    pros: ['Finds shortest path', 'Complete exploration', 'Wave-like pattern'],
  },
  dfs: {
    name: 'Depth-First Search (DFS)',
    description: 'DFS goes deep into the maze, following one path as far as possible before backtracking. It may not find the shortest path but is memory efficient.',
    strategy: 'Deep exploration with backtracking',
    pros: ['Memory efficient', 'Good for deep mazes', 'Fast backtracking'],
  },
};

export function ResultScreen({
  success,
  userPath,
  bfsResult,
  dfsResult,
  onRetry,
  onHome,
}: ResultScreenProps) {
  const [showViz, setShowViz] = useState({ bfs: false, dfs: false });

  useEffect(() => {
    // Auto-show visualizations after a delay
    const timer1 = setTimeout(() => setShowViz((prev) => ({ ...prev, bfs: true })), 500);
    const timer2 = setTimeout(() => setShowViz((prev) => ({ ...prev, dfs: true })), 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const userPathLength = userPath.length;
  const userMoves = userPathLength - 1;
  const efficiency = {
    bfs: ((bfsResult.path.length / userPathLength) * 100).toFixed(1),
    dfs: ((dfsResult.path.length / userPathLength) * 100).toFixed(1),
  };

  return (
    <div className="result-screen">
      <div className="result-container">
        {/* Header */}
        <div className="result-header">
          <div
            className={`result-status ${success ? 'success' : 'timeout'}`}
            style={{
              animation: success ? 'pulse 1s ease-in-out' : 'pulse 0.6s ease-in-out',
            }}
          >
            {success ? '🎉 YOU WON! 🎉' : '⏰ TIME\'S UP! ⏰'}
          </div>
          <div className="result-message">
            {success
              ? `You completed the maze in ${userMoves} moves!`
              : 'You didn\'t make it in time. Let\'s see how the algorithms would have solved it.'}
          </div>
        </div>

        {/* Your Performance */}
        {success && (
          <div
            style={{
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'var(--glow-green)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>
              Your Path: {userPathLength} cells | {userMoves} moves
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              Compare your solution with optimal algorithms below!
            </p>
          </div>
        )}

        {/* Algorithm Comparison */}
        <div className="algorithms-comparison">
          {/* BFS Panel */}
          <div className="algorithm-panel bfs">
            <div className="algorithm-name">🔵 BFS</div>

            <div className="algorithm-stat">
              <div className="stat-label">Nodes Visited</div>
              <div className="stat-value">{bfsResult.visited.length}</div>
            </div>

            <div className="algorithm-stat">
              <div className="stat-label">Path Length (Cells)</div>
              <div className="stat-value">{bfsResult.path.length}</div>
            </div>

            <div className="algorithm-stat">
              <div className="stat-label">Shortest Path?</div>
              <div className="stat-value">✓ YES</div>
            </div>

            {success && (
              <div className="algorithm-stat">
                <div className="stat-label">Your Efficiency</div>
                <div className="stat-value">{efficiency.bfs}%</div>
              </div>
            )}

            <div className="algorithm-explanation">
              <strong>How BFS Works:</strong><br />
              {ALGORITHM_DESCRIPTIONS.bfs.description}
              <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                <strong>Strategy:</strong> {ALGORITHM_DESCRIPTIONS.bfs.strategy}
              </div>
            </div>

            {showViz.bfs && (
              <div className="algorithm-visualization">
                {bfsResult.visited.slice(0, 50).map((pos, idx) => (
                  <div
                    key={idx}
                    className="viz-cell visited"
                    style={{ animationDelay: `${idx * 0.02}s` }}
                  />
                ))}
                {bfsResult.path.slice(0, 10).map((pos, idx) => (
                  <div
                    key={`path-${idx}`}
                    className="viz-cell path"
                    style={{ animationDelay: `${0.5 + idx * 0.05}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* DFS Panel */}
          <div className="algorithm-panel dfs">
            <div className="algorithm-name">🔴 DFS</div>

            <div className="algorithm-stat">
              <div className="stat-label">Nodes Visited</div>
              <div className="stat-value">{dfsResult.visited.length}</div>
            </div>

            <div className="algorithm-stat">
              <div className="stat-label">Path Length (Cells)</div>
              <div className="stat-value">{dfsResult.path.length}</div>
            </div>

            <div className="algorithm-stat">
              <div className="stat-label">Shortest Path?</div>
              <div className="stat-value">{dfsResult.path.length === bfsResult.path.length ? '✓ YES' : '✗ NO'}</div>
            </div>

            {success && (
              <div className="algorithm-stat">
                <div className="stat-label">Your Efficiency</div>
                <div className="stat-value">{efficiency.dfs}%</div>
              </div>
            )}

            <div className="algorithm-explanation">
              <strong>How DFS Works:</strong><br />
              {ALGORITHM_DESCRIPTIONS.dfs.description}
              <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                <strong>Strategy:</strong> {ALGORITHM_DESCRIPTIONS.dfs.strategy}
              </div>
            </div>

            {showViz.dfs && (
              <div className="algorithm-visualization">
                {dfsResult.visited.slice(0, 50).map((pos, idx) => (
                  <div
                    key={idx}
                    className="viz-cell visited"
                    style={{ animationDelay: `${idx * 0.02}s` }}
                  />
                ))}
                {dfsResult.path.slice(0, 10).map((pos, idx) => (
                  <div
                    key={`path-${idx}`}
                    className="viz-cell path"
                    style={{ animationDelay: `${0.5 + idx * 0.05}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Summary */}
        <div
          style={{
            background: 'rgba(0, 229, 255, 0.05)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '30px',
          }}
        >
          <h3 style={{ color: 'var(--glow-cyan)', marginBottom: '15px' }}>Algorithm Comparison</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '5px' }}>BFS Visited</p>
              <p style={{ color: 'var(--visited-bfs)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                {bfsResult.visited.length} nodes
              </p>
            </div>
            <div>
              <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '5px' }}>DFS Visited</p>
              <p style={{ color: 'var(--visited-dfs)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                {dfsResult.visited.length} nodes
              </p>
            </div>
          </div>
          <p style={{ marginTop: '15px', color: '#999', fontSize: '0.9rem', lineHeight: '1.6' }}>
            BFS is guaranteed to find the shortest path (explores level-by-level), while DFS might find longer paths but is more memory-efficient.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn retry-btn" onClick={onRetry}>
            Try Again →
          </button>
          <button className="action-btn home-btn" onClick={onHome}>
            ← Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { EnhancedVisualization } from './EnhancedVisualization';
import '../app/maze.css';

interface RunStats {
  nodesVisited: number;
  pathLength: number;
  timeTaken: number;
}

interface StatsProps {
  currentRun?: RunStats;
  algorithm?: 'BFS' | 'DFS';
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Statistics({ currentRun, algorithm }: StatsProps) {
  const { data: statsData, error } = useSWR('/api/get-stats', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
  });

  const [displayedRun, setDisplayedRun] = useState<RunStats | undefined>(
    currentRun
  );

  useEffect(() => {
    if (currentRun) {
      setDisplayedRun(currentRun);
    }
  }, [currentRun]);

  if (error) {
    console.error('Error fetching stats:', error);
  }

  const bfsStats = statsData?.bfsStats || {
    count: 0,
    avgNodesVisited: 0,
    avgPathLength: 0,
    avgTime: 0,
  };

  const dfsStats = statsData?.dfsStats || {
    count: 0,
    avgNodesVisited: 0,
    avgPathLength: 0,
    avgTime: 0,
  };

  return (
    <div className="stats-container">
      {displayedRun && algorithm && (
        <>
          <div className={`stat-card ${algorithm === 'BFS' ? 'bfs' : 'dfs'}`}>
            <div className="stat-label">Nodes Visited</div>
            <div className="stat-value">{displayedRun.nodesVisited}</div>
          </div>
          <div className={`stat-card ${algorithm === 'BFS' ? 'bfs' : 'dfs'}`}>
            <div className="stat-label">Path Length</div>
            <div className="stat-value">{displayedRun.pathLength}</div>
          </div>
          <div className={`stat-card ${algorithm === 'BFS' ? 'bfs' : 'dfs'}`}>
            <div className="stat-label">Time Taken</div>
            <div className="stat-value">{displayedRun.timeTaken}ms</div>
          </div>
        </>
      )}

      {statsData && statsData.totalRuns > 0 && (
        <>
          <div className="stat-card bfs">
            <div className="stat-label">BFS Avg Nodes</div>
            <div className="stat-value">{bfsStats.avgNodesVisited}</div>
          </div>
          <div className="stat-card dfs">
            <div className="stat-label">DFS Avg Nodes</div>
            <div className="stat-value">{dfsStats.avgNodesVisited}</div>
          </div>
        </>
      )}

      {!displayedRun && (
        <div className="stat-card">
          <div className="stat-label">Ready to Solve</div>
          <div className="stat-value">--</div>
        </div>
      )}
    </div>
  );
}

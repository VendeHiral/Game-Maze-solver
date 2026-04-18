import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Run } from '@/lib/models/Run';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const stats = await Run.find({}).limit(100).sort({ createdAt: -1 });

    const bfsRuns = stats.filter((run: any) => run.algorithm === 'BFS');
    const dfsRuns = stats.filter((run: any) => run.algorithm === 'DFS');

    const calculateAverage = (runs: any[], field: string) => {
      if (runs.length === 0) return 0;
      const sum = runs.reduce((acc: number, run: any) => acc + run[field], 0);
      return Math.round(sum / runs.length);
    };

    return NextResponse.json({
      success: true,
      totalRuns: stats.length,
      bfsStats: {
        count: bfsRuns.length,
        avgNodesVisited: calculateAverage(bfsRuns, 'nodesVisited'),
        avgPathLength: calculateAverage(bfsRuns, 'pathLength'),
        avgTime: calculateAverage(bfsRuns, 'timeTaken'),
      },
      dfsStats: {
        count: dfsRuns.length,
        avgNodesVisited: calculateAverage(dfsRuns, 'nodesVisited'),
        avgPathLength: calculateAverage(dfsRuns, 'pathLength'),
        avgTime: calculateAverage(dfsRuns, 'timeTaken'),
      },
      recentRuns: stats.slice(0, 10),
    });
  } catch (error) {
    console.error('Stats retrieval error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve statistics',
        totalRuns: 0,
        bfsStats: { count: 0, avgNodesVisited: 0, avgPathLength: 0, avgTime: 0 },
        dfsStats: { count: 0, avgNodesVisited: 0, avgPathLength: 0, avgTime: 0 },
        recentRuns: [],
      },
      { status: 200 }
    );
  }
}

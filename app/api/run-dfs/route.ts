import { NextRequest, NextResponse } from 'next/server';
import { dfs } from '@/lib/algorithms/dfs';
import { connectToDatabase } from '@/lib/mongodb';
import { Run } from '@/lib/models/Run';

export async function POST(request: NextRequest) {
  try {
    const { grid, start, end } = await request.json();

    if (!grid || !start || !end) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const result = dfs(grid, start, end);
    const timeTaken = Date.now() - startTime;

    // Save run statistics to MongoDB
    try {
      await connectToDatabase();
      await Run.create({
        algorithm: 'DFS',
        gridSize: grid.length,
        nodesVisited: result.visited.length,
        pathLength: result.path.length,
        timeTaken,
        mazeComplexity: grid.flat().filter((cell: boolean) => cell).length,
      });
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Don't fail the request if DB save fails
    }

    return NextResponse.json({
      success: true,
      visited: result.visited,
      path: result.path,
      found: result.found,
      stats: {
        nodesVisited: result.visited.length,
        pathLength: result.path.length,
        timeTaken,
      },
    });
  } catch (error) {
    console.error('DFS execution error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run DFS' },
      { status: 500 }
    );
  }
}

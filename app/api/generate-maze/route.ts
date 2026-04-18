import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { size = 20 } = await request.json();

    // Generate a random maze using recursive backtracking
    const grid: boolean[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(true)); // true = wall

    // Recursive backtracking to create maze
    function carvePassages(row: number, col: number) {
      grid[row][col] = false; // Mark as path

      const directions = [
        { row: -2, col: 0 },
        { row: 2, col: 0 },
        { row: 0, col: -2 },
        { row: 0, col: 2 },
      ];

      // Shuffle directions for randomness
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }

      for (const dir of directions) {
        const nextRow = row + dir.row;
        const nextCol = col + dir.col;

        if (
          nextRow > 0 &&
          nextRow < size &&
          nextCol > 0 &&
          nextCol < size &&
          grid[nextRow][nextCol]
        ) {
          // Carve path between cells
          grid[row + dir.row / 2][col + dir.col / 2] = false;
          carvePassages(nextRow, nextCol);
        }
      }
    }

    // Start maze generation from top-left
    carvePassages(1, 1);

    // Ensure start and end are open
    grid[1][1] = false;
    grid[size - 2][size - 2] = false;

    // Count walls for complexity metric
    const wallCount = grid.flat().filter((cell) => cell).length;
    const complexity = Math.round((wallCount / (size * size)) * 100);

    return NextResponse.json({
      success: true,
      grid,
      complexity,
    });
  } catch (error) {
    console.error('Maze generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate maze' },
      { status: 500 }
    );
  }
}

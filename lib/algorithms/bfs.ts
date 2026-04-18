export interface GridCell {
  row: number;
  col: number;
}

export interface BFSResult {
  visited: GridCell[];
  path: GridCell[];
  found: boolean;
}

export function bfs(
  grid: boolean[][],
  start: GridCell,
  end: GridCell
): BFSResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: GridCell[] = [];
  const queue: GridCell[] = [start];
  const parent: Map<string, GridCell | null> = new Map();
  const visitedSet: Set<string> = new Set();

  const key = (cell: GridCell) => `${cell.row},${cell.col}`;
  parent.set(key(start), null);
  visitedSet.add(key(start));

  const directions = [
    { row: 0, col: 1 },   // right
    { row: 1, col: 0 },   // down
    { row: 0, col: -1 },  // left
    { row: -1, col: 0 },  // up
  ];

  let found = false;

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    if (current.row === end.row && current.col === end.col) {
      found = true;
      break;
    }

    for (const dir of directions) {
      const nextRow = current.row + dir.row;
      const nextCol = current.col + dir.col;

      if (
        nextRow >= 0 &&
        nextRow < rows &&
        nextCol >= 0 &&
        nextCol < cols &&
        !grid[nextRow][nextCol] &&
        !visitedSet.has(`${nextRow},${nextCol}`)
      ) {
        const nextCell = { row: nextRow, col: nextCol };
        visitedSet.add(key(nextCell));
        parent.set(key(nextCell), current);
        queue.push(nextCell);
      }
    }
  }

  // Reconstruct path
  const path: GridCell[] = [];
  if (found) {
    let current: GridCell | null = end;
    while (current !== null) {
      path.unshift(current);
      current = parent.get(key(current)) || null;
    }
  }

  return { visited, path, found };
}

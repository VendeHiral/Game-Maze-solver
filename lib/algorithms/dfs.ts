export interface GridCell {
  row: number;
  col: number;
}

export interface DFSResult {
  visited: GridCell[];
  path: GridCell[];
  found: boolean;
}

export function dfs(
  grid: boolean[][],
  start: GridCell,
  end: GridCell
): DFSResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: GridCell[] = [];
  const visitedSet: Set<string> = new Set();
  const parent: Map<string, GridCell | null> = new Map();
  let found = false;

  const key = (cell: GridCell) => `${cell.row},${cell.col}`;

  const directions = [
    { row: 0, col: 1 },   // right
    { row: 1, col: 0 },   // down
    { row: 0, col: -1 },  // left
    { row: -1, col: 0 },  // up
  ];

  function dfsHelper(current: GridCell): boolean {
    const cellKey = key(current);

    if (visitedSet.has(cellKey)) {
      return false;
    }

    visitedSet.add(cellKey);
    visited.push(current);

    if (current.row === end.row && current.col === end.col) {
      return true;
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
        parent.set(key(nextCell), current);

        if (dfsHelper(nextCell)) {
          return true;
        }
      }
    }

    return false;
  }

  parent.set(key(start), null);
  found = dfsHelper(start);

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

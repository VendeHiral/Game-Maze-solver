# Game AI Maze Solver - BFS & DFS Visualizer

An interactive web application that demonstrates pathfinding algorithms (BFS and DFS) on a dynamic 20x20 maze grid. Perfect for understanding algorithm behavior through real-time visualization.

## Features

✨ **Interactive Maze Grid**
- Click cells to toggle walls
- Drag start (green) and end (red) nodes to reposition them
- Real-time grid updates

🎨 **Gaming Dark Theme**
- Dark background (#0B0F1A)
- Neon color scheme (Cyan, Blue, Orange, Red, Green, Yellow)
- Smooth animations and transitions
- Responsive design

🤖 **Algorithm Visualization**
- **BFS (Breadth-First Search)**: Cyan wave-like exploration pattern
- **DFS (Depth-First Search)**: Orange deep exploration with backtracking
- Yellow path highlighting for solutions

📊 **Real-Time Statistics**
- Nodes visited count
- Path length
- Execution time
- Historical averages (BFS vs DFS)
- MongoDB integration for run tracking

⚙️ **Controls**
- Run BFS / Run DFS buttons
- Generate Random Maze
- Clear Grid (reset visualization)
- Speed slider (10-200ms per step)

## Tech Stack

### Frontend
- **React 18** (Functional components with hooks)
- **TypeScript** (Type-safe code)
- **CSS3** (Dark theme with neon styling)
- **SWR** (Data fetching and statistics caching)

### Backend
- **Next.js 15** (API routes)
- **Node.js/Express** (API endpoints)
- **TypeScript** (Server-side type safety)

### Database
- **MongoDB** (Optional - for run statistics)
- **Mongoose** (ODM for MongoDB)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Main maze solver page
│   ├── maze.css            # Dark theme & neon styling
│   ├── globals.css         # Tailwind CSS imports
│   ├── api/
│   │   ├── generate-maze/  # Maze generation endpoint
│   │   ├── run-bfs/        # BFS algorithm endpoint
│   │   ├── run-dfs/        # DFS algorithm endpoint
│   │   └── get-stats/      # Statistics retrieval
│
├── components/
│   ├── Header.tsx          # App title & subtitle
│   ├── MazeGrid.tsx        # 20x20 interactive grid
│   ├── ControlPanel.tsx    # Buttons & speed slider
│   └── Statistics.tsx      # Real-time stats display
│
├── lib/
│   ├── mongodb.ts          # MongoDB connection
│   ├── models/
│   │   └── Run.ts          # Run data schema
│   └── algorithms/
│       ├── bfs.ts          # BFS implementation
│       └── dfs.ts          # DFS implementation
│
├── global.d.ts             # TypeScript definitions
├── package.json
└── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB (optional for statistics)

### 1. Clone and Install

```bash
# Install dependencies
pnpm install
# or: npm install
```

### 2. Environment Variables (Optional)

Create a `.env.local` file for MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/maze-solver
```

If you're using MongoDB Atlas (cloud):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maze-solver
```

If no MongoDB URI is set, the app will attempt to connect to local MongoDB on port 27017. Statistics will be gracefully skipped if unavailable.

### 3. Run Development Server

```bash
pnpm dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### 1. **Generate a Maze**
Click "Generate Maze" to create a random maze using recursive backtracking.

### 2. **Create Walls**
Click any empty cell to toggle it as a wall. Hold Shift to place multiple walls.

### 3. **Position Start & End**
- **Green node** = Start position (drag to move)
- **Red node** = End position (drag to move)

### 4. **Adjust Speed**
Use the "Speed" slider to control animation speed:
- Slower (left): 200ms per cell
- Faster (right): 10ms per cell

### 5. **Run Algorithms**

**BFS (Breadth-First Search)**
- Click "Run BFS"
- Cyan cells light up in a wave pattern
- Finds the **shortest path**
- Explores level by level

**DFS (Depth-First Search)**
- Click "Run DFS"
- Orange cells highlight deep exploration
- May not find the shortest path
- Goes deep, backtracks when stuck

### 6. **View Results**
- Yellow path shows the solution
- Statistics panel displays:
  - Nodes visited
  - Path length
  - Time taken (ms)

### 7. **Clear & Retry**
Click "Clear Grid" to reset visualization and try again.

## Algorithm Details

### BFS (Breadth-First Search)

```
Time: O(rows × cols)
Space: O(rows × cols)
Pattern: Wave-like exploration
Guarantee: Shortest path (if one exists)
```

**How it works:**
1. Starts from the starting node
2. Explores all neighbors at the current distance
3. Moves to neighbors of explored nodes
4. Uses a queue for FIFO ordering
5. Stops when destination is found

### DFS (Depth-First Search)

```
Time: O(rows × cols)
Space: O(rows × cols)
Pattern: Deep exploration with backtracking
Guarantee: Path (may not be shortest)
```

**How it works:**
1. Starts from the starting node
2. Explores as far as possible along each branch
3. Backtracks when reaching a dead end
4. Uses a stack (recursion) for LIFO ordering
5. Stops when destination is found

## Statistics & MongoDB

If MongoDB is configured, the app tracks:
- Algorithm used (BFS/DFS)
- Nodes visited
- Path length
- Execution time
- Maze complexity

View historical comparisons in the Statistics panel.

### Connecting to MongoDB Atlas

1. Create a free cluster at [mongodb.com](https://mongodb.com)
2. Get your connection string
3. Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maze-solver
```

## Responsive Design

The application is fully responsive:
- **Desktop (1024px+)**: Two-column layout (grid + controls)
- **Tablet (768px+)**: Stacked layout
- **Mobile (<768px)**: Full-width, compact controls

## Performance Optimizations

- ✅ Memoized components and callbacks
- ✅ Efficient grid rendering
- ✅ Abortable animations (can cancel mid-run)
- ✅ SWR caching for statistics
- ✅ Optimized CSS with no animations on walls

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
pnpm dev -p 3001
```

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `.env.local` for correct URI
- If using Atlas, add your IP to whitelist
- The app works without MongoDB (statistics just won't persist)

### Animations Feel Slow/Choppy
- Adjust the Speed slider to a faster setting (right side)
- Reduce grid size if browser performance is low
- Check browser performance settings

### Visited Cells Not Showing
- Ensure you set valid start and end positions
- Check that there's a path between them
- Try "Generate Maze" to create a solvable one

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build for production
npm run build

# This creates an optimized build in .next/
# Deploy the .next/ folder
```

### With MongoDB

Use [MongoDB Atlas](https://mongodb.com/cloud/atlas) for a free cloud database:

1. Create cluster
2. Get connection string
3. Add to environment variables in deployment platform

## Future Enhancements

- [ ] Dijkstra's algorithm
- [ ] A* pathfinding
- [ ] Bidirectional search
- [ ] Weight-based maze generation
- [ ] Leaderboard
- [ ] Algorithm comparison charts
- [ ] Mobile touch controls

## Contributing

Found a bug? Want to add features? Feel free to fork and submit a PR!

## License

MIT - Feel free to use this project for learning and development.

## Author

Created with ❤️ for learning pathfinding algorithms interactively.

---

**Questions?** Check the code comments or run the dev server and experiment!

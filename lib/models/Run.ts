import mongoose from 'mongoose';

const runSchema = new mongoose.Schema(
  {
    algorithm: {
      type: String,
      enum: ['BFS', 'DFS'],
      required: true,
    },
    gridSize: {
      type: Number,
      default: 20,
    },
    nodesVisited: {
      type: Number,
      required: true,
    },
    pathLength: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    mazeComplexity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Run = mongoose.models.Run || mongoose.model('Run', runSchema);

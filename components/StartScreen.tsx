'use client';

import React, { useEffect, useState } from 'react';

interface StartScreenProps {
  onStart: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [fireflies, setFireflies] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random fireflies
    const newFireflies = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setFireflies(newFireflies);
  }, []);

  const difficultyInfo = {
    easy: { size: 12, description: '12x12 Grid - Perfect for beginners', walls: '30%' },
    medium: { size: 16, description: '16x16 Grid - Balanced challenge', walls: '40%' },
    hard: { size: 20, description: '20x20 Grid - Advanced puzzle', walls: '50%' },
  };

  return (
    <div className="start-screen">
      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className="firefly"
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            animationDelay: `${fly.delay}s`,
          }}
        />
      ))}

      <div className="start-container">
        <h2>🌿 Jungle Maze Adventure 🌿</h2>
        
        <p>Navigate through the mystical jungle and find your way out!</p>
        <p>You have 3 minutes to solve the maze. Can you do it?</p>

        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px' }}>SELECT DIFFICULTY</p>
          <div className="difficulty-selector">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                className={`difficulty-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                <div>{diff.toUpperCase()}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '5px' }}>
                  {difficultyInfo[diff].size}x{difficultyInfo[diff].size}
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#999' }}>
            <p>{difficultyInfo[selectedDifficulty].description}</p>
            <p>Wall Density: {difficultyInfo[selectedDifficulty].walls}</p>
          </div>
        </div>

        <button className="start-btn" onClick={() => onStart(selectedDifficulty)}>
          Start Adventure →
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#666' }}>
          ✨ Click to move through empty cells | 🟩 Green = Start | 🔴 Red = End
        </p>
      </div>
    </div>
  );
}

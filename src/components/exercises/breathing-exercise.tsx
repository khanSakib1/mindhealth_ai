"use client";

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';

const breathingCycle = [
  { text: 'Breathe In...', duration: 4000, animation: 'animate-breathe-in' },
  { text: 'Hold', duration: 2000, animation: 'animate-breathe-hold' },
  { text: 'Breathe Out...', duration: 6000, animation: 'animate-breathe-out' },
];

export function BreathingExercise() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setTimeout(() => {
        setCycleIndex((prevIndex) => (prevIndex + 1) % breathingCycle.length);
      }, breathingCycle[cycleIndex].duration);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, cycleIndex]);

  const handleToggle = () => {
    if (!isAnimating) {
      setCycleIndex(0); // Reset to start
    }
    setIsAnimating(!isAnimating);
  };
  
  const currentCycle = breathingCycle[cycleIndex];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg border h-96">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          className={`absolute w-full h-full bg-gradient-to-br from-primary to-accent rounded-full opacity-30 ${isAnimating ? currentCycle.animation : ''}`}
        />
        <div
          className={`w-48 h-48 bg-background rounded-full flex items-center justify-center transition-transform duration-1000 ${isAnimating ? currentCycle.animation : ''}`}
        >
          <span className="text-2xl font-medium text-foreground">
            {isAnimating ? currentCycle.text : 'Ready?'}
          </span>
        </div>
      </div>
      <Button onClick={handleToggle} className="mt-8 w-32" size="lg">
        {isAnimating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {isAnimating ? 'Pause' : 'Start'}
      </Button>
    </div>
  );
}

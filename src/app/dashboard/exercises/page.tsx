'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ChevronRight, Timer, Repeat, Dumbbell } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { SAMPLE_EXERCISES } from '@/lib/constants';

export default function ExercisesPage() {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Mock assignments
  const assignments = SAMPLE_EXERCISES.slice(0, 4).map((ex, i) => ({
    exercise: ex,
    reps: [12, 15, 10, 30][i],
    sets: [3, 3, 3, 1][i],
    holdTime: i === 3 ? 30 : undefined,
    restTime: 60,
    completed: i < 2,
  }));

  const completedCount = assignments.filter((a) => a.completed).length;

  const handleRepClick = () => {
    if (activeExercise === null) return;
    const assignment = assignments[activeExercise];
    if (currentRep < assignment.reps) {
      setCurrentRep((prev) => prev + 1);
    }
    if (currentRep + 1 >= assignment.reps && currentSet < assignment.sets) {
      setTimeout(() => {
        setCurrentSet((prev) => prev + 1);
        setCurrentRep(0);
      }, 1000);
    }
  };

  const resetExercise = () => {
    setCurrentSet(1);
    setCurrentRep(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Exercises</h1>
          <p className="text-muted-foreground text-sm">
            {completedCount} of {assignments.length} exercises completed today
          </p>
        </div>
        <Badge variant="primary" className="text-sm px-3 py-1">
          {Math.round((completedCount / assignments.length) * 100)}% Complete
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white rounded-full h-3 mb-8 border border-border">
        <div
          className="bg-primary rounded-full h-3 transition-all"
          style={{ width: `${(completedCount / assignments.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise List */}
        <div className="lg:col-span-1 space-y-3">
          {assignments.map((assignment, i) => (
            <button
              key={i}
              onClick={() => { setActiveExercise(i); resetExercise(); }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                activeExercise === i
                  ? 'border-primary bg-primary/5'
                  : assignment.completed
                  ? 'border-success/30 bg-success/5'
                  : 'border-border bg-white hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {assignment.completed ? (
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                  ) : (
                    <Dumbbell className="h-5 w-5 text-muted-foreground mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-foreground text-sm">{assignment.exercise.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.holdTime ? `${assignment.holdTime}s hold` : `${assignment.reps} reps`} x {assignment.sets} sets
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Exercise Player */}
        <div className="lg:col-span-2">
          {activeExercise !== null ? (
            <Card>
              <div className="text-center">
                {/* Exercise Video Placeholder */}
                <div className="w-full h-48 bg-muted rounded-xl mb-6 flex items-center justify-center">
                  <Play className="h-16 w-16 text-muted-foreground/30" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {assignments[activeExercise].exercise.name}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {assignments[activeExercise].exercise.description}
                </p>

                {/* Instructions */}
                <div className="text-left mb-6 p-4 bg-muted rounded-xl">
                  <h4 className="font-medium text-foreground text-sm mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {assignments[activeExercise].exercise.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Reps Counter */}
                  <div className="bg-primary/5 rounded-xl p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Repeat className="h-4 w-4 text-primary mr-1" />
                      <span className="text-xs text-primary font-medium">REPS</span>
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      {currentRep}
                      <span className="text-lg text-muted-foreground">/{assignments[activeExercise].reps}</span>
                    </div>
                  </div>

                  {/* Sets Counter */}
                  <div className="bg-secondary/5 rounded-xl p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Dumbbell className="h-4 w-4 text-secondary mr-1" />
                      <span className="text-xs text-secondary font-medium">SET</span>
                    </div>
                    <div className="text-4xl font-bold text-secondary">
                      {currentSet}
                      <span className="text-lg text-muted-foreground">/{assignments[activeExercise].sets}</span>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="bg-accent/5 rounded-xl p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Timer className="h-4 w-4 text-accent mr-1" />
                      <span className="text-xs text-accent font-medium">TIME</span>
                    </div>
                    <div className="text-4xl font-bold text-accent">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button size="lg" onClick={handleRepClick}>
                    + Rep
                  </Button>
                  <Button size="lg" variant="outline" onClick={resetExercise}>
                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                  <Button size="lg" variant="secondary">
                    <CheckCircle className="h-4 w-4 mr-1" /> Complete
                  </Button>
                </div>

                {/* Pain Feedback */}
                <div className="mt-6 p-4 bg-muted rounded-xl">
                  <p className="text-sm font-medium text-foreground mb-2">How does this feel?</p>
                  <div className="flex gap-2 justify-center">
                    {['Too Easy', 'Just Right', 'Too Hard'].map((label) => (
                      <button
                        key={label}
                        className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-white transition-colors cursor-pointer"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16">
              <Dumbbell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select an Exercise</h3>
              <p className="text-muted-foreground text-sm">
                Choose an exercise from the list to start your workout session.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

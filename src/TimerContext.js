import React, { createContext, useState, useCallback, useEffect } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState({}); // { taskId: { seconds, isRunning, totalSeconds } }

  // Initialize or get timer for a task
  const initializeTimer = useCallback((taskId, seconds = 0) => {
    setTimers(prev => ({
      ...prev,
      [taskId]: prev[taskId] || {
        seconds: seconds,
        isRunning: false,
        totalSeconds: seconds
      }
    }));
  }, []);

  // Start timer
  const startTimer = useCallback((taskId) => {
    setTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: true
      }
    }));
  }, []);

  // Pause timer
  const pauseTimer = useCallback((taskId) => {
    setTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: false
      }
    }));
  }, []);

  // Resume timer
  const resumeTimer = useCallback((taskId) => {
    startTimer(taskId);
  }, [startTimer]);

  // Reset timer
  const resetTimer = useCallback((taskId) => {
    setTimers(prev => ({
      ...prev,
      [taskId]: {
        seconds: 0,
        isRunning: false,
        totalSeconds: 0
      }
    }));
  }, []);

  // Increment timer by 1 second
  const incrementTimer = useCallback((taskId) => {
    setTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        seconds: prev[taskId].seconds + 1,
        totalSeconds: prev[taskId].totalSeconds + 1
      }
    }));
  }, []);

  // Add custom time
  const addTime = useCallback((taskId, seconds) => {
    setTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        seconds: prev[taskId].seconds + seconds,
        totalSeconds: prev[taskId].totalSeconds + seconds
      }
    }));
  }, []);

  // Get timer for a task
  const getTimer = useCallback((taskId) => {
    return timers[taskId] || { seconds: 0, isRunning: false, totalSeconds: 0 };
  }, [timers]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Effect to handle timer ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        let hasRunningTimer = false;

        Object.keys(newTimers).forEach(taskId => {
          if (newTimers[taskId].isRunning) {
            newTimers[taskId].seconds += 1;
            newTimers[taskId].totalSeconds += 1;
            hasRunningTimer = true;
          }
        });

        return hasRunningTimer ? newTimers : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TimerContext.Provider
      value={{
        timers,
        initializeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        incrementTimer,
        addTime,
        getTimer,
        formatTime
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Timer, History, Globe, Play, Pause, RotateCcw } from 'lucide-react';

type Mode = 'clock' | 'stopwatch' | 'timer';

// Utility functions using native Date API (replaces Moment.js)
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatStopwatch(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function App() {
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState<Mode>('clock');
  const [isRunning, setIsRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [timerInput, setTimerInput] = useState('60');
  const [inputError, setInputError] = useState('');

  const stopwatchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock mode - update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch and Timer logic
  useEffect(() => {
    // Clear any existing intervals
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
      stopwatchIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Start new interval based on mode
    if (isRunning && mode === 'stopwatch') {
      stopwatchIntervalRef.current = setInterval(() => {
        setSwTime(s => s + 10);
      }, 10);
    } else if (isRunning && mode === 'timer') {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            setIsRunning(false);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }

    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isRunning, mode]);

  // Handle timer input with validation
  const handleTimerInputChange = useCallback((value: string) => {
    // Only allow numbers
    const sanitized = value.replace(/[^\d]/g, '');

    // Validate range (1 second to 24 hours = 86400 seconds)
    const numValue = parseInt(sanitized, 10);
    if (sanitized && (numValue < 1 || numValue > 86400)) {
      setInputError('Enter a value between 1 and 86400 seconds (24 hours)');
    } else {
      setInputError('');
    }

    setTimerInput(sanitized);
  }, []);

  const setTimerFromInput = useCallback(() => {
    const value = parseInt(timerInput, 10);
    if (value >= 1 && value <= 86400) {
      setCountdown(value);
      setInputError('');
    } else if (timerInput) {
      setInputError('Invalid timer value');
    }
  }, [timerInput]);

  const resetStopwatch = useCallback(() => {
    setSwTime(0);
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setCountdown(60);
    setTimerInput('60');
    setIsRunning(false);
    setInputError('');
  }, []);

  const switchMode = useCallback((newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-mono">
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-12 rounded-[3rem] text-center neon-shadow"
      >
        <div className="flex justify-center gap-4 mb-12" role="tablist" aria-label="Clock modes">
          <ModeBtn
            icon={<Clock className="w-5 h-5" />}
            active={mode === 'clock'}
            onClick={() => switchMode('clock')}
            label="Clock mode"
          />
          <ModeBtn
            icon={<History className="w-5 h-5" />}
            active={mode === 'stopwatch'}
            onClick={() => switchMode('stopwatch')}
            label="Stopwatch mode"
          />
          <ModeBtn
            icon={<Timer className="w-5 h-5" />}
            active={mode === 'timer'}
            onClick={() => switchMode('timer')}
            label="Timer mode"
          />
        </div>

        <AnimatePresence mode="wait">
          {mode === 'clock' && (
            <motion.div
              key="clock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              role="tabpanel"
              aria-labelledby="clock-mode"
            >
              <h2 id="clock-mode" className="sr-only">
                Clock Mode
              </h2>
              <time
                id="current-time"
                className="text-8xl md:text-[10rem] font-black text-emerald-400 tracking-tighter leading-none drop-shadow-[0_0_60px_rgba(16,185,129,0.5)]"
                dateTime={time.toISOString()}
              >
                {formatTime(time)}
              </time>
              <p className="text-lg text-emerald-500/50 font-bold tracking-[0.3em] uppercase">
                {formatDate(time)}
              </p>
            </motion.div>
          )}

          {mode === 'stopwatch' && (
            <motion.div
              key="stopwatch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
              role="tabpanel"
              aria-labelledby="stopwatch-mode"
            >
              <h2 id="stopwatch-mode" className="sr-only">
                Stopwatch Mode
              </h2>
              <div
                className="text-8xl md:text-9xl font-black text-blue-400 tracking-tighter uppercase whitespace-nowrap"
                role="timer"
                aria-live="polite"
                aria-label={`Stopwatch time: ${formatStopwatch(swTime)}`}
              >
                {formatStopwatch(swTime)}
              </div>
              <div className="flex justify-center gap-6">
                <ActionBtn
                  icon={isRunning ? <Pause /> : <Play />}
                  onClick={() => setIsRunning(!isRunning)}
                  color="blue"
                  label={isRunning ? 'Pause stopwatch' : 'Start stopwatch'}
                />
                <ActionBtn
                  icon={<RotateCcw />}
                  onClick={resetStopwatch}
                  color="zinc"
                  label="Reset stopwatch"
                />
              </div>
            </motion.div>
          )}

          {mode === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
              role="tabpanel"
              aria-labelledby="timer-mode"
            >
              <h2 id="timer-mode" className="sr-only">
                Timer Mode
              </h2>
              <div
                className="text-8xl md:text-9xl font-black text-amber-400 tracking-tighter"
                role="timer"
                aria-live="polite"
                aria-label={`Timer remaining: ${formatTimer(countdown)}`}
              >
                {formatTimer(countdown)}
              </div>

              {!isRunning && (
                <div className="space-y-4">
                  <label htmlFor="timer-input" className="sr-only">
                    Set timer duration in seconds
                  </label>
                  <input
                    id="timer-input"
                    type="text"
                    inputMode="numeric"
                    value={timerInput}
                    onChange={e => handleTimerInputChange(e.target.value)}
                    onBlur={setTimerFromInput}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        setTimerFromInput();
                        e.currentTarget.blur();
                      }
                    }}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-2xl text-amber-400 font-bold text-center w-40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="60"
                    aria-describedby={inputError ? 'timer-error' : undefined}
                    aria-invalid={!!inputError}
                  />
                  {inputError && (
                    <p id="timer-error" className="text-red-400 text-sm" role="alert">
                      {inputError}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-6">
                <ActionBtn
                  icon={isRunning ? <Pause /> : <Play />}
                  onClick={() => {
                    if (!isRunning) setTimerFromInput();
                    setIsRunning(!isRunning);
                  }}
                  color="amber"
                  disabled={!!inputError}
                  label={isRunning ? 'Pause timer' : 'Start timer'}
                />
                <ActionBtn
                  icon={<RotateCcw />}
                  onClick={resetTimer}
                  color="zinc"
                  label="Reset timer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" aria-hidden="true" />
            <span>LOCAL TIMEZONE: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
          <p>© 2026 Neon Chronos • Portfolio Upgrade 2026-02-02</p>
        </div>
      </motion.div>
    </div>
  );
}

function ModeBtn({
  icon,
  active,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      aria-label={label}
      className={`p-4 rounded-2xl transition-all ${
        active
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'text-zinc-600 hover:text-zinc-300'
      }`}
    >
      {icon}
    </button>
  );
}

function ActionBtn({
  icon,
  onClick,
  color,
  label,
  disabled,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  label: string;
  disabled?: boolean;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    zinc: 'bg-zinc-700 hover:bg-zinc-600 shadow-zinc-500/20',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]}`}
    >
      {icon}
    </button>
  );
}

export default App;

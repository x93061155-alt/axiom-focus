import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  CheckCircle2,
  Coffee,
  ArrowRight
} from 'lucide-react';
import Footer from './Footer';

type TimerMode = 'deep_focus' | 'short_break' | 'long_break' | 'custom';

interface FocusTimerProps {
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
}

const FOCUS_PRESETS = [15, 25, 30, 45, 60] as const;
const STATS_STORAGE_KEY = 'axiom_focus_timer_stats_v1';

export default function FocusTimer({ onOpenInfo }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>('deep_focus');
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [customMinutes, setCustomMinutes] = useState(45);
  const [customInput, setCustomInput] = useState('45');

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [smoothRatio, setSmoothRatio] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [lastCompletedInfo, setLastCompletedInfo] = useState<{
    mode: TimerMode;
    minutes: number;
  } | null>(null);

  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusedMinutes, setTotalFocusedMinutes] = useState(0);

  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(25 * 60 * 1000);
  const completedThisRunRef = useRef<boolean>(false);
  const isSoundOnRef = useRef(isSoundOn);

  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
  }, [isSoundOn]);

  // Load persisted daily session stats safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) {
          setCompletedSessions(typeof parsed.completedSessions === 'number' ? parsed.completedSessions : 0);
          setTotalFocusedMinutes(typeof parsed.totalFocusedMinutes === 'number' ? parsed.totalFocusedMinutes : 0);
        }
      }
    } catch (e) {
      console.error('Failed to load focus timer stats', e);
    }
  }, []);

  const persistStats = useCallback((sessions: number, minutes: number) => {
    try {
      localStorage.setItem(
        STATS_STORAGE_KEY,
        JSON.stringify({
          date: new Date().toDateString(),
          completedSessions: sessions,
          totalFocusedMinutes: minutes,
        })
      );
    } catch (e) {
      console.error('Failed to persist focus timer stats', e);
    }
  }, []);

  const getModeDurationMinutes = useCallback(
    (targetMode: TimerMode) => {
      switch (targetMode) {
        case 'deep_focus':
          return focusMinutes;
        case 'short_break':
          return shortBreakMinutes;
        case 'long_break':
          return longBreakMinutes;
        case 'custom':
          return customMinutes;
      }
    },
    [focusMinutes, shortBreakMinutes, longBreakMinutes, customMinutes]
  );

  const currentDurationMinutes = getModeDurationMinutes(mode);
  const currentMaxDuration = currentDurationMinutes * 60;

  const playCompletionSound = useCallback(() => {
    if (!isSoundOnRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const now = audioCtx.currentTime;

      const playTone = (freq: number, startOffset: number, duration: number, peakGain: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + startOffset);
        gain.gain.setValueAtTime(0.0001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(peakGain, now + startOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      };

      // Pleasant two-note chime
      playTone(587.33, 0, 0.45, 0.22);
      playTone(880, 0.14, 0.65, 0.25);

      setTimeout(() => {
        audioCtx.close().catch(() => {});
      }, 950);
    } catch (e) {
      console.error('Audio synthesizer beep failed', e);
    }
  }, []);

  const resetTimerToDuration = useCallback((durationSeconds: number) => {
    setIsActive(false);
    endTimeRef.current = null;
    completedThisRunRef.current = false;
    remainingMsRef.current = durationSeconds * 1000;
    setSecondsLeft(durationSeconds);
    setSmoothRatio(1);
    setShowSuccessOverlay(false);
  }, []);

  const handleSelectMode = (nextMode: TimerMode) => {
    setMode(nextMode);
    const nextSeconds = getModeDurationMinutes(nextMode) * 60;
    resetTimerToDuration(nextSeconds);
  };

  const handleSelectPreset = (mins: number) => {
    if (mode === 'custom') {
      setCustomMinutes(mins);
      setCustomInput(String(mins));
      resetTimerToDuration(mins * 60);
    } else {
      setMode('deep_focus');
      setFocusMinutes(mins);
      resetTimerToDuration(mins * 60);
    }
  };

  const handleAdjustActiveDuration = (delta: number) => {
    if (mode === 'deep_focus') {
      const next = Math.max(1, Math.min(180, focusMinutes + delta));
      setFocusMinutes(next);
      resetTimerToDuration(next * 60);
    } else if (mode === 'short_break') {
      const next = Math.max(1, Math.min(45, shortBreakMinutes + delta));
      setShortBreakMinutes(next);
      resetTimerToDuration(next * 60);
    } else if (mode === 'long_break') {
      const next = Math.max(5, Math.min(60, longBreakMinutes + delta));
      setLongBreakMinutes(next);
      resetTimerToDuration(next * 60);
    } else {
      const next = Math.max(1, Math.min(180, customMinutes + delta));
      setCustomMinutes(next);
      setCustomInput(String(next));
      resetTimerToDuration(next * 60);
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 180) {
      setCustomMinutes(parsed);
      resetTimerToDuration(parsed * 60);
    }
  };

  const handleCustomInputBlur = () => {
    const parsed = parseInt(customInput, 10);
    const clamped = Number.isNaN(parsed) ? customMinutes : Math.max(1, Math.min(180, parsed));
    setCustomMinutes(clamped);
    setCustomInput(String(clamped));
    resetTimerToDuration(clamped * 60);
  };

  // Timestamp-accurate timer synchronization (resilient to background tab throttling)
  const syncTimer = useCallback(() => {
    if (!endTimeRef.current) return;

    const totalMs = currentMaxDuration * 1000;
    const leftMs = Math.max(0, endTimeRef.current - Date.now());
    remainingMsRef.current = leftMs;

    const nextSeconds = Math.ceil(leftMs / 1000);
    setSecondsLeft(nextSeconds);
    setSmoothRatio(totalMs > 0 ? Math.max(0, Math.min(1, leftMs / totalMs)) : 0);

    if (leftMs <= 0 && !completedThisRunRef.current) {
      completedThisRunRef.current = true;
      endTimeRef.current = null;
      remainingMsRef.current = 0;
      setIsActive(false);
      setSecondsLeft(0);
      setSmoothRatio(0);
      playCompletionSound();

      setLastCompletedInfo({ mode, minutes: currentDurationMinutes });
      setShowSuccessOverlay(true);

      if (mode === 'deep_focus' || mode === 'custom') {
        setCompletedSessions((prevSessions) => {
          const nextSessions = prevSessions + 1;
          setTotalFocusedMinutes((prevMinutes) => {
            const nextMinutes = prevMinutes + currentDurationMinutes;
            persistStats(nextSessions, nextMinutes);
            return nextMinutes;
          });
          return nextSessions;
        });
      }
    }
  }, [currentMaxDuration, currentDurationMinutes, mode, persistStats, playCompletionSound]);

  useEffect(() => {
    if (!isActive) return;

    syncTimer();
    const intervalId = window.setInterval(syncTimer, 100);

    const handleVisibilityOrFocus = () => {
      syncTimer();
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [isActive, syncTimer]);

  const handleStartOrResume = () => {
    setShowSuccessOverlay(false);
    if (remainingMsRef.current <= 0 || secondsLeft <= 0) {
      remainingMsRef.current = currentMaxDuration * 1000;
      setSecondsLeft(currentMaxDuration);
      setSmoothRatio(1);
    }
    completedThisRunRef.current = false;
    endTimeRef.current = Date.now() + remainingMsRef.current;
    setIsActive(true);
  };

  const handlePause = () => {
    if (endTimeRef.current !== null) {
      const leftMs = Math.max(0, endTimeRef.current - Date.now());
      remainingMsRef.current = leftMs;
      setSecondsLeft(Math.ceil(leftMs / 1000));
      setSmoothRatio(currentMaxDuration > 0 ? leftMs / (currentMaxDuration * 1000) : 0);
    }
    endTimeRef.current = null;
    setIsActive(false);
  };

  const handleReset = () => {
    resetTimerToDuration(currentMaxDuration);
  };

  const handleResetStats = () => {
    setCompletedSessions(0);
    setTotalFocusedMinutes(0);
    persistStats(0, 0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPausedMidSession = !isActive && secondsLeft > 0 && secondsLeft < currentMaxDuration;
  const isBreakMode = mode === 'short_break' || mode === 'long_break';

  const statusText = isActive
    ? isBreakMode
      ? 'Recovery Break'
      : 'Focusing'
    : isPausedMidSession
    ? 'Paused'
    : secondsLeft === 0
    ? 'Session Complete'
    : 'Ready';

  const modeTitle =
    mode === 'deep_focus'
      ? 'Focus Session'
      : mode === 'short_break'
      ? 'Short Break'
      : mode === 'long_break'
      ? 'Long Break'
      : 'Custom Session';

  const radius = 112;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - smoothRatio);

  const cycleCompletedCount = completedSessions % 4;

  return (
    <div id="timer-tab" className="flex-1 overflow-y-auto text-[#171717] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-full">
      <div className="max-w-6xl w-full mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F7E7B0] pb-6">
          <div>
            <span className="text-xs font-semibold text-[#A67C00] block mb-1">Deep Work Protocol</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-[#171717]">Pomodoro Focus Timer</h2>
            <p className="text-sm text-[#666666] mt-1.5">Maximize cognitive depth through structured work intervals</p>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-right">
            <div>
              <span className="text-[#666666] block">Completed Sessions</span>
              <span className="text-lg font-bold font-mono tabular-nums text-[#171717]">{completedSessions}</span>
            </div>
            <div className="h-7 w-px bg-[#F7E7B0]" aria-hidden="true" />
            <div>
              <span className="text-[#666666] block">Focus Time Today</span>
              <span className="text-lg font-bold font-mono tabular-nums text-[#A67C00]">{totalFocusedMinutes}m</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto axiom-card rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Completion Overlay */}
          {showSuccessOverlay && (
            <div
              role="dialog"
              aria-live="polite"
              aria-label="Session complete notification"
              className="absolute inset-0 bg-[#FFFFFF]/96 backdrop-blur-md border border-[#D4AF37]/50 rounded-3xl flex flex-col items-center justify-center p-6 sm:p-8 text-center z-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#F7E7B0]/70 flex items-center justify-center text-[#A67C00] mb-4 border border-[#D4AF37]/60 shadow-sm">
                {lastCompletedInfo?.mode === 'short_break' || lastCompletedInfo?.mode === 'long_break' ? (
                  <Coffee size={30} />
                ) : (
                  <CheckCircle2 size={30} />
                )}
              </div>

              <span className="text-xs font-semibold text-[#A67C00] mb-1">
                {lastCompletedInfo?.minutes ?? currentDurationMinutes} Minute Interval Completed
              </span>
              <h3 className="text-2xl font-bold text-[#171717] mb-2 font-display">
                {lastCompletedInfo?.mode === 'short_break'
                  ? 'Short Break Complete'
                  : lastCompletedInfo?.mode === 'long_break'
                  ? 'Long Break Complete'
                  : 'Focus Session Complete'}
              </h3>
              <p className="text-sm text-[#666666] max-w-md mb-6 leading-relaxed">
                {lastCompletedInfo?.mode === 'short_break' || lastCompletedInfo?.mode === 'long_break'
                  ? 'Your recovery interval has ended. Return to deep focus when you are ready for your next block.'
                  : `Outstanding discipline. You have completed ${completedSessions} focus ${
                      completedSessions === 1 ? 'session' : 'sessions'
                    } (${totalFocusedMinutes} mins) today.`}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {lastCompletedInfo?.mode === 'deep_focus' || lastCompletedInfo?.mode === 'custom' ? (
                  <>
                    <button
                      onClick={() =>
                        handleSelectMode(completedSessions > 0 && completedSessions % 4 === 0 ? 'long_break' : 'short_break')
                      }
                      className="px-5 py-2.5 axiom-btn-primary text-xs rounded-xl cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      <Coffee size={14} />
                      <span>
                        {completedSessions > 0 && completedSessions % 4 === 0
                          ? `Take Long Break (${longBreakMinutes}m)`
                          : `Take Short Break (${shortBreakMinutes}m)`}
                      </span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 axiom-btn-secondary text-xs rounded-xl cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      <ArrowRight size={14} />
                      <span>Another Focus Block</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSelectMode('deep_focus')}
                    className="px-5 py-2.5 axiom-btn-primary text-xs rounded-xl cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    <Sparkles size={14} />
                    <span>Start Focus ({focusMinutes}m)</span>
                  </button>
                )}

                <button
                  onClick={() => setShowSuccessOverlay(false)}
                  className="px-4 py-2.5 text-xs font-medium text-[#666666] hover:text-[#171717] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Mode Selector + Sound Control */}
          <div className="w-full flex items-center gap-3 mb-5 relative z-10">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-1 axiom-inset p-1 rounded-xl">
              {(['deep_focus', 'short_break', 'long_break', 'custom'] as const).map((m) => {
                const label =
                  m === 'deep_focus'
                    ? 'Focus'
                    : m === 'short_break'
                    ? 'Short Break'
                    : m === 'long_break'
                    ? 'Long Break'
                    : 'Custom';
                const isSel = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleSelectMode(m)}
                    className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isSel
                        ? 'bg-gradient-to-r from-[#FFF4B0]/75 via-[#F7E7B0]/65 to-[#FFFDF5] text-[#171717] border border-[#D4AF37]/80 shadow-sm'
                        : 'border border-transparent text-[#666666] hover:text-[#171717] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsSoundOn((prev) => !prev)}
              className={`p-2.5 rounded-xl axiom-inset transition-colors cursor-pointer shrink-0 ${
                isSoundOn
                  ? 'text-[#A67C00] border-[#D4AF37]/60 hover:border-[#D4AF37]'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
              title={isSoundOn ? 'Mute completion chime' : 'Enable completion chime'}
              aria-label={isSoundOn ? 'Mute completion chime' : 'Enable completion chime'}
            >
              {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Preset Durations & Custom Duration Controls */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-7 pb-6 border-b border-[#F7E7B0] relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[11px] font-medium text-[#666666] mr-1 whitespace-nowrap">Presets</span>
              {FOCUS_PRESETS.map((mins) => {
                const isActivePreset =
                  (mode === 'deep_focus' && focusMinutes === mins) ||
                  (mode === 'custom' && customMinutes === mins);
                return (
                  <button
                    key={mins}
                    onClick={() => handleSelectPreset(mins)}
                    className={`px-2.5 py-1.5 text-xs font-mono tabular-nums font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isActivePreset
                        ? 'bg-gradient-to-r from-[#FFF4B0]/80 to-[#F7E7B0]/75 text-[#171717] border border-[#D4AF37]'
                        : 'bg-[#FFFDF5] text-[#666666] border border-[#F7E7B0] hover:text-[#171717] hover:border-[#D4AF37]/70'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 axiom-inset px-2.5 py-1 rounded-xl shrink-0">
              <span className="text-[11px] text-[#666666] font-medium pr-1 whitespace-nowrap">
                {mode === 'short_break' ? 'Break' : mode === 'long_break' ? 'Long Break' : 'Duration'}
              </span>
              <button
                onClick={() => handleAdjustActiveDuration(mode === 'custom' ? -5 : -1)}
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#A67C00] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                title={mode === 'custom' ? 'Decrease 5 minutes' : 'Decrease 1 minute'}
                aria-label={mode === 'custom' ? 'Decrease 5 minutes' : 'Decrease 1 minute'}
              >
                <Minus size={13} />
              </button>

              {mode === 'custom' ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={customInput}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    onBlur={handleCustomInputBlur}
                    aria-label="Custom duration in minutes"
                    className="w-12 text-center text-xs font-semibold text-[#171717] font-mono tabular-nums bg-transparent focus:outline-none"
                  />
                  <span className="text-[11px] text-[#666666] font-mono pr-1">m</span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-[#171717] font-mono tabular-nums min-w-[2.75rem] text-center">
                  {currentDurationMinutes}m
                </span>
              )}

              <button
                onClick={() => handleAdjustActiveDuration(mode === 'custom' ? 5 : 1)}
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#A67C00] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                title={mode === 'custom' ? 'Increase 5 minutes' : 'Increase 1 minute'}
                aria-label={mode === 'custom' ? 'Increase 5 minutes' : 'Increase 1 minute'}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Circular Digital Timer Display */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-8 z-10">
            <svg
              className="w-full h-full -rotate-90 drop-shadow-[0_6px_22px_rgba(212,175,55,0.28)]"
              viewBox="0 0 280 280"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="axiomGoldDialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A67C00" />
                  <stop offset="35%" stopColor="#D4AF37" />
                  <stop offset="65%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>

              {/* Precision outer chronometer ticks */}
              {Array.from({ length: 60 }).map((_, index) => {
                const angle = (index * 6 * Math.PI) / 180;
                const isMajor = index % 5 === 0;
                const outerR = 132;
                const innerR = isMajor ? 124 : 128;
                const x1 = 140 + Math.cos(angle) * innerR;
                const y1 = 140 + Math.sin(angle) * innerR;
                const x2 = 140 + Math.cos(angle) * outerR;
                const y2 = 140 + Math.sin(angle) * outerR;
                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#D4AF37' : '#F7E7B0'}
                    strokeWidth={isMajor ? 1.5 : 1}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Track Ring */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-[#F7E7B0] fill-none"
                strokeWidth="9"
              />

              {/* Active Smooth Progress Ring */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                stroke={isBreakMode ? '#15803d' : 'url(#axiomGoldDialGradient)'}
                fill="none"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150 ease-linear"
              />
            </svg>

            <div className="absolute text-center flex flex-col items-center px-4">
              <span className="text-[11px] font-semibold text-[#A67C00] tracking-wide mb-2">
                {modeTitle}
              </span>
              <span
                aria-live="off"
                className="text-5xl sm:text-6xl font-bold font-mono tabular-nums text-[#171717] tracking-tight leading-none"
              >
                {formatTime(secondsLeft)}
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-[#666666] mt-3">
                <span className={isActive ? 'text-[#A67C00] font-semibold' : ''}>{statusText}</span>
                <span className="text-[#D4AF37]" aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{currentDurationMinutes}m goal</span>
              </div>
            </div>
          </div>

          {/* Primary Start / Pause / Resume / Reset Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-10">
            {isActive ? (
              <button
                onClick={handlePause}
                className="min-w-[8.5rem] px-6 py-3 rounded-xl axiom-btn-primary text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                aria-label="Pause timer"
              >
                <Pause size={16} fill="#171717" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={handleStartOrResume}
                className="min-w-[8.5rem] px-6 py-3 rounded-xl axiom-btn-primary text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                aria-label={isPausedMidSession ? 'Resume timer' : 'Start timer'}
              >
                <Play size={16} fill="#171717" />
                <span>{isPausedMidSession ? 'Resume' : 'Start'}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-xl axiom-btn-secondary text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>

          {/* Pomodoro Cycle & Completed Sessions Footer Strip */}
          <div className="w-full mt-8 pt-5 border-t border-[#F7E7B0] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#666666] font-medium">Pomodoro Cycle</span>
              <div className="flex items-center gap-1.5" aria-label={`${cycleCompletedCount} of 4 sessions toward long break`}>
                {[0, 1, 2, 3].map((step) => {
                  const filled = step < cycleCompletedCount;
                  return (
                    <span
                      key={step}
                      className={`h-2 w-6 rounded-full transition-colors ${
                        filled
                          ? 'bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#FFD700]'
                          : 'bg-[#F7E7B0]/65 border border-[#F7E7B0]'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="font-mono tabular-nums text-[#171717] font-semibold">
                {cycleCompletedCount}/4
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#666666]">
              <span>
                Sound: <strong className="text-[#171717] font-semibold">{isSoundOn ? 'On' : 'Muted'}</strong>
              </span>
              {completedSessions > 0 && (
                <>
                  <span className="text-[#D4AF37]" aria-hidden="true">·</span>
                  <button
                    onClick={handleResetStats}
                    className="text-xs text-[#666666] hover:text-[#A67C00] transition-colors cursor-pointer"
                  >
                    Clear Today
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto">
        <Footer idPrefix="timer" onOpenInfo={onOpenInfo} />
      </div>
    </div>
  );
}


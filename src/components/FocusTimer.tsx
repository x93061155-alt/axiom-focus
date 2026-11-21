import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX, Plus, Minus } from 'lucide-react';
import Footer from './Footer';

type TimerMode = 'deep_focus' | 'short_break' | 'long_break' | 'custom';

interface FocusTimerProps {
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
}

export default function FocusTimer({ onOpenInfo }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>('deep_focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [customMinutes, setCustomMinutes] = useState(45);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const modeDurations: Record<Exclude<TimerMode, 'custom'>, number> = {
    deep_focus: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  useEffect(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mode === 'custom') {
      setSecondsLeft(customMinutes * 60);
    } else {
      setSecondsLeft(modeDurations[mode]);
    }
  }, [mode, customMinutes]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const playCompletionSound = () => {
    if (!isSoundOn) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 500);
    } catch (e) {
      console.error('Audio synthesizer beep failed', e);
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playCompletionSound();
            setShowSuccessOverlay(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isSoundOn]);

  const toggleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (mode === 'custom') {
      setSecondsLeft(customMinutes * 60);
    } else {
      setSecondsLeft(modeDurations[mode]);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCustomMinutes = (mins: number) => {
    if (mins < 60) {
      return `${mins} mins`;
    }
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ${remainingMins} mins`;
  };

  const currentMaxDuration = mode === 'custom' ? customMinutes * 60 : modeDurations[mode];
  const progressRatio = secondsLeft / currentMaxDuration;

  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div id="timer-tab" className="flex-1 overflow-y-auto text-[#FFFFFF] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-full">
      <div className="max-w-6xl w-full mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1D3555] pb-6">
          <div>
            <span className="text-xs font-medium text-[#00A3FF] block mb-1">Deep Work Protocol</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-[#FFFFFF]">Pomodoro Focus Timer</h2>
            <p className="text-sm text-[#A8B8CC] mt-1.5">Maximize cognitive depth through structured work intervals</p>
          </div>
        </div>

        <div className="max-w-xl mx-auto axiom-card rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#0066FF]/12 rounded-full blur-3xl pointer-events-none" />

          {/* Completion Overlay */}
          {showSuccessOverlay && (
            <div className="absolute inset-0 bg-[#0B172A]/95 backdrop-blur-md border border-[#00A3FF]/35 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/15 flex items-center justify-center text-[#00A3FF] mb-4 border border-[#00A3FF]/30">
                <Sparkles size={30} />
              </div>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-2 font-display">Axiom Session Complete</h3>
              <p className="text-sm text-[#A8B8CC] max-w-sm mb-6 leading-relaxed">
                You completed your scheduled focus block. Take a short or long recovery break before your next session.
              </p>
              <button
                onClick={() => setShowSuccessOverlay(false)}
                className="px-6 py-2.5 axiom-btn-primary text-xs rounded-xl cursor-pointer"
              >
                Dismiss Notification
              </button>
            </div>
          )}

          {/* Mode Selector + Sound Control */}
          <div className="w-full flex items-center gap-3 mb-9 relative z-10">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-1 axiom-inset p-1 rounded-xl">
              {(['deep_focus', 'short_break', 'long_break', 'custom'] as const).map((m) => {
                const label = m === 'deep_focus' ? 'Deep Focus' : m === 'short_break' ? 'Short Break' : m === 'long_break' ? 'Long Break' : 'Custom';
                const isSel = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isSel
                        ? 'bg-[#0066FF]/25 text-[#FFFFFF] border border-[#00A3FF]/45 shadow-sm'
                        : 'border border-transparent text-[#A8B8CC] hover:text-[#FFFFFF] hover:bg-[#101F35]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className="p-2.5 rounded-xl axiom-inset text-[#A8B8CC] hover:text-[#00A3FF] hover:border-[#00A3FF]/40 transition-colors cursor-pointer shrink-0"
              title={isSoundOn ? 'Mute alarm beep' : 'Unmute alarm beep'}
              aria-label={isSoundOn ? 'Mute alarm beep' : 'Unmute alarm beep'}
            >
              {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Custom Timer Controls */}
          {mode === 'custom' && (
            <div className="flex items-center gap-4 mb-6 axiom-inset px-4 py-2 rounded-xl relative z-10">
              <span className="text-xs text-[#A8B8CC] font-medium">Duration</span>
              <button
                onClick={() => setCustomMinutes(prev => Math.max(1, prev - 5))}
                className="p-1.5 rounded-lg text-[#A8B8CC] hover:text-[#00A3FF] hover:bg-[#101F35] transition-colors cursor-pointer"
                title="Decrease 5 minutes"
                aria-label="Decrease 5 minutes"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold text-[#FFFFFF] font-mono tabular-nums min-w-[4.5rem] text-center">{formatCustomMinutes(customMinutes)}</span>
              <button
                onClick={() => setCustomMinutes(prev => Math.min(180, prev + 5))}
                className="p-1.5 rounded-lg text-[#A8B8CC] hover:text-[#00A3FF] hover:bg-[#101F35] transition-colors cursor-pointer"
                title="Increase 5 minutes"
                aria-label="Increase 5 minutes"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {/* Circular Digital Timer Display */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-9 z-10">
            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_24px_rgba(0,163,255,0.2)]" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r={radius}
                className="stroke-[#1D3555] fill-none"
                strokeWidth="8"
              />
              <circle
                cx="128"
                cy="128"
                r={radius}
                className="stroke-[#00A3FF] fill-none transition-all duration-300"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute text-center flex flex-col items-center">
              <span className="text-5xl font-bold font-mono tabular-nums text-[#FFFFFF] tracking-tight leading-none">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs font-medium text-[#A8B8CC] mt-2.5 tracking-wide">
                {isActive ? 'Focusing' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-5 relative z-10">
            <button
              onClick={handleReset}
              className="w-12 h-12 rounded-full axiom-btn-secondary flex items-center justify-center cursor-pointer"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw size={17} />
            </button>

            <button
              onClick={toggleStart}
              className="w-16 h-16 rounded-full axiom-btn-primary flex items-center justify-center cursor-pointer"
              title={isActive ? 'Pause timer' : 'Start focus'}
              aria-label={isActive ? 'Pause timer' : 'Start focus'}
            >
              {isActive ? <Pause size={24} fill="#FFFFFF" /> : <Play size={24} fill="#FFFFFF" className="ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto">
        <Footer idPrefix="timer" onOpenInfo={onOpenInfo} />
      </div>
    </div>
  );
}

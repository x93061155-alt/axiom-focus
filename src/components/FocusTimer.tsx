import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Sparkles, Volume2, VolumeX, Plus, Minus } from 'lucide-react';
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

  // Mode durations in seconds
  const modeDurations: Record<Exclude<TimerMode, 'custom'>, number> = {
    deep_focus: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  // Synchronize timer with mode selections
  useEffect(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mode === 'custom') {
      setSecondsLeft(customMinutes * 60);
    } else {
      setSecondsLeft(modeDurations[mode]);
    }
  }, [mode, customMinutes]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Beep synthesizer using Web Audio API (totally secure and works without external MP3 files!)
  const playCompletionSound = () => {
    if (!isSoundOn) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

      oscillator.start();
      // Stop oscillator after 0.5s
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 500);
    } catch (e) {
      console.error('Audio synthesizer beep failed', e);
    }
  };

  // Timer Tick Action
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

  // Helper: Format seconds to HH:MM:SS or MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper: Format custom minutes to standard layout or hours
  const formatCustomMinutes = (mins: number) => {
    if (mins < 60) {
      return `${mins} MINS`;
    }
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) {
      return `${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`;
    }
    return `${hours} ${hours === 1 ? 'HR' : 'HRS'} ${remainingMins} MINS`;
  };

  const currentMaxDuration = mode === 'custom' ? customMinutes * 60 : modeDurations[mode];
  const progressRatio = secondsLeft / currentMaxDuration;

  // Circle dynamic calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div id="timer-tab" className="flex-1 overflow-y-auto bg-[#071324] text-white p-4 sm:p-6 md:p-10 flex flex-col justify-between min-h-screen">
      <div>
        {/* Title exactly matching Screenshot 4 */}
        <div className="mb-8">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold block mb-1">DEEP WORK PROTOCOL</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight">Pomodoro Focus Timer</h2>
          <p className="text-xs text-gray-400 mt-1">Maximize productivity through structured sessions</p>
        </div>

        <div className="max-w-xl mx-auto bg-[#0b1d31] border border-[#142944] rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-2xl relative">
          
          {/* Custom Success Overlay */}
          {showSuccessOverlay && (
            <div className="absolute inset-0 bg-[#071324]/95 border border-[#e0a96d]/40 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Axiom Session Complete!</h3>
              <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
                You have successfully focused for the allocated architectural time block. Take a well-deserved short or long rest.
              </p>
              <button
                onClick={() => setShowSuccessOverlay(false)}
                className="px-5 py-2.5 bg-[#e0a96d] text-[#071324] font-bold text-xs rounded-xl hover:bg-[#f3bf84] transition-colors cursor-pointer"
              >
                DISMISS NOTIFICATION
              </button>
            </div>
          )}

          {/* Sound toggle button */}
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-500 hover:text-[#e0a96d] hover:bg-[#10243d] transition-colors"
            title={isSoundOn ? 'Mute alarm beep' : 'Unmute alarm beep'}
          >
            {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Mode Selector exactly as styled in Screenshot 4 */}
          <div className="flex bg-[#051120] p-1.5 rounded-2xl border border-[#1a2c42]/50 mb-10 w-full">
            {(['deep_focus', 'short_break', 'long_break', 'custom'] as const).map((m) => {
              const label = m === 'deep_focus' ? 'DEEP FOCUS' : m === 'short_break' ? 'SHORT BREAK' : m === 'long_break' ? 'LONG BREAK' : 'CUSTOM TIMER';
              const isSel = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-[10px] md:text-xs font-bold rounded-xl tracking-wider transition-all ${
                    isSel
                      ? 'bg-[#10243d] text-[#e0a96d] border border-[#e0a96d]/20 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* If custom timer, show interactive controls */}
          {mode === 'custom' && (
            <div className="flex items-center gap-4 mb-6 bg-[#051120] px-4 py-2 rounded-xl border border-[#1a2c42]/30">
              <span className="text-xs text-gray-400 font-mono font-medium">CUSTOM DURATION:</span>
              <button
                onClick={() => setCustomMinutes(prev => Math.max(1, prev - 5))}
                className="p-1 text-gray-400 hover:text-[#e0a96d]"
                title="Decrease 5m"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-white font-mono">{formatCustomMinutes(customMinutes)}</span>
              <button
                onClick={() => setCustomMinutes(prev => Math.min(180, prev + 5))}
                className="p-1 text-gray-400 hover:text-[#e0a96d]"
                title="Increase 5m"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {/* Giant Circular Digital Timer Display exactly matching Screenshot 4 */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90">
              {/* Empty background track */}
              <circle
                cx="128"
                cy="128"
                r={radius}
                className="stroke-[#051120] fill-none"
                strokeWidth="8"
              />
              {/* Colored active slider track */}
              <circle
                cx="128"
                cy="128"
                r={radius}
                className="stroke-[#e0a96d] fill-none transition-all duration-300"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={isActive ? strokeDashoffset : strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* In-circle text: Countdown value + Status exactly as Screenshot 4 */}
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-5xl font-extrabold font-display text-white tracking-tight leading-none">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-semibold mt-2 block">
                {isActive ? 'FOCUSING' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Control Buttons exactly as Screenshot 4 layout */}
          <div className="flex items-center gap-6">
            {/* Reset loop button */}
            <button
              onClick={handleReset}
              className="w-11 h-11 rounded-full bg-[#051120] border border-[#1a2c42] flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-[#10243d] active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw size={16} />
            </button>

            {/* Play/Pause giant gold circular button */}
            <button
              onClick={toggleStart}
              className="w-16 h-16 rounded-full bg-[#e0a96d] text-[#071324] flex items-center justify-center hover:bg-[#f3bf84] transition-all shadow-lg shadow-[#e0a96d]/20 active:scale-95"
              title={isActive ? 'Pause timer' : 'Start focus'}
            >
              {isActive ? <Pause size={24} fill="#071324" /> : <Play size={24} fill="#071324" className="ml-1" />}
            </button>
          </div>

        </div>
      </div>

      {/* Corporate Academic Footer credits exactly matching Reusable footer */}
      <Footer idPrefix="timer" onOpenInfo={onOpenInfo} />
    </div>
  );
}

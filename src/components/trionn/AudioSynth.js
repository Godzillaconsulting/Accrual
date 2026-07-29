// Web Audio API Synth for Trionn Kinetic Engine
let audioCtx = null;

export const playSound = (type = 'hover') => {
  try {
    if (typeof window === 'undefined') return;
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';

    let freq1 = 600;
    let freq2 = 1200;
    let dur = 0.03;
    let vol = 0.008;

    if (type === 'hover') {
      freq1 = 600;
      freq2 = 1200;
      dur = 0.03;
      vol = 0.008;
    } else if (type === 'click' || type === 'cta') {
      freq1 = 400;
      freq2 = 800;
      dur = 0.08;
      vol = 0.02;
    } else if (type === 'error') {
      freq1 = 200;
      freq2 = 100;
      dur = 0.15;
      vol = 0.02;
    } else if (type === 'confirm') {
      freq1 = 900;
      freq2 = 1800;
      dur = 0.06;
      vol = 0.015;
    }

    osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + dur);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {
    // Ignore audio context errors on user-restricted environments
  }
};

// Web Audio API Synthesizer for safe zero-latency gameplay audio
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playStealthStep() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

export function playLaser() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

export function playAlertUp() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.linearRampToValueAtTime(320, now + 0.25);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

export function playAlarmSiren() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.linearRampToValueAtTime(850, now + 0.2);
  osc.frequency.linearRampToValueAtTime(450, now + 0.4);
  osc.frequency.linearRampToValueAtTime(850, now + 0.6);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.7);
}

export function playBootsBonus() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.08;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.2);
  });
}

export function playDragonGrowl() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(75, now);
  osc.frequency.linearRampToValueAtTime(45, now + 0.5);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}

export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.12;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

export function playEggHatch() {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Crack pulse
  const crack = ctx.createOscillator();
  const crackGain = ctx.createGain();
  crack.type = 'square';
  crack.frequency.setValueAtTime(200, ctx.currentTime);
  crackGain.gain.setValueAtTime(0.3, ctx.currentTime);
  crackGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  crack.connect(crackGain);
  crackGain.connect(ctx.destination);
  crack.start();
  crack.stop(ctx.currentTime + 0.1);

  // Sparkle arpeggio
  setTimeout(() => {
    playSuccessChime();
  }, 150);
}

export function playMythicFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.09;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.65);
  });
}

export function playEnchantSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.08;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.55);
  });
}

export function playEvolutionSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // 1. Deep cosmic bass resonance
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bass.type = 'sawtooth';
  bass.frequency.setValueAtTime(65.41, now); // C2
  bass.frequency.exponentialRampToValueAtTime(130.81, now + 1.2); // C3
  bassGain.gain.setValueAtTime(0.3, now);
  bassGain.gain.linearRampToValueAtTime(0.4, now + 0.8);
  bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
  bass.connect(bassGain);
  bassGain.connect(ctx.destination);
  bass.start(now);
  bass.stop(now + 2.5);

  // 2. Ascending celestial arpeggio & majestic chords
  const notes = [
    261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00
  ];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.09;
    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.22, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.95);
  });

  // 3. Triumphant sustained chord at peak of transformation
  const peakTime = now + 1.0;
  [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq) => {
    const chordOsc = ctx.createOscillator();
    const chordGain = ctx.createGain();
    chordOsc.type = 'sine';
    chordOsc.frequency.setValueAtTime(freq, peakTime);
    chordGain.gain.setValueAtTime(0.18, peakTime);
    chordGain.gain.exponentialRampToValueAtTime(0.001, peakTime + 1.8);
    chordOsc.connect(chordGain);
    chordGain.connect(ctx.destination);
    chordOsc.start(peakTime);
    chordOsc.stop(peakTime + 1.8);
  });
}

// Native Speech Synthesis for accurate English voice modeling
export function speakEnglish(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9; // Slightly paced for Vietnamese Grade 8 students
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    v => (v.lang === 'en-US' || v.lang === 'en-GB') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Alex'))
  ) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

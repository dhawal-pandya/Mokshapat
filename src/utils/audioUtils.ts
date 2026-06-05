let audioContext: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

export function playLadderSound(): void {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [262, 330, 392, 523].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.12 + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.12 + 0.25);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + i * 0.12); osc.stop(now + i * 0.12 + 0.3);
    });
    setTimeout(() => {
      [523, 659, 784].forEach(freq => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'triangle'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      });
    }, 500);
  } catch { /* audio not supported */ }
}

export function playSnakeSound(): void {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.8;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = noiseBuffer;
    const hissFilter = ctx.createBiquadFilter();
    hissFilter.type = 'highpass'; hissFilter.frequency.value = 3000;
    const hissGain = ctx.createGain();
    hissGain.gain.setValueAtTime(0.15, now);
    hissGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    hissGain.gain.linearRampToValueAtTime(0, now + 0.8);
    noise.connect(hissFilter); hissFilter.connect(hissGain); hissGain.connect(ctx.destination);
    noise.start(now);
    [392, 330, 262, 196].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq, now + i * 0.15);
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.03);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.2);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + i * 0.15); osc.stop(now + i * 0.15 + 0.25);
    });
  } catch { /* audio not supported */ }
}

export function playAchievementSound(): void {
  try {
    const ctx = getCtx(); const now = ctx.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.6);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.7);
    });
  } catch { /* audio not supported */ }
}

export function playWinningSound(): void {
  try {
    const ctx = getCtx(); const now = ctx.currentTime;
    const fanfare = [
      { freq: 392, start: 0,    dur: 0.2 },
      { freq: 523, start: 0.15, dur: 0.2 },
      { freq: 659, start: 0.3,  dur: 0.2 },
      { freq: 784, start: 0.45, dur: 0.4 },
      { freq: 1047,start: 0.7,  dur: 0.6 },
    ];
    fanfare.forEach(n => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'square'; osc.frequency.value = n.freq;
      gain.gain.setValueAtTime(0, now + n.start);
      gain.gain.linearRampToValueAtTime(0.15, now + n.start + 0.02);
      gain.gain.setValueAtTime(0.15, now + n.start + n.dur * 0.7);
      gain.gain.linearRampToValueAtTime(0, now + n.start + n.dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + n.start); osc.stop(now + n.start + n.dur + 0.1);
    });
  } catch { /* audio not supported */ }
}

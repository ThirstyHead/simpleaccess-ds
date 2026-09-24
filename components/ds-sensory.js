/**
 * SimpleAccess Multi-Sensory Engine: Sight, Sound, and Touch
 * Delighting the senses while respecting WCAG 2.2 accessibility standards.
 */

let audioCtx = null;

/**
 * Checks if the user prefers reduced motion or quiet interactions
 */
export function prefersQuiet() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Play a subtle, synthesized earcon using the Web Audio API.
 * Uses an exponential ramp envelope to prevent acoustic transients (clicks/pops).
 * 
 * @param {number} freq - Pitch frequency in Hz (default: 440Hz A4)
 * @param {number} duration - Duration in seconds (default: 0.06s)
 * @param {string} type - Oscillator waveform ('sine' | 'triangle')
 */
export function playEarcon(freq = 440, duration = 0.06, type = 'sine') {
  if (typeof window === 'undefined') return;
  if (prefersQuiet()) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Soft attack and smooth exponential decay
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio contexts may be restricted until first user interaction; fail silently
    console.debug('SimpleAccess Earcon notice:', err);
  }
}

/**
 * Trigger a brief tactile haptic pulse on supported touch devices (e.g. mobile Safari / Chrome).
 * 
 * @param {number|number[]} pattern - Vibration duration in milliseconds (default: 12ms)
 */
export function triggerHaptic(pattern = 12) {
  if (typeof window === 'undefined') return;
  if (prefersQuiet()) return;

  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics not allowed or denied by permissions policy
    }
  }
}

/**
 * Helper to attach simultaneous sound and haptic sensory feedback to an interactive element
 * 
 * @param {HTMLElement} element - The interactive button or control
 * @param {Object} options - Custom sensory parameters
 */
export function attachSensoryFeedback(element, options = {}) {
  if (!element || typeof element.addEventListener !== 'function') return;

  const freq = options.freq || 440;
  const duration = options.duration || 0.06;
  const haptic = options.haptic || 12;

  element.addEventListener('click', () => {
    playEarcon(freq, duration);
    triggerHaptic(haptic);
  });
}

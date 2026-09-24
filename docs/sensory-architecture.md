# SimpleAccess Multi-Sensory Architecture

**Delighting Sight, Sound, and Touch through W3C Standards & Agentic Governance**

*Author: Scott Davis <scott@thirstyhead.com>*  
*Design System: `@simpleaccess/ds`*

---

## 1. Introduction: From Compliance to Delight

Digital accessibility in web development has historically been treated as a punitive checklist—a series of "do nots" enforced by automated linters and fear of litigation.

The **SimpleAccess Multi-Sensory Architecture** flips this paradigm. We view accessibility as a creative medium: designing digital artifacts that fully delight all human senses—specifically **Sight**, **Sound**, and **Touch**. By layering visual contrast, acoustic feedback, and tactile responsiveness onto standard HTML semantics, we create a dramatically superior user experience for everyone, regardless of ability or operating environment.

---

## 2. Sight: High-Contrast Visual Harmony

### 2.1 Contrast Ratios that Shatter Minimums
WCAG 2.2 Success Criterion 1.4.3 requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (Level AA). SimpleAccess establishes an aesthetic baseline that reaches **Level AAA** across every core color combination:

| Element Pair | Foreground | Background | Contrast Ratio | WCAG 2.2 Status |
| :--- | :--- | :--- | :--- | :--- |
| Body Text on Canvas | `#1a1a1a` (Charcoal) | `#ffffff` (White) | **17.6:1** | AAA (Exceeds 7:1) |
| Brand Primary on White | `#002d62` (Navy) | `#ffffff` (White) | **14.3:1** | AAA (Exceeds 7:1) |
| Dark Mode Text on Card | `#f0f4f8` (Off-white) | `#132238` (Dark Surface) | **13.2:1** | AAA (Exceeds 7:1) |
| Accent Button Text | `#002d62` (Navy) | `#ffd700` (Gold) | **9.5:1** | AAA (Exceeds 7:1) |

### 2.2 Unambiguous Focus Ring Indicator (SC 2.4.11)
A major failure in web UI is the barely visible dotted focus ring, or worse, `outline: none`. SimpleAccess implements an unmistakable metallic gold focus ring:
```css
:focus-visible {
    outline: 3px solid var(--sys-color-interactive-focus, #d4af37);
    outline-offset: 3px;
}
```
The 3px outline-offset ensures the focus indicator never collides with or obscures the component’s border or inner text.

### 2.3 Windows High Contrast Mode (`forced-colors: active`)
In Windows High Contrast Mode, authored background colors and custom borders are overridden by the operating system. SimpleAccess provides explicit overrides to guarantee interactive states remain distinct:
```css
@media (forced-colors: active) {
    .m-btn, .m-nav-link:hover, .m-card {
        forced-color-adjust: none;
        border: 2px solid CanvasText;
    }
    :focus-visible {
        outline: 3px solid Highlight;
    }
}
```

---

## 3. Sound: Auditory Feedback & Earcons

Sound on the web is often misapplied as noisy background music or jarring auto-playing videos. SimpleAccess uses sound deliberately as an **earcon**—a brief, informative acoustic cue confirming state transitions.

### 3.1 Zero-Latency Web Audio API Synthesis
Rather than loading bulky MP3 or WAV files over the network (which suffer from network latency, cache misses, and 404 errors), SimpleAccess synthesizes all earcons directly in client memory via the standard **Web Audio API**:

```javascript
export function playEarcon(freq = 440, duration = 0.08, type = 'sine') {
    if (prefersQuiet()) return;

    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Attack: Instant rise to 0.15 volume (comfortable, non-intrusive)
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    // Decay: Smooth exponential falloff to silence to prevent acoustic click/pop
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
}
```

### 3.2 Acoustic Palette
- **Standard Tap / Click:** 440 Hz (Concert A4), 60ms duration.
- **Navigation Toggle:** 587.33 Hz (D5), 80ms duration.
- **Success / Affirmation:** 523.25 Hz &rarr; 659.25 Hz ascending arpeggio (C5 to E5), 140ms duration.

### 3.3 Cognitive Quiet & User Consent
Respect for cognitive differences and sensory overload is paramount:
1. Audio is **never auto-played** on page load. It is strictly gated to direct user interaction.
2. If the user's OS specifies `prefers-reduced-motion: reduce`, audio is automatically silenced.
3. A user mute setting stored in `localStorage` instantly suppresses all synthesized sound.

---

## 4. Touch: Ergonomics & Tactile Haptics

The modern web is navigated with fingers on glass as often as mice on pads. SimpleAccess optimizes for physical ergonomics.

### 4.1 44px Minimum Touch Targets (SC 2.5.8)
WCAG 2.2 Success Criterion 2.5.8 sets a baseline target size of 24x24 CSS pixels. SimpleAccess enforces a standard **44x44px minimum target** (`--sys-touch-min-target`):
```css
.m-nav-link, .m-btn {
    min-height: var(--sys-touch-min-target, 44px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
```
This protects users with essential tremor, arthritis, or large fingertips from accidental mis-clicks.

### 4.2 Web Haptics (`navigator.vibrate`)
On supported mobile devices (Android Chrome, Firefox Mobile), SimpleAccess triggers subtle physical feedback via the **Vibration API**:
- **Tap Pulse:** 12ms micro-vibration (`navigator.vibrate(12)`).
- **Toggle Pulse:** Dual burst pattern (`navigator.vibrate([10, 40, 15])`).

### 4.3 Tactile Spring Depression
CSS transforms give visual depth and tactile responsiveness to button clicks:
```css
.m-btn:active {
    transform: scale(0.97);
    transition: transform 0.05s ease;
}
```

---

## 5. Agentic AI & Conference Presentation Takeaway

When presenting this design system at conferences, the core insight to convey is:

> **"You cannot scale autonomous AI development without an unambiguous, standards-based design system."**

By constraining AI coding models (Gemini-3.8-flash, Gemma-4-31B, Gemma-4-26B) to strict SMACSS classes, W3C DTCG tokens, and an `llms.txt` index, we eliminate hallucinated styles, prevent design drift across hundreds of pages, and ensure that every page autonomously generated is a multi-sensory masterpiece.

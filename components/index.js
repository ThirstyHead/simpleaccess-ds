/**
 * SimpleAccess Design System Component Barrel
 * Includes: <ds-header>, <ds-nav>, <ds-footer>, and Sensory Engine (Sight, Sound, Touch)
 */

import { DsHeader } from './ds-header.js';
import { DsNav } from './ds-nav.js';
import { DsFooter } from './ds-footer.js';
import { playEarcon, triggerHaptic, attachSensoryFeedback, prefersQuiet } from './ds-sensory.js';

export {
  DsHeader,
  DsNav,
  DsFooter,
  playEarcon,
  triggerHaptic,
  attachSensoryFeedback,
  prefersQuiet
};

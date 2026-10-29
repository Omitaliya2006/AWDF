import { lazy } from 'react';

/**
 * Enhanced lazy loader supporting minimum delay / network simulation.
 * Fulfills Practical 8 Supplementary Problem:
 * "Add a minimum-delay fallback (e.g., 300ms) to avoid a flickering loading state on fast connections."
 *
 * @param {Function} importFunc - Dynamic import function, e.g. () => import('./pages/Projects')
 * @param {number} defaultDelay - Delay in milliseconds (default: 350ms)
 */
export function lazyWithDelay(importFunc, defaultDelay = 350) {
  return lazy(() => {
    // Read throttling setting from window or localStorage if set
    let delay = defaultDelay;
    const throttleSetting = window.__PRACTICAL_8_THROTTLE__ || localStorage.getItem('p8_throttle');
    if (throttleSetting === 'slow3g') {
      delay = 1500; // Simulate Slow 3G chunk download
    } else if (throttleSetting === 'fast3g') {
      delay = 700; // Simulate Fast 3G chunk download
    } else if (throttleSetting === 'instant') {
      delay = 0; // No artificial delay
    }

    const promise = importFunc();

    if (delay <= 0) {
      return promise;
    }

    return Promise.all([
      promise,
      new Promise((resolve) => setTimeout(resolve, delay))
    ]).then(([moduleExports]) => moduleExports);
  });
}

export default lazyWithDelay;

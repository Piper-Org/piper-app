/**
 * Centralised Framer Motion variant definitions.
 * Import from this file — never define magic numbers inline.
 */

import type { Variants, Transition } from 'framer-motion';

// ── Transitions ──────────────────────────────────────────────────────────────

export const springConfig: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const easeConfig: Transition = {
  ease: [0.16, 1, 0.3, 1],
  duration: 0.4,
};

export const fastEase: Transition = {
  ease: [0.16, 1, 0.3, 1],
  duration: 0.2,
};

// ── Page / Route transitions ──────────────────────────────────────────────────

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: easeConfig },
  exit:    { opacity: 0, y: -8, transition: fastEase },
};

// ── Generic entrance variants ─────────────────────────────────────────────────

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: easeConfig },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: easeConfig },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: springConfig },
};

// ── Wizard step slides ────────────────────────────────────────────────────────

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: easeConfig },
  exit:    { opacity: 0, x: -20, transition: fastEase },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: easeConfig },
  exit:    { opacity: 0, x: 20, transition: fastEase },
};

// ── Stagger container ─────────────────────────────────────────────────────────

export const stagger: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// ── Error shake ───────────────────────────────────────────────────────────────

export const shakeVariants: Variants = {
  initial: { x: 0 },
  shake: {
    x: [0, -8, 8, -4, 4, 0],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ── Interactive element gestures (use inline on motion components) ────────────

export const pressable = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: springConfig,
};

export const subtleLift = {
  whileHover: { y: -2, boxShadow: '0 12px 32px oklch(0% 0 0 / 0.4)' },
  whileTap: { scale: 0.98 },
  transition: springConfig,
};

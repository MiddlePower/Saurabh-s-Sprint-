/**
 * Ranked Runner: deterministic obstacle layout generator.
 * This module deliberately does NOT use Math.random or rendering state.
 *
 * A seed and chunk number always produce the same layout.  This is a
 * reproducible practice mode, NOT secure multiplayer or anti-cheat.
 */
(function (root) {
  'use strict';

  function normalizeSeed(input) {
    const value = String(input ?? '').trim();
    if (/^\d+$/.test(value)) return Number(value) >>> 0;
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
    }
    return hash >>> 0;
  }

  function rngFromSeed(seed) {
    let state = normalizeSeed(seed);
    return function nextRandom() {
      state = (state + 0x6D2B79F5) >>> 0;
      let n = state;
      n = Math.imul(n ^ (n >>> 15), n | 1);
      n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
      return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
    };
  }

  const OBSTACLES = Object.freeze(['train', 'barrier', 'luggage', 'cones']);

  function plan(seed, chunkIndex) {
    if (!Number.isSafeInteger(chunkIndex) || chunkIndex < 0) {
      throw new RangeError('chunkIndex must be a non-negative integer');
    }

    // Each chunk derives its own random stream. Cosmetic effects and
    // different rendering frame rates cannot consume course RNG values.
    const combined = (normalizeSeed(seed) ^ Math.imul(chunkIndex + 1, 0x9E3779B1)) >>> 0;
    const random = rngFromSeed(combined);
    const safeLane = Math.floor(random() * 3);
    const pattern = Math.floor(random() * 4);
    const blockedA = (safeLane + 1) % 3;
    const blockedB = (safeLane + 2) % 3;
    const obstacles = [];

    if (pattern === 0) {
      obstacles.push({ type: 'train', lane: blockedA, offset: 24 });
    } else if (pattern === 1) {
      obstacles.push({ type: 'barrier', lane: blockedA, offset: 23 });
      obstacles.push({ type: 'luggage', lane: blockedB, offset: 23 });
    } else if (pattern === 2) {
      obstacles.push({ type: 'cones', lane: blockedA, offset: 23 });
      obstacles.push({ type: 'barrier', lane: blockedB, offset: 23 });
    } else {
      obstacles.push({ type: 'train', lane: blockedA, offset: 28 });
      obstacles.push({ type: 'barrier', lane: blockedB, offset: 14 });
    }

    return { chunkIndex, safeLane, pattern, obstacles };
  }

  const RankedCore = Object.freeze({
    normalizeSeed,
    rngFromSeed,
    plan,
    OBSTACLES
  });

  root.RankedCore = RankedCore;
  if (typeof module !== 'undefined' && module.exports) module.exports = RankedCore;
})(typeof window !== 'undefined' ? window : globalThis);

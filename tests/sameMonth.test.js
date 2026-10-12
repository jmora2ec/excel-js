import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sameMonth } from '../src/utils.js';

test('sameMonth', () => {
  assert.equal(sameMonth(new Date('2025-12-01'), new Date('2025-12-15')), true);
});

test('differentMonth', () => {
  assert.equal(
    sameMonth(new Date('2025-12-01'), new Date('2025-11-15')),
    false,
  );
});

test('differentYear', () => {
  assert.equal(
    sameMonth(new Date('2026-12-01'), new Date('2025-12-15')),
    false,
  );
});

test('sameDate', () => {
  assert.equal(sameMonth(new Date('2025-12-01'), new Date('2025-12-01')), true);
});

test('monthAtEdges', () => {
  assert.equal(sameMonth(new Date('2025-12-01'), new Date('2025-12-31')), true);
});

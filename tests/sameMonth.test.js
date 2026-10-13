import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sameMonth } from '../src/utils.js';

test('sameMonth and same year is true', () => {
  assert.equal(sameMonth(new Date('2025-12-01'), new Date('2025-12-15')), true);
});

test('differentMonth and same year is false', () => {
  assert.equal(
    sameMonth(new Date('2025-12-01'), new Date('2025-11-15')),
    false,
  );
});

test('differentYear and same month is false', () => {
  assert.equal(
    sameMonth(new Date('2026-12-01'), new Date('2025-12-15')),
    false,
  );
});

test('equals date is true', () => {
  assert.equal(sameMonth(new Date('2025-12-01'), new Date('2025-12-01')), true);
});

test('firstDay and lastDay month is true ', () => {
  assert.equal(sameMonth(new Date('2025-12-01'), new Date('2025-12-31')), true);
});

test('lastDay month and firstDay nextMonth is false', () =>
  assert.equal(
    sameMonth(new Date('2024-12-31'), new Date('2025-01-01')),
    false,
  ));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tipoFacturacion } from '../src/utils.js';

test('alta equal to desde', () => {
  assert.equal(
    tipoFacturacion(new Date('2025-12-15'), new Date('2025-12-15')),
    'Proporcional',
  );
});

test('alta before than desde', () => {
  assert.equal(
    tipoFacturacion(new Date('2025-12-15'), new Date('2026-01-01')),
    'Corriente',
  );
});

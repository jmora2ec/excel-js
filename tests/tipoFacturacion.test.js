import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tipoFacturacion } from '../src/domain/billing.js';

test('Proporcional when alta equal desde', () => {
  assert.equal(
    tipoFacturacion(new Date('2025-12-10'), new Date('2025-12-10')),
    'Proporcional',
  );
});

test('Corriente when alta before than desde', () => {
  assert.equal(
    tipoFacturacion(new Date('2025-08-10'), new Date('2026-01-01')),
    'Corriente',
  );
});

test('No determinado when alta greater than desde', () => {
  assert.equal(
    tipoFacturacion(new Date('2025-12-15'), new Date('2025-11-01')),
    'No Determinado',
  );
});

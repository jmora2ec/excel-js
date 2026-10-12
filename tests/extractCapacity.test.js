import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractCapacity } from '../src/utils.js';

const CAPACITY_REGEX = /(\d+)\s*(mbps|gbps)/i;

test('capacity', () => {
  assert.equal(
    extractCapacity('Mega Pack 69 Mbps'.toLowerCase(), CAPACITY_REGEX),
    '69 mbps',
  );
});

test('No capacity', () => {
  assert.equal(
    extractCapacity('Acceso Local RPV MPLS'.toLowerCase(), CAPACITY_REGEX),
    'acceso local rpv mpls',
  );
});

test('Other services', () => {
  assert.equal(
    extractCapacity('Instalacion'.toLowerCase(), CAPACITY_REGEX),
    'instalacion',
  );
});

test('Undefined', () => {
  assert.equal(extractCapacity(undefined, CAPACITY_REGEX), 'null');
});

test('Empty', () => {
  assert.equal(extractCapacity('', CAPACITY_REGEX), 'null');
});

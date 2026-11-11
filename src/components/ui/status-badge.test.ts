import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StatusBadge } from './status-badge';

test('StatusBadge export and definition', () => {
  assert.equal(typeof StatusBadge, 'function');
});

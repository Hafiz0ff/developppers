import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STATUS_STYLES, getStatusStyle, BRAND_COLORS } from './tokens';

test('MDS Design Tokens: Brand Colors', () => {
  assert.equal(BRAND_COLORS.emerald.light, '#107555');
  assert.equal(BRAND_COLORS.emerald.dark, '#10B981');
  assert.equal(BRAND_COLORS.slate.canvasDark, '#0B0F17');
});

test('MDS Design Tokens: Status Styles coverage', () => {
  const statuses = ['active', 'moderation', 'booked', 'sold', 'archived', 'rejected'] as const;
  for (const s of statuses) {
    const config = STATUS_STYLES[s];
    assert.ok(config, `Status ${s} should have a config`);
    assert.ok(config.label, `Status ${s} should have a label`);
    assert.ok(config.dotColor.startsWith('bg-'), `Status ${s} dotColor should be a bg class`);
    assert.ok(config.lineColor.startsWith('border-'), `Status ${s} lineColor should be a border class`);
  }
});

test('MDS Design Tokens: getStatusStyle fallback', () => {
  assert.equal(getStatusStyle('active').label, 'Активно');
  assert.equal(getStatusStyle('unknown_status').label, 'В архиве');
  assert.equal(getStatusStyle(null).label, 'В архиве');
});

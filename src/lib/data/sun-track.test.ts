import test from "node:test";
import assert from "node:assert/strict";
import { getSunLightingStyle } from "../../components/modules/sun-track-widget";

test("Sun Track - getSunLightingStyle calculates proper gradient angles and tints", () => {
  // Morning (09:00): t = 0 -> angle = 45deg
  const morningStyle = getSunLightingStyle(9);
  assert.ok(morningStyle.background, "Morning style should contain background");
  assert.match(
    morningStyle.background as string,
    /linear-gradient\(45deg/,
    "Morning light angle should be 45deg"
  );
  assert.match(
    morningStyle.background as string,
    /rgba\(251, 191, 36/,
    "Morning light should have warm golden amber tint"
  );

  // Midday / Noon (13:30): t = 0.5 -> angle = 90deg
  const noonStyle = getSunLightingStyle(13.5);
  assert.match(
    noonStyle.background as string,
    /linear-gradient\(90deg/,
    "Noon light angle should be 90deg"
  );

  // Evening / Sunset (18:00): t = 1.0 -> angle = 135deg
  const sunsetStyle = getSunLightingStyle(18);
  assert.match(
    sunsetStyle.background as string,
    /linear-gradient\(135deg/,
    "Sunset light angle should be 135deg"
  );
  assert.match(
    sunsetStyle.background as string,
    /rgba\(249, 115, 22/,
    "Sunset light should have warm reddish-orange tint"
  );
});

test("Sun Track - getSunLightingStyle handles out-of-bounds time values gracefully", () => {
  // Clamping before 09:00
  const earlyStyle = getSunLightingStyle(6);
  assert.match(
    earlyStyle.background as string,
    /linear-gradient\(45deg/,
    "Times earlier than 9:00 should clamp to 45deg"
  );

  // Clamping after 18:00
  const lateStyle = getSunLightingStyle(22);
  assert.match(
    lateStyle.background as string,
    /linear-gradient\(135deg/,
    "Times later than 18:00 should clamp to 135deg"
  );
});

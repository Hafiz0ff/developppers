export function canCreateAnotherAd(
  createdAtList: Date[],
  now = new Date(),
  max = 3,
  windowMs = 86_400_000
): boolean {
  const recent = createdAtList.filter((d) => now.getTime() - d.getTime() < windowMs);
  return recent.length < max;
}

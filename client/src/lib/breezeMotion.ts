export function breezeCounterValue(target: number, progress: number): number {
  const bounded = Math.min(1, Math.max(0, progress));
  const eased = 1 - Math.pow(1 - bounded, 3);
  return Math.round(target * eased);
}

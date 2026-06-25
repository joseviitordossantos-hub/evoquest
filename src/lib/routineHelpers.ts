export function getRoutinePeriodStart(frequency: string): Date {
  const now = new Date();
  if (frequency === "WEEKLY") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    now.setDate(now.getDate() - diff);
  }
  now.setHours(0, 0, 0, 0);
  return now;
}

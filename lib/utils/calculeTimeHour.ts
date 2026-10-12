export function calculeTimeMinute(time1: string, time2: string): number {
  if (!time1 || !time2) return 0;
  const parts1 = time1.split(":").map(Number);
  const parts2 = time2.split(":").map(Number);

  const minutes1 = parts1[0] * 60 + parts1[1];
  const minutes2 = parts2[0] * 60 + parts2[1];

  let diff = minutes2 - minutes1;
  if (diff < 0) {
    diff += 24 * 60;
  }

  return diff;
}

export function calculeTimeHour(time1: string, time2: string): string {
  const minutes = calculeTimeMinute(time1, time2);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}
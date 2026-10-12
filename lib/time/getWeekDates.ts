import { startOfWeek, addDays } from "date-fns"

export function getWeekDates(date: Date = new Date()) : Date[] {
  const monday = startOfWeek(new Date(), {weekStartsOn: 1})
  return Array.from({ length: 7}, (_, i) => addDays(monday, i));
}
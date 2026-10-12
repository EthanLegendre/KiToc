import { supabase } from "../supabase";
import { toLocalDateString } from "@/lib/time/calculeTime";
import { startOfWeek, endOfWeek } from "date-fns";

export async function fetchWeekSessions(enfantId: string, referenceDate: Date = new Date())
{
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });

  const { data, error } = await supabase
    .from("session_garde")
    .select("*")
    .eq("enfant_id", enfantId)
    .gte("date", toLocalDateString(weekStart))
    .lt("date", toLocalDateString(weekEnd));
  if (error) return { data: null, error: error.message };

  return { data, error: null };
}
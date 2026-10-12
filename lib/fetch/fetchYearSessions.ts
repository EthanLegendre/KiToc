import { supabase } from "../supabase";
import { toLocalDateString } from "@/lib/time/calculeTime";
import { startOfYear, endOfYear } from "date-fns";

export async function fetchYearSessions(enfantId: string, referenceDate: Date = new Date())
{
  const debutAnnee = startOfYear(referenceDate);
  const finAnnee = endOfYear(referenceDate);

  const { data, error } = await supabase
    .from("session_garde")
    .select("*")
    .eq("enfant_id", enfantId)
    .gte("date", toLocalDateString(debutAnnee))
    .lt("date", toLocalDateString(finAnnee));
  if (error) return { data: null, error: error.message };

  return { data, error: null };
}
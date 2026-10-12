import { supabase } from "../supabase";
import { startOfMonth, endOfMonth} from "date-fns";
import { toLocalDateString } from "@/lib/time/calculeTime";

export async function fetchMonthSessions(enfantId: string, referenceDate: Date = new Date())
{
  const debutSemaine = startOfMonth(referenceDate);
  const finSemaine = endOfMonth(referenceDate);

  const { data, error } = await supabase
    .from("session_garde")
    .select("*")
    .eq("enfant_id", enfantId)
    .gte("date", toLocalDateString(debutSemaine))
    .lt("date", toLocalDateString(finSemaine));

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
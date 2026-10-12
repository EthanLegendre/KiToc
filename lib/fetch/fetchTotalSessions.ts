import { supabase } from "../supabase";

export async function fetchTotalSessions(enfantId: string)
{
  const { data, error } = await supabase
    .from("session_garde")
    .select("*")
    .eq("enfant_id", enfantId)
  if (error) return { data: null, error: error.message };

  return { data, error: null };
}
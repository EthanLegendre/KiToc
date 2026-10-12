import { supabase } from "@/lib/supabase";
import { session } from "@/types/session"
import { mapToSession } from "@/lib/map/mapToSession"

export async function fetchActiveSessionKid(enfantId: string) {
  const { data, error } = await supabase
    .from("session_garde")
    .select("*")
    .eq("enfant_id", enfantId)
    .eq("status", "en_cours")
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  return {
    data: { ...data, start: data.heure_debut, end: data.heure_fin },
    error: null,
  };
}
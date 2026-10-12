import { supabase } from "@/lib/supabase";

export async function checkKidInSession(idKid: string, log?: boolean): Promise<boolean>
{
    const { data: session, error } = await supabase
      .from("session_garde")
      .select("*")
      .eq("enfant_id", idKid)
      .eq("status", "en_cours")
      .maybeSingle();

    if (error) {
        console.error(error.message);
        return false;
    }
    if (log)
      console.log("Kid with id: " + idKid + " is in session: " + (session !== null))
    return session !== null;
}
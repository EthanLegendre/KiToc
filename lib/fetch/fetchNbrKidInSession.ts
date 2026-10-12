import { supabase } from "../supabase";

export async function fetchNbrKidInSession(): Promise<{ count: number | null; error: string | null}> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { count: null, error: "User not connected !"}

    const { count, error } = await supabase
        .from("session_garde")
        .select("*, enfant!inner(*)", { count: "exact", head: true })
        .eq("status", "en_cours")
        .eq("enfant.assmat_id", user.id);
    if (error) return { count: null, error: error.message };

    return { count, error: null};
}
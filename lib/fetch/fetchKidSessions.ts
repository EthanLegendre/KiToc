import { supabase } from "@/lib/supabase"
import { session } from "@/types/session"
import { mapToSession } from "@/lib/map/mapToSession"

export async function fetchKidSessions(childId: string): Promise<{ data: session[] | null; error: string | null}>
{
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { data: null, error: "User not connected"}
    if (!user) return { data: null, error: "User not connected" };

    const { data: sessions, error: errorGetSessions } = await supabase.from("session_garde").select("*").eq("enfant_id", childId);
    if (errorGetSessions) return { data: null, error: errorGetSessions.message};
    if (!sessions) return { data: null, error: "No session find"};

    return { data: sessions.map((session) => mapToSession(session)), error: null}
}
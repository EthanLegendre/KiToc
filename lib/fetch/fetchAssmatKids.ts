import { supabase } from "@/lib/supabase";
import { Child } from "@/types/enfant";
import { mapToChild } from "../map/mapToChild";

export async function fetchAssmatKids():  Promise<{ data: Child[] | null; error: string | null}>
{
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { data: null, error: "User not connected"}
    if (!user) return { data: null, error: "User not connected" };

    const { data: kids, error: errorGetAssmatKids } = await supabase.from("enfant").select("*").eq("assmat_id", user.id);
    if (errorGetAssmatKids) return { data: null, error: errorGetAssmatKids.message };
    if (!kids) return { data: null, error: "Assmat don't have any kids in charge"};

    return {data: kids.map(mapToChild), error: null};
}
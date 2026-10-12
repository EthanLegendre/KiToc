import { mapToChild } from "@/lib/map/mapToChild";
import { supabase } from "@/lib/supabase";
import { Child } from "@/types/enfant";

export async function fetchOneKid(id :string):  Promise<{ data: Child | null; error: string | null}>
{
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { data: null, error: "User not connected"}
    if (!user) return { data: null, error: "User not connected" };

    const { data: child, error: errorGetChild } = await supabase.from("enfant").select("*").eq("id", id).single();
    if (!child) return { data: null, error: "Kid not found" };
    if (errorGetChild) return { data: null, error: errorGetChild.message };

    return {data: mapToChild(child), error: null};
}
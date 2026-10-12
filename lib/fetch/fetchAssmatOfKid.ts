import { supabase } from "../supabase";
import { User } from "./fetchUser";

export async function fetchAssmatOfKid(kidId: string) :Promise<{ assmat: User | null, error: string | null}>
{
    const { data: enfant } = await supabase.from("enfant").select("assmat_id").eq("id", kidId).single();
    if (!enfant) return { assmat: null, error: "Kid not found"}

    const { data, error } = await supabase.from("assmat").select("*").eq("id", enfant.assmat_id).single();
    if (error) return { assmat: null, error: error.message}

    return { assmat: data, error: null};
}
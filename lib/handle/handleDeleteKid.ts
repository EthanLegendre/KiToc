import { supabase } from "@/lib//supabase";

export async function handleDeleteKid(idKid: string) {
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { data: null, error: "User not connected"}
    if (!user) return { data: null, error: "User not connected" };

    const { error } = await supabase.from("enfant").delete().eq("id", idKid);
    if (error) {
        console.error(error);
    }
}
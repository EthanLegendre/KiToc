import { supabase } from "@/lib/supabase";

export type User = {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    created_at: string;
    telephone: string | null;
    updated_at: string;
    
};

export async function fetchUser(role: "assmat" | "parent"): Promise<{ data: User | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: "User not connected"};
    }
    const { data, error} = await supabase
        .from(role)
        .select("*")
        .eq("id", user.id)
        .single();
    if (error) {
        return { data: null, error: error.message};
    }
    return { data, error: null}
}
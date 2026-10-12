import { supabase } from "@/lib/supabase";

export async function handleSignUp(nom: string,
                                   prenom: string,
                                   email: string,
                                   password: string,
                                   role: "assmat" | "parent"): Promise<{ error: string  | null}>
{
    const { data, error} = await supabase.auth.signUp({
        email,
        password
    });
    if (error) return { error: error.message };

    if (data.user) {
        const { error: profileError } = await supabase.from(role).insert({
            id: data.user.id,
            prenom,
            nom,
            email
        });
        if (profileError) {
            return { error: profileError.message };
        }
    }
    return { error: null};
}
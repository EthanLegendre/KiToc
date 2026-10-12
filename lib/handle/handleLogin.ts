import { supabase } from "@/lib/supabase";

export async function handleLogin(email: string, password: string)
{
    const { error } = await supabase.auth.signInWithPassword({email, password});

    if (error) console.error(error);
    return;
}
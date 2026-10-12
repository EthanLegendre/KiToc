import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
}
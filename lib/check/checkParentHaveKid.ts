import { supabase } from "../supabase";

export async function checkParentHaveKid(): Promise<{ haveKidParent: boolean }> {
    const { data: { user }, error: errorGetUser} = await supabase.auth.getUser();

    if (errorGetUser || !user) {
        return { haveKidParent: false};
    }
    const { data: haveKid, error: haveKidError} = await supabase.from("parent_enfant").select("*").eq("parent_id", user.id).maybeSingle();

    if (!haveKid || haveKidError) {
        return { haveKidParent: false};
    }
    return { haveKidParent: true};
}
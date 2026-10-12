import { supabase } from "../supabase";

export async function handleAddParentKid(code: string, pinCode: string): Promise<{ error: string | null }> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return { error: userError.message };
    if (!user) return { error: "Utilisateur non connecter" };

    const { data: kidId, error: errorGetKid } = await supabase.rpc("get_kid_id_by_invitation", {invite_code: code,});
    if (errorGetKid) return { error: errorGetKid.message };
    if (!kidId) return { error: "Aucun enfant trouvé" };

    const { error: errorInsert } = await supabase.from("parent_enfant").insert({
        parent_id: user.id,
        enfant_id: kidId,
        pin_code: pinCode,
    });

    if (errorInsert) {
        if (errorInsert.message.includes("duplicate key")) {
            return { error: "Enfant déja connecter à votre compte"}
        }
        return { error: errorInsert.message };
    }
    return { error: null };
}
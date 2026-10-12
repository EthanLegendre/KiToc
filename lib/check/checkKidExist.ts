import { supabase } from "../supabase";

export async function checkKidExist(code_invitation: string): Promise<{ exist: boolean }>
{
    const { data } = await supabase.rpc("check_invitation_code", {invite_code: code_invitation,});
    if (!data) return { exist: false};
    return { exist: true};
}
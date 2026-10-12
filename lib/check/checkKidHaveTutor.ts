import { supabase } from "@/lib/supabase"

export async function checkKidHaveTutor(childId: string): Promise<{ error: string | null; haveTutor: boolean }>{
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { error: "User not connected", haveTutor: false}
    if (!user) return { error: "User not connected", haveTutor: false};

    const { data, error } = await supabase.from("parent_enfant").select("*").eq("enfant_id", childId);
    console.log(data);
    if (error) {
      return { error: error.message, haveTutor: false};
    }
    if (data == null || data.length === 0)
      return { error: null, haveTutor: false};
    return { error: null, haveTutor: true};
}
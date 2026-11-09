import { supabase } from "../supabase";

export async function handleDeleteWeekPlanning(weekstart: string, weekEnd: string) {
    const { error } = await supabase.from("planning").delete().gte("date", weekstart).lte("date", weekEnd);
    if (error) console.error(error.message);
}
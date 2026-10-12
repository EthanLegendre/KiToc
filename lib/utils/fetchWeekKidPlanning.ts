import { supabase } from "@/lib/supabase";
import { PlanningDay } from "@/types/planning";
import { mapToPlanningDay } from "@/lib/map/mapToPlanningDay";

export async function fetchWeekKidPlanning(dateDebut: string, dateFin: string): Promise<{ data: PlanningDay[] | null; error: string | null}> {
    const { data, error } = await supabase
        .from("planning")
        .select("*, enfant(*)")
        .gte("date", dateDebut)
        .lte("date", dateFin);

    if (error) {
        return { data: null, error: error.message };
    }

    return { data: data.map(mapToPlanningDay), error: null};
}
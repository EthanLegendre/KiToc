import { supabase } from "../supabase";

export async function handleAddToPlanning(idKid: string, heureDebut: Date, heureFin: Date, date: Date)
{
    const { data, error } = await supabase
        .from("planning")
        .insert({
            enfant_id: idKid,
            date: date.toISOString(),
            heure_debut_prevue: heureDebut.toTimeString().split(" ")[0],
            heure_fin_prevue: heureFin.toTimeString().split(" ")[0]
        });
    if (error) {
        console.error(error.message);
        return (error.message);
    }
}
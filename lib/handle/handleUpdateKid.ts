import { supabase } from "../supabase";

export async function handleUpdateKid(nomEnfant: string,
                                    prenomEnfant: string,
                                    dateNaissance: string,
                                    email: string,
                                    tel: string,
                                    nomParent: string,
                                    prenomParent: string,
                                    tauxHoraire: string,
                                    indemniteJournaliere: string,
                                    avatarColor: string,
                                    urlPhoto: string,
                                    kidId: string)
{
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { data: null, error: "User not connected"}
    if (!user) return { data: null, error: "User not connected" };

    const { error } = await supabase.from("enfant").update({
        assmat_id: user.id,
        nom: nomEnfant,
        prenom: prenomEnfant,
        date_naissance: dateNaissance,
        couleur_avatar: avatarColor,
        photo_url: urlPhoto,
        contact_parent_nom: nomParent,
        contact_parent_prenom: prenomParent,
        contact_parent_email: email,
        contact_parent_telephone: tel,
        rémunération_taux_horaire: parseFloat(tauxHoraire),
        indemnité_journalière: parseFloat(indemniteJournaliere),
    }).eq("id", kidId);

    if (error) {
        return {error: error.message};
    }
    return { error: null};
}
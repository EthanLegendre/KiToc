import { supabase } from "@/lib/supabase";
import { generateRequestCode } from "@/lib/utils/generateRequestCode"

export async function handleAddKid(nomEnfant: string,
                                    prenomEnfant: string,
                                    dateNaissance: string,
                                    email: string,
                                    tel: string,
                                    nomParent: string,
                                    prenomParent: string,
                                    tauxHoraire: string,
                                    indemniteJournaliere: string,
                                    avatarColor: string,
                                    urlPhoto: string)
{
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { data: null, error: "User not connected"}
    if (!user) return { data: null, error: "User not connected" };

    const invitationCode = generateRequestCode();

    const { error } = await supabase.from("enfant").insert({
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
        code_invitation: invitationCode,
        rémunération_taux_horaire: parseFloat(tauxHoraire),
        indemnité_journalière: parseFloat(indemniteJournaliere),
    }).select().single();

    if (error) return { data: null, error: error.message};

    return { error: null};
}
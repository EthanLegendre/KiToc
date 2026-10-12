import { Child } from "@/types/enfant";

export function mapToChild(row: any): Child {
    return {
        id:                     row.id,
        assmatId:               row.assmat_id,
        lastname:               row.nom,
        firstname:              row.prenom,
        birthDate:              row.date_naissance,
        avatarColor:            row.couleur_avatar,
        profilePictureUrl:      row.photo_url,
        parentContactFirstname: row.contact_parent_prenom,
        parentContactLastname:  row.contact_parent_nom,
        parentContactEmail:     row.contact_parent_email,
        parentContactNumber:    row.contact_parent_telephone,
        invitationCode:         row.code_invitation,
        createdAt:              row.created_at,
        updatedAt:              row.updated_at,
        hourlyWageRate:         row.rémunération_taux_horaire,
        dailyAllowance:         row.indemnité_journalière
    };
}
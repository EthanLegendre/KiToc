import { session } from "@/types/session"

export function mapToSession(row: any): session
{
    return {
        id:                     row.id,
        kidId:                  row.enfant_id,
        date:                   row.date,
        start:                  row.heure_debut,
        end:                    row.heure_fin,
        status:                 row.status,
        createdAt:              row.created_at,
        updatedAt:              row.updated_at
    };
}
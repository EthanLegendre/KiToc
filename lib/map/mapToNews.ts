import { News } from "@/types/news";

export function mapToNews(row: any): News
{
    return {
        id:                     row.id,
        sessionId:              row.session_garde_id,
        title:                  row.titre,
        description:            row.description,
        photoUrl:               row.photo_url,
        audioUrl:               row.audio_url,
        type:                   row.type,
        createdAt:              row.created_at
    };
}
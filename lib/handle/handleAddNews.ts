import { supabase } from "../supabase";
import { NEWS_TYPE } from "@/lib/constants";

export async function handleAddNews(title:string,
                                    description:string,
                                    photoUrl: string | null,
                                    vocalUrl: string | null,
                                    typeId: number,
                                    sessionId: string): Promise<{ error: string | null}>
{
    const { error } = await supabase.from("news").insert({
        session_garde_id: sessionId,
        titre: title,
        description: description,
        photo_url: photoUrl,
        audio_url: vocalUrl,
        type: NEWS_TYPE[typeId],
    }).select().single()

    if (error) {
        console.error(error);
        return {error: error.message};
    }
    return {error: null};
}
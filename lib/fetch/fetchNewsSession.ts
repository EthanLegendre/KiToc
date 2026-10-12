import { News } from "@/types/news";
import { mapToNews } from "../map/mapToNews";
import { supabase } from "../supabase";
import { fetchActiveSessionKid } from "./fetchActiveSessionKid";

export async function fetchNewsSession(kidId: string): Promise<{ news: News[] | null, error: string | null }>
{
    const { data: session, error } = await fetchActiveSessionKid(kidId);
    if (error) return { news: null, error: error};
    if (!session) return { news: null, error: "L'enfant n'est plus en garde"};

    const { data: news, error: errorGetNews } = await supabase.from("news").select("*").eq("session_garde_id", session.id);
    if (errorGetNews) return { news: null, error: errorGetNews.message};

    return { news: news.map(mapToNews), error: null};
}
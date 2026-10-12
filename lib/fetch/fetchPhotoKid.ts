import { supabase } from "@/lib/supabase"

export async function fetchTotalSessions(enfantId: string, referenceDate: Date = new Date()) {
  const { data, error } = await supabase
    .from("session_garde")
    .select("*")
    .eq("enfant_id", enfantId)

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function fetchPhotoKid(childId: string): Promise<{photoUrlTab: string[] | null; error: string | null}> {
    const photoUrlTab: string[] = [];
    const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
    if (errorGetUser) return { photoUrlTab: null, error: "User not connected"}
    if (!user) return { photoUrlTab: null, error: "User not connected" };

    const { data: sessions } = await fetchTotalSessions(childId);

    if (!sessions) return { photoUrlTab: null, error: "No session find"};

    await Promise.all(
      sessions.map(async (session, index) => {
        const { data: news, error } = await supabase.from("news").select("*").eq("session_garde_id", session.id);
        if (!news || error) return;
        news.forEach((oneNew) => {
          if (oneNew.photo_url) photoUrlTab.push(oneNew.photo_url);
        })
      })
    );
    return { photoUrlTab: photoUrlTab, error: null};
}
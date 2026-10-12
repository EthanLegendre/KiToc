import { supabase } from "@/lib/supabase";
import { stopSession } from "@/lib/handle/handleStopSession"

export async function handleCreateSession(enfantId: string, stop: boolean, codePin: string)
{
  const currentDate = new Date();
  const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
  if (errorGetUser) return { error: "User not connected" };
  if (!user) return { error: "User not connected" };
  let valideCode = false;

  const { data: parentEnfantLinks, error: errorGetParentEnfantLinks } = await supabase
    .from("parent_enfant")
    .select("*")
    .eq("enfant_id", enfantId)
  if (errorGetParentEnfantLinks) return { error: errorGetParentEnfantLinks.message };
  if (!parentEnfantLinks) return { error: "Aucun parent trouvé" };
  parentEnfantLinks.map((link, index) => {
    if (link.pin_code === codePin)
      valideCode = true;
  })
  if (!valideCode) return { error: "Mauvais code pin" };

  if (!stop) {
    const { data, error } = await supabase.from("session_garde").insert({
      enfant_id: enfantId,
      date: currentDate.toISOString().split("T")[0],
      heure_debut: currentDate.toTimeString().split(" ")[0],
      status: "en_cours"
    }).select().single();
    if (error) return { error: error.message };
  } else {
    const { error } = await stopSession(enfantId);
    if (error) return { error: error }
  }
  return { error: null}
}
import { fetchAssmatKids } from "@/lib/fetch/fetchAssmatKids"
import { supabase } from "@/lib/supabase"
import { getWeekDates } from "@/lib/time/getWeekDates"
import { calculeTimeMinute } from "@/lib/utils/calculeTimeHour"
import { endOfDay, startOfDay } from "date-fns"

export async function getWeekEarnData() {
  const { data: { user }, error: errorGetUser } = await supabase.auth.getUser();
  const week = getWeekDates();
  const data = [
    { value: 0, label: "lun" },
    { value: 0, label: "mar" },
    { value: 0, label: "mer" },
    { value: 0, label: "jeu" },
    { value: 0, label: "ven" },
    { value: 0, label: "sam" },
    { value: 0, label: "dim" },
  ]

  if (errorGetUser) {
    console.error(errorGetUser.message);
    return;
  }
  if (!user) {
    console.error("User not connected.");
    return;
  }

  const { data: childs, error: errorGetChild } = await fetchAssmatKids();

  if (errorGetChild) {
    return;
  }
  if (!childs) {
    return;
  }

  let index = 0;

  for (const day of week) {
    const startDay = startOfDay(day);
    const endDay = endOfDay(day);
    let totalMinute = 0;

    await Promise.all(
      childs.map(async (child) => {
        const { data: session, error: errorgetSession } = await supabase
          .from("session_garde")
          .select("*")
          .eq("enfant_id", child.id)
          .gte("updated_at", startDay.toISOString())
          .lte("updated_at", endDay.toISOString());

        if (!session || errorgetSession) return;

        session.forEach((session) => {
          if (!session.heure_fin) return;
          totalMinute += calculeTimeMinute(session.heure_debut, session.heure_fin)
        })
      })
    )

    data[index].value = totalMinute;
    index++;
  }

  return data;
}
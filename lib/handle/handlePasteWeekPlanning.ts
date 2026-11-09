import { supabase } from "../supabase";
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

const TABLE = "planning";
const DATE_COL = "date";

export async function handlePasteWeekPlanning( weekStartCopy: string,
                                            weekEndCopy: string,
                                            weekPastStart: string,
                                            weekPastEnd: string
                                            ): Promise<{ error: string | null }>
{
  const { count, error: countError } = await supabase
    .from(TABLE)
    .select("*", { count: "exact", head: true })
    .gte(DATE_COL, weekPastStart)
    .lte(DATE_COL, weekPastEnd);

  if (countError) return { error: countError.message };
  if (count && count > 0) return { error: "Cette semaine contient déjà des enfants prévus." };

  const { data: source, error: fetchError } = await supabase
    .from(TABLE)
    .select("*")
    .gte(DATE_COL, weekStartCopy)
    .lte(DATE_COL, weekEndCopy);

  if (fetchError) return { error: fetchError.message };
  if (!source || source.length === 0) return { error: "Aucun créneau à copier." };

  const decalage = differenceInCalendarDays(parseISO(weekPastStart), parseISO(weekStartCopy));

  const nouveaux = source.map(({ id, created_at, ...creneau }) => ({
    ...creneau,
    [DATE_COL]: format(addDays(parseISO(creneau[DATE_COL]), decalage), "yyyy-MM-dd"),
  }));

  const { error: insertError } = await supabase.from(TABLE).insert(nouveaux);
  if (insertError) return { error: insertError.message };

  return { error: null };
}
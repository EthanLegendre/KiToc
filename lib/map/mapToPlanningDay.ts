import { PlanningDay } from "@/types/planning";
import { mapToChild } from "./mapToChild";

export function mapToPlanningDay(row: any): PlanningDay {
    return {
        id:                 row.id,
        idChild:            row.enfant_id,
        date:               row.date,
        plannedStartTime:   row.heure_debut_prevue,
        plannedEndTime:     row.heure_fin_prevue,
        child:              mapToChild(row.enfant)
    };
}